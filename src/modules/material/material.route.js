import e from "express";
import {
  getAllMaterialsController,
  createMaterialController,
  getMaterialByIdController,
  updateMaterialController,
  deleteMaterialController,
} from "./material.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import adminMiddleware from "../../middleware/admin.middleware.js";

const router = e.Router();

router.get("/", getAllMaterialsController);

router.post(
  "/create-material",
  authMiddleware,
  adminMiddleware,
  createMaterialController,
);

router.get("/id", getMaterialByIdController);

router.put(
  "/update-material",
  authMiddleware,
  adminMiddleware,
  updateMaterialController,
);

router.delete(
  "/delete-material",
  authMiddleware,
  adminMiddleware,
  deleteMaterialController,
);

export default router;
