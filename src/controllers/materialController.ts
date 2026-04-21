import { Request, Response } from "express";
import prisma from "../config/database";
import { AuthRequest } from "../middleware/auth";

// Get all materials (public)
export const getMaterials = async (req: Request, res: Response) => {
  try {
    const { category, level, search, page = 1, limit = 12 } = req.query;

    const filters: any = { status: "ACTIVE" };

    if (category && category !== "All") {
      filters.category = category as string;
    }

    if (level && level !== "All") {
      filters.level = level as string;
    }

    if (search) {
      filters.title = { contains: search as string, mode: "insensitive" };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [materials, total] = await Promise.all([
      prisma.material.findMany({
        where: filters,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.material.count({ where: filters }),
    ]);

    res.json({
      materials,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch materials" });
  }
};

// Get single material
export const getMaterialById = async (req: Request, res: Response) => {
  try {
    const material = await prisma.material.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }

    res.json(material);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch material" });
  }
};

// Admin: Create material
export const createMaterial = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      category,
      level,
      type,
      price,
      originalPrice,
      isFree,
      duration,
      lectures,
      instructor,
      fileUrl,
      imageUrl,
    } = req.body;

    const material = await prisma.material.create({
      data: {
        title,
        description,
        category,
        level,
        type,
        price: isFree ? 0 : parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        isFree: isFree || false,
        duration,
        lectures: lectures ? parseInt(lectures) : null,
        instructor,
        fileUrl,
        imageUrl,
      },
    });

    res.status(201).json(material);
  } catch (error) {
    console.error("Create material error:", error);
    res.status(500).json({ error: "Failed to create material" });
  }
};

// Admin: Update material
export const updateMaterial = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updateData = req.body;

    const material = await prisma.material.update({
      where: { id },
      data: updateData,
    });

    res.json(material);
  } catch (error) {
    res.status(500).json({ error: "Failed to update material" });
  }
};

// Admin: Delete material
export const deleteMaterial = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.material.delete({
      where: { id },
    });

    res.json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete material" });
  }
};

// Admin: Toggle material status
export const toggleMaterialStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    const material = await prisma.material.update({
      where: { id },
      data: { status },
    });

    res.json(material);
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
};
