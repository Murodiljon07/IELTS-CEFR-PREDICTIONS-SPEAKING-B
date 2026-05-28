import e from "express";
import {
  createOrderController,
  approveOrderController,
  cancelOrderController,
  getAllOrdersController,
  getMyOrdersController,
  getOrderByIdController,
} from "./order.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import adminMiddleware from "../../middleware/admin.middleware.js";

const router = e.Router();

// ✅ User routes
router.post("/", authMiddleware, createOrderController);
router.get("/my-orders", authMiddleware, getMyOrdersController); // Changed: /my/:id -> /my-orders
router.get("/:id", authMiddleware, getOrderByIdController);

// ✅ Admin only routes
router.get("/", adminMiddleware, getAllOrdersController);
router.patch("/:id/approve", adminMiddleware, approveOrderController);
router.patch("/:id/cancel", adminMiddleware, cancelOrderController);

export default router;
