const checkAccess = (req, res, next) => {
  const userRole = req.user.role; // authMiddleware dan keladi
  const materialId = req.params.id; // URL dan keladi
  const allowedAccess = req.user.allowedMaterials.includes(materialId); // authMiddleware dan keladi

  if (allowedAccess || userRole === "admin") {
    next(); // Ruxsat berilgan, keyingi middleware yoki route handlerga o'tish
  } else {
    return res.status(403).json({
      error:
        "Access denied. You do not have permission to access this material.",
    });
  }
};
