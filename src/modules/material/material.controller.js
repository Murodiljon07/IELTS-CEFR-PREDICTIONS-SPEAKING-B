// material.controller.js
import {
  getAllMaterialsService,
  createMaterialService,
  getMaterialByIdService,
  deleteMaterialService,
  updateMaterialService,
} from "./material.service.js";
import path from "path";
import fs from "fs";

export const getAllMaterialsController = async (req, res) => {
  try {
    const { category, level, isPremium, search } = req.query;
    const materials = await getAllMaterialsService({
      category,
      level,
      isPremium,
      search,
    });

    res.status(200).json({
      success: true,
      count: materials.length,
      data: materials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createMaterialController = async (req, res) => {
  try {
    const file = req.files?.["file"]?.[0];

    const files = {
      file: file
        ? {
            data: file.buffer,
            contentType: file.mimetype,
            fileName: file.originalname,
            size: file.size,
          }
        : null,
    };

    const material = await createMaterialService(req.body, files);

    res.status(201).json({
      success: true,
      message: "Material created successfully",
      data: material,
    });
  } catch (err) {
    console.error("Create material error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

// ✅ Material faylini ochish (yuklab olmasdan)
export const getMaterialContentController = async (req, res) => {
  try {
    const material = await getMaterialByIdService(req.params.id);

    if (!material?.file?.data) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.setHeader(
      "Content-Type",
      material.file.contentType || "application/octet-stream",
    );

    res.setHeader(
      "Content-Disposition",
      `inline; filename="${material.file.fileName}"`,
    );

    return res.send(material.file.data);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ✅ Asosiy material ma'lumotlarini olish (access status bilan)
// material.controller.js - getMaterialByIdController
export const getMaterialByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await getMaterialByIdService(id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found",
      });
    }

    // ✅ Access tekshiruvi
    const user = req.user;
    let hasAccess = false;

    if (user) {
      // Admin always has access
      if (user.role === "admin") {
        hasAccess = true;
      }
      // Free materials - everyone can access
      else if (material.price === 0) {
        hasAccess = true;
      }
      // Check if user purchased this material
      else if (user.allowedMaterials) {
        hasAccess = user.allowedMaterials.some(
          (m) => m._id?.toString() === id || m.toString() === id,
        );
      }
    } else {
      // Not logged in users can only access free materials
      hasAccess = material.price === 0;
    }

    const materialData = material.toObject
      ? material.toObject()
      : { ...material };
    materialData.hasAccess = hasAccess;

    res.status(200).json({
      success: true,
      data: materialData,
    });
  } catch (error) {
    console.error("Get material error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateMaterialController = async (req, res) => {
  try {
    const { id } = req.params;

    const file = req.files?.["file"]?.[0];

    const files = {
      file: file
        ? {
            data: file.buffer,
            contentType: file.mimetype,
            fileName: file.originalname,
            size: file.size,
          }
        : null,
    };

    const material = await updateMaterialService(id, req.body, files);

    res.status(200).json({
      success: true,
      message: "Material updated successfully",
      data: material,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteMaterialController = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await deleteMaterialService(id);

    res.status(200).json({
      success: true,
      message: "Material deleted successfully",
      data: material,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
