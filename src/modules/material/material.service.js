import { Material } from "../../models/materials.model.js";
import fs from "fs";
import path from "path";

const baseURL = process.env.BASE_URL || "http://localhost:8080";

// Helper function to add full URLs
// material.service.js dagi addFullUrl funksiyasi
const addFullUrl = (material) => {
  if (!material) return material;

  const materialObj = material.toObject ? material.toObject() : { ...material };

  if (materialObj.banner && materialObj.banner !== "") {
    const cleanPath = materialObj.banner.replace(/^\/+/, "");
    materialObj.banner = `${baseURL}/${cleanPath}`;
  }

  if (materialObj.file && materialObj.file !== "") {
    const cleanPath = materialObj.file.replace(/^\/+/, "");
    materialObj.file = `${baseURL}/${cleanPath}`;
  }

  return materialObj;
};

const addFullUrlToArray = (materials) => {
  return materials.map((material) => addFullUrl(material));
};

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

  return addFullUrlToArray(materials);
};

export const createMaterialService = async (data, files = {}) => {
  const { name, level, category, rate, price, oldPrice, isPremium } = data;

  // ✅ Validate required fields (file endi majburiy emas)
  if (!name || !level || !category) {
    throw new Error("Missing required fields: name, level, category");
  }

  // ✅ Agar price 0 yoki bo'sh bo'lsa, free material
  const finalPrice = price ? Number(price) : 0;
  const isFree = finalPrice === 0;

  const materialData = {
    name: name.trim(),
    level,
    category,
    file: files.file || null,
    rate: rate ? Number(rate) : 0,
    price: finalPrice,
    oldPrice: oldPrice ? Number(oldPrice) : undefined,
    isPremium: isPremium === "true" || isPremium === true,
    createdAt: Date.now(),
  };

  const material = await Material.create(materialData);
  return addFullUrl(material);
};

export const getMaterialByIdService = async (id) => {
  if (!id) throw new Error("ID required");
  const material = await Material.findById(id);
  if (!material) throw new Error("Material not found");
  return addFullUrl(material);
};

export const updateMaterialService = async (id, data, files = {}) => {
  if (!id) throw new Error("ID required");

  const existingMaterial = await Material.findById(id);
  if (!existingMaterial) throw new Error("Material not found");

  const updateData = { ...data };

  // Handle file updates
  if (files.file) {
    if (existingMaterial.file && fs.existsSync(existingMaterial.file)) {
      fs.unlinkSync(existingMaterial.file);
    }
    updateData.file = files.file;
  }

  if (files.banner) {
    if (existingMaterial.banner && fs.existsSync(existingMaterial.banner)) {
      fs.unlinkSync(existingMaterial.banner);
    }
    updateData.banner = files.banner;
  }

  // Convert types
  if (updateData.price !== undefined)
    updateData.price = Number(updateData.price);
  if (updateData.rate !== undefined) updateData.rate = Number(updateData.rate);
  if (updateData.oldPrice !== undefined)
    updateData.oldPrice = Number(updateData.oldPrice);
  if (updateData.isPremium !== undefined) {
    updateData.isPremium =
      updateData.isPremium === "true" || updateData.isPremium === true;
  }

  const material = await Material.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return addFullUrl(material);
};

export const deleteMaterialService = async (id) => {
  if (!id) throw new Error("ID required");

  const material = await Material.findById(id);
  if (!material) throw new Error("Material not found");

  return await Material.findByIdAndDelete(id);
};
