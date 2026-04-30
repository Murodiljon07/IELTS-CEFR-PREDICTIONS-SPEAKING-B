import { Material } from "../../models/materials.model.js";

export const getAllMaterialsService = async () => {
  return Material.find();
};

export const createMaterialService = async (data) => {
  const { name, level, category, file, banner, rate, salary } = data;

  const material = await Material.create({
    name,
    level,
    category,
    file,
    banner,
    rate,
    salary,
    createdAt: Date.now(),
  });

  return material.save();
};

export const getMaterialByIdService = async (id) => {
  if (!id) {
    throw new Error("Material not found");
  }
  return Material.findById(id);
};

export const updateMaterialService = async (id, data) => {
  if (!id) {
    throw new Error("Material not found");
  }
  return Material.findByIdAndUpdate(id, data, { new: true });
};

export const deleteMaterialService = async (id) => {
  if (!id) {
    throw new Error("Material not found");
  }
  return Material.findByIdAndDelete(id);
};
