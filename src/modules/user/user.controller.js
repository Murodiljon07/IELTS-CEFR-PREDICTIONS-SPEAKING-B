import jwt from "jsonwebtoken";
import { userCardService, userPortfolioService } from "./user.service.js";

export const userCardController = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await userCardService(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const userPortfolio = async (req, res) => {
  try {
    const token = req.headers.authorization.toString().split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userPortfolioService(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
      error: error.message,
    });
  }
};
