import e from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { userPortfolio, userCart } from "./user.controller.js";

const router = e.Router();

// ✅ Protected routes (require authentication)
router.get("/portfolio", authMiddleware, userPortfolio);
router.put("/cart/:id", authMiddleware, userCart);

export default router;
