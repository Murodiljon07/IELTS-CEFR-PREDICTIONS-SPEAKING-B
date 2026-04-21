import { Router } from "express";
import {
  generateCodes,
  activateWithCode,
  getAllCodes,
  getCodeStats,
} from "../controllers/codeController";
import { authenticate, isAdmin } from "../middleware/auth";

const router = Router();

// User routes
router.post("/activate", authenticate, activateWithCode);

// Admin routes
router.post("/generate", authenticate, isAdmin, generateCodes);
router.get("/admin/all", authenticate, isAdmin, getAllCodes);
router.get("/admin/stats", authenticate, isAdmin, getCodeStats);

export default router;
