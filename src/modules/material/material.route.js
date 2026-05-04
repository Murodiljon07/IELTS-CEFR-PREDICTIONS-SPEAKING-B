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
import { upload } from "../../middleware/middleware/upload.js";

const router = e.Router();

router.get("/", getAllMaterialsController);

router.post(
  "/create-material",
  adminMiddleware,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  createMaterialController,
);

router.get("/id", getMaterialByIdController);

router.put("/update-material", adminMiddleware, updateMaterialController);

router.delete("/delete-material", adminMiddleware, deleteMaterialController);

export default router;
