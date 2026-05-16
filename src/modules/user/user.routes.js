import e from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { userCardController, userPortfolio } from "./user.controller.js";

const router = e.Router();

router.get("/card", authMiddleware, userCardController);
router.get("/portfolio", authMiddleware, userPortfolio);

export default router;
