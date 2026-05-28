// middleware/checkAcces.middleware.js
import { Material } from "../models/materials.model.js";

const checkAccess = async (req, res, next) => {
  try {
    const materialId = req.params.id || req.params.materialId;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Admin has access to everything
    if (user.role === "admin") {
      return next();
    }

    if (!materialId) {
      return res.status(400).json({ error: "Material ID is required" });
    }

    if (user.isPremiumUser) {
      return next();
    }

    // ✅ Materialni bazadan olish
    const material = await Material.findById(materialId);

    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }

    // ✅ Agar material bepul bo'lsa, hammaga ruxsat
    if (material.price === 0) {
      return next();
    }

    // Check if user purchased this material
    const hasAccess = user.allowedMaterials?.some(
      (m) => m._id?.toString() === materialId || m.toString() === materialId,
    );

    if (hasAccess) {
      return next();
    }

    return res.status(403).json({
      error: "Access denied",
      message: "Please purchase this material first.",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default checkAccess;
