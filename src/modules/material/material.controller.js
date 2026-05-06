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

export const createMaterialController = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.files);

    const file = req.files["file"]?.[0];
    const banner = req.files["banner"]?.[0];

    const material = await createMaterialService(req.body, {
      file: file ? file.path : "",
      banner: banner ? banner.path : "",
    });

    res.status(201).json(material);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
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
