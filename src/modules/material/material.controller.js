import {
  getAllMaterialsService,
  createMaterialService,
  getMaterialByIdService,
} from "./material.service.js";

export const getAllMaterialsController = async (req, res) => {
  const materials = await getAllMaterialsService();

  res.status(200).json({ msg: "success", materials });
};

export const createMaterialController = async (req, res) => {
  try {
    let material = await createMaterialService(req.body);

    res.status(201).json({ msg: "material created", material });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const getMaterialByIdController = async (req, res) => {
  const { id } = req.body;

  try {
    let material = getMaterialByIdService(id);

    res.status(200).json({ msg: "material", material });
  } catch (error) {}
};

export const updateMaterialController = async (req, res) => {
  const { id } = req.body;

  try {
    let material = updateMaterialService(id);

    res.status(200).json({ msg: "material updated", material });
  } catch (error) {}
};

export const deleteMaterialController = async (req, res) => {
  const { id } = req.body;

  try {
    let material = deleteMaterialService(id);

    res.status(200).json({ msg: "material deleted", material });
  } catch (error) {}
};
