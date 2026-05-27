import e from "express";
import {
  createOrderController,
  approveOrderController,
  cancelOrderController,
  getAllOrdersController,
  getMyOrdersController,
} from "./order.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import adminMiddleware from "../../middleware/admin.middleware.js";

const router = e.Router();

router.post("/", authMiddleware, createOrderController);
router.get("/my/:id", authMiddleware, getMyOrdersController);
router.get("/", adminMiddleware, getAllOrdersController);
router.patch("/:id/approve", adminMiddleware, approveOrderController);
router.patch("/:id/cancel", adminMiddleware, cancelOrderController);

export default router;
