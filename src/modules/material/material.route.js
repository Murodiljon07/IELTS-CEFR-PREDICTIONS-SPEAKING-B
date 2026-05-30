// material.route.js
import e from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import adminMiddleware from "../../middleware/admin.middleware.js";
import checkAccess from "../../middleware/checkAcces.middleware.js";
import { upload, handleMulterError } from "../../middleware/upload.js";
import {
  getAllMaterialsController,
  createMaterialController,
  getMaterialByIdController,
  getMaterialContentController, // ✅ Yangi controller
  updateMaterialController,
  deleteMaterialController,
} from "./material.controller.js";

const router = e.Router();

// Public routes (hamma ko'rishi mumkin)
router.get("/", getAllMaterialsController);

// ✅ Protected content route - faqat access bo'lsa ochiladi
router.get(
  "/:id/content",
  authMiddleware,
  checkAccess,
  getMaterialContentController,
);

router.get("/:id", authMiddleware, getMaterialByIdController);

// Admin only routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.fields([{ name: "file", maxCount: 1 }]),
  handleMulterError,
  createMaterialController,
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.fields([{ name: "file", maxCount: 1 }]),
  handleMulterError,
  updateMaterialController,
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteMaterialController,
);

export default router;
