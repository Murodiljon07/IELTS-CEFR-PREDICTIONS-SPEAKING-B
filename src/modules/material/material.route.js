import e from "express";
import {
  getAllMaterialsController,
  createMaterialController,
  getMaterialByIdController,
  updateMaterialController,
  deleteMaterialController,
} from "./material.controller.js";

const router = e.Router();

router.get("/", getAllMaterialsController);

router.post("/create-material", createMaterialController);

router.get("/id", getMaterialByIdController);

router.put("/update-material", updateMaterialController);

router.delete("/delete-material", deleteMaterialController);

export default router;
