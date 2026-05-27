import {
  createOrderService,
  approveOrderService,
  cancelOrderService,
  getAllOrdersService,
  getUserOrdersService,
} from "./order.service.js";

// POST /orders — user checkout qilganda
export const createOrderController = async (req, res) => {
  try {
    const { materialIds, totalPrice, userId } = req.body;

    if (!materialIds?.length) {
      return res.status(400).json({ message: "Cart bo'sh" });
    }

    const order = await createOrderService(userId, materialIds, totalPrice);
    res.status(201).json({ msg: "Order yaratildi, to'lov kutilmoqda", order });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PATCH /orders/:id/approve — admin tasdiqlaydi
export const approveOrderController = async (req, res) => {
  try {
    const order = await approveOrderService(req.params.id);
    res.json({ msg: "Order tasdiqlandi", order });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PATCH /orders/:id/cancel — admin bekor qiladi
export const cancelOrderController = async (req, res) => {
  try {
    const order = await cancelOrderService(req.params.id);
    res.json({ msg: "Order bekor qilindi", order });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /orders — admin barcha orderlarni ko'radi
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await getAllOrdersService();
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /orders/my — user o'z orderlarini ko'radi
export const getMyOrdersController = async (req, res) => {
  try {
    const orders = await getUserOrdersService(req.params.id);
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
