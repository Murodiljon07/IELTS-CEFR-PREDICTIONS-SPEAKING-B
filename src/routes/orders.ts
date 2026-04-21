import { Router } from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController";
import { authenticate, isAdmin } from "../middleware/auth";

const router = Router();

// User routes
router.post("/", authenticate, createOrder);
router.get("/my-orders", authenticate, getUserOrders);
router.get("/:id", authenticate, getOrderById);

// Admin routes
router.get("/admin/all", authenticate, isAdmin, getAllOrders);
router.patch("/:id/status", authenticate, isAdmin, updateOrderStatus);

export default router;
