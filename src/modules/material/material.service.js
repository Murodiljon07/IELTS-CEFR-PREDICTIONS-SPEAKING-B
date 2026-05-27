import { Material } from "../../models/materials.model.js";

export const getAllMaterialsService = async () => {
  return Material.find();
};

// material.service.js — ikki argument qabul qiladi
export const createMaterialService = async (data, files = {}) => {
  const { name, level, category, rate, price, oldPrice } = data;

  return await Material.create({
    name,
    level,
    category,
    file: files.file || "",
    banner: files.banner || "",
    rate: rate ? Number(rate) : undefined,
    price: Number(price),
    oldPrice: oldPrice ? Number(oldPrice) : undefined,
    createdAt: Date.now(),
  });
};

export const getMaterialByIdService = async (id) => {
  if (!id) throw new Error("ID required");
  const material = await Material.findById(id);
  if (!material) throw new Error("Material not found");
  return material;
};

export const updateMaterialService = async (id, data) => {
  if (!id) throw new Error("ID required");
  return await Material.findByIdAndUpdate(id, data, { new: true });
};

export const deleteMaterialService = async (id) => {
  if (!id) throw new Error("ID required");
  return await Material.findByIdAndDelete(id);
};
