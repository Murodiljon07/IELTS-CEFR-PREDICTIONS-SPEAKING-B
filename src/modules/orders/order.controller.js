import {
  createOrderService,
  approveOrderService,
  cancelOrderService,
  getAllOrdersService,
  getUserOrdersService,
  getOrderByIdService,
} from "./order.service.js";

export const createOrderController = async (req, res) => {
  try {
    // ✅ Get userId from authMiddleware
    const userId = req.user._id;
    const { materialIds, totalPrice } = req.body;

    if (!materialIds?.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid total price",
      });
    }

    const order = await createOrderService(userId, materialIds, totalPrice);

    res.status(201).json({
      success: true,
      message: "Order created successfully, waiting for payment confirmation",
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const approveOrderController = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await approveOrderService(id);

    res.json({
      success: true,
      message: "Order approved and materials access granted",
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const cancelOrderController = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await cancelOrderService(id);

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await getAllOrdersService();
    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getMyOrdersController = async (req, res) => {
  try {
    // ✅ Get userId from authMiddleware
    const userId = req.user._id;
    const orders = await getUserOrdersService(userId);

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getOrderByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderByIdService(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ✅ Check if user owns this order or is admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
