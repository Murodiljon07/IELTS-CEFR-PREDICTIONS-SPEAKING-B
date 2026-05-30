import e from "express";
import adminMiddleware from "../../middleware/admin.middleware.js";
import {
  getDashboardStatsController,
  getRecentOrdersController,
} from "./dashboard.controller.js";

const router = e.Router();

// ✅ Admin only routes
router.get("/stats", adminMiddleware, getDashboardStatsController);
router.get("/recent-orders", adminMiddleware, getRecentOrdersController);

export default router;
