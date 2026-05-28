import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const adminMiddleware = async (req, res, next) => {
  try {
    // ✅ Token check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Get user with role
    const user = await User.findById(decoded.id).select("role");

    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    // ✅ Check admin role
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired." });
    }
    return res.status(500).json({ error: "Server error." });
  }
};

export default adminMiddleware;
