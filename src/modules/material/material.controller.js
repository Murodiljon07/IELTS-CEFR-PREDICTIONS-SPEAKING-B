import {
  getAllMaterialsService,
  createMaterialService,
  getMaterialByIdService,
  deleteMaterialService,
  updateMaterialService,
} from "./material.service.js";

export const getAllMaterialsController = async (req, res) => {
  const materials = await getAllMaterialsService();

  res.status(200).json({ msg: "success", materials });
};

// material.controller.js — bu qism to'g'ri ishlaydi
export const createMaterialController = async (req, res) => {
  try {
    const file = req.files?.["file"]?.[0];
    const banner = req.files?.["banner"]?.[0];

    const material = await createMaterialService(req.body, {
      file: file ? file.path : "",
      banner: banner ? banner.path : "",
    });

    res.status(201).json(material);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMaterialByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    let material = await getMaterialByIdService(id);

    res.status(200).json({ msg: "material", material });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateMaterialController = async (req, res) => {
  const { id } = req.params;

  try {
    let material = await updateMaterialService(id, req.body);

    res.status(200).json({ msg: "material updated", material });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteMaterialController = async (req, res) => {
  const { id } = req.params;

  try {
    let material = await deleteMaterialService(id);

    res.status(200).json({ msg: "material deleted", material });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
