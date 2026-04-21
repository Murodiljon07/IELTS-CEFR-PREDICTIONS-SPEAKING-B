import { Router } from "express";
import {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  toggleMaterialStatus,
} from "../controllers/materialController";
import { authenticate, isAdmin } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/", getMaterials);
router.get("/:id", getMaterialById);

// Admin only routes
router.post("/", authenticate, isAdmin, createMaterial);
router.put("/:id", authenticate, isAdmin, updateMaterial);
router.delete("/:id", authenticate, isAdmin, deleteMaterial);
router.patch("/:id/status", authenticate, isAdmin, toggleMaterialStatus);

export default router;
