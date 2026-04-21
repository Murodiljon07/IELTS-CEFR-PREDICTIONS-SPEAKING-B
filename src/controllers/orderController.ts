import { Request, Response } from "express";
import prisma from "../config/database";
import { AuthRequest } from "../middleware/auth";
import { sendTelegramOrder } from "../services/telegramService";

// Create order
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { items, total, paymentMethod } = req.body;
    const userId = req.user!.id;

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        paymentMethod,
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            materialId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: { material: true },
        },
      },
    });

    // Send order to Telegram admin
    await sendTelegramOrder(order, req.user!);

    res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Get user orders
export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: {
        items: {
          include: { material: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get single order
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: { material: true },
        },
        user: {
          select: { name: true, email: true, phone: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filters: any = {};
    if (status && status !== "all") {
      filters.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: filters,
        skip,
        take: Number(limit),
        include: {
          user: {
            select: { name: true, email: true },
          },
          items: {
            include: { material: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where: filters }),
    ]);

    res.json({
      orders,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order" });
  }
};
