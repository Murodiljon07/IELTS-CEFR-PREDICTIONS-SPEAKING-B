import e from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { userPortfolio, userCart } from "./user.controller.js";

const router = e.Router();

router.get("/portfolio", authMiddleware, userPortfolio);
router.put("/user-order/:id", authMiddleware, userCart);

export default router;
