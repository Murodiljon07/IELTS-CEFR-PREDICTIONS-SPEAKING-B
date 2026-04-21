import { Request, Response } from "express";
import prisma from "../config/database";
import { AuthRequest } from "../middleware/auth";
import { generateSixDigitCode } from "../utils/generateCode";

// Admin: Generate activation codes
export const generateCodes = async (req: AuthRequest, res: Response) => {
  try {
    const { materialIds, quantity = 1, expiresInDays = 30 } = req.body;

    if (!materialIds || materialIds.length === 0) {
      return res.status(400).json({ error: "Select at least one material" });
    }

    // Get materials to calculate total price
    const materials = await prisma.material.findMany({
      where: { id: { in: materialIds } },
    });

    const totalPrice = materials.reduce((sum, m) => sum + m.price, 0);

    const codes = [];
    for (let i = 0; i < quantity; i++) {
      const code = generateSixDigitCode();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);

      const activationCode = await prisma.activationCode.create({
        data: {
          code,
          materialIds,
          totalPrice,
          expiresAt,
        },
      });

      codes.push(activationCode);
    }

    res.status(201).json({
      codes,
      totalPrice: totalPrice * quantity,
      message: `${quantity} code(s) generated successfully`,
    });
  } catch (error) {
    console.error("Generate codes error:", error);
    res.status(500).json({ error: "Failed to generate codes" });
  }
};

// User: Activate material with code
export const activateWithCode = async (req: AuthRequest, res: Response) => {
  try {
    const { code } = req.body;
    const userId = req.user!.id;

    // Find activation code
    const activationCode = await prisma.activationCode.findUnique({
      where: { code },
    });

    if (!activationCode) {
      return res.status(404).json({ error: "Invalid activation code" });
    }

    if (activationCode.status !== "ACTIVE") {
      return res.status(400).json({ error: "Code already used or expired" });
    }

    if (activationCode.expiresAt && new Date() > activationCode.expiresAt) {
      return res.status(400).json({ error: "Code has expired" });
    }

    // Mark code as used
    await prisma.activationCode.update({
      where: { id: activationCode.id },
      data: {
        status: "USED",
        usedAt: new Date(),
        userId,
      },
    });

    // Create order for activated materials
    const order = await prisma.order.create({
      data: {
        userId,
        total: activationCode.totalPrice,
        paymentMethod: "TELEGRAM",
        status: "COMPLETED",
        items: {
          create: activationCode.materialIds.map((materialId) => ({
            materialId,
            quantity: 1,
            price: 0, // Already paid via code
          })),
        },
      },
    });

    res.json({
      message: "Materials activated successfully",
      materialIds: activationCode.materialIds,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Activation error:", error);
    res.status(500).json({ error: "Failed to activate" });
  }
};

// Admin: Get all codes
export const getAllCodes = async (req: AuthRequest, res: Response) => {
  try {
    const codes = await prisma.activationCode.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(codes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch codes" });
  }
};

// Admin: Get code statistics
export const getCodeStats = async (req: AuthRequest, res: Response) => {
  try {
    const [total, active, used, expired] = await Promise.all([
      prisma.activationCode.count(),
      prisma.activationCode.count({ where: { status: "ACTIVE" } }),
      prisma.activationCode.count({ where: { status: "USED" } }),
      prisma.activationCode.count({ where: { status: "EXPIRED" } }),
    ]);

    res.json({
      total,
      active,
      used,
      expired,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};
