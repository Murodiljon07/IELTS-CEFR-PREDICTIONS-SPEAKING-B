import { Material } from "../../models/materials.model.js";

// ========================
// GET ALL MATERIALS
// ========================
export const getAllMaterialsService = async (filters = {}) => {
  const { category, level, isPremium, search } = filters;

  let query = {};

  if (category) query.category = category;
  if (level) query.level = level;
  if (isPremium !== undefined) query.isPremium = isPremium === "true";
  if (search) {
    query.$text = { $search: search };
  }

  const materials = await Material.find(query)
    .sort({ createdAt: -1 })
    .select("-file.data");

  return materials;
};

// ========================
// CREATE MATERIAL
// ========================
export const createMaterialService = async (data, files) => {
  const file = files?.file;

  const materialData = {
    name: data.name,
    level: data.level,
    category: data.category,
    price: Number(data.price || 0),
    rate: Number(data.rate || 0),
    isPremium: data.isPremium === "true",

    file: file
      ? {
          data: file.data,
          contentType: file.contentType,
          fileName: file.fileName,
          size: file.size,
        }
      : null,
  };

  return await Material.create(materialData);
};

export const getMaterialContentController = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material || !material.file?.data) {
      return res.status(404).json({ message: "File not found" });
    }

    const fileName = material.file.fileName || "file";
    const contentType =
      material.file.contentType ||
      mime.lookup(fileName) ||
      "application/octet-stream";

    res.setHeader("Content-Type", contentType);

    // inline = browserda ochadi
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);

    // cache optional (tezlik uchun)
    res.setHeader("Cache-Control", "public, max-age=3600");

    return res.end(material.file.data); // 👈 send emas, end yaxshiroq
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ========================
// GET BY ID
// ========================
export const getMaterialByIdService = async (id) => {
  const material = await Material.findById(id);

  if (!material) {
    throw new Error("Material not found");
  }

  return material;
};

// ========================
// UPDATE
// ========================
export const updateMaterialService = async (id, data, files = {}) => {
  const existingMaterial = await Material.findById(id);

  if (!existingMaterial) {
    throw new Error("Material not found");
  }

  const updateData = { ...data };

  if (files.file) {
    updateData.file = files.file;
  }

  if (updateData.price !== undefined) {
    updateData.price = Number(updateData.price);
  }

  if (updateData.rate !== undefined) {
    updateData.rate = Number(updateData.rate);
  }

  if (updateData.oldPrice !== undefined) {
    updateData.oldPrice = Number(updateData.oldPrice);
  }

  if (updateData.isPremium !== undefined) {
    updateData.isPremium =
      updateData.isPremium === "true" || updateData.isPremium === true;
  }

  const updated = await Material.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return updated;
};

// ========================
// DELETE
// ========================
export const deleteMaterialService = async (id) => {
  if (!id) throw new Error("ID required");

  const material = await Material.findById(id);

  if (!material) {
    throw new Error("Material not found");
  }

  await Material.findByIdAndDelete(id);

  return { success: true };
};
