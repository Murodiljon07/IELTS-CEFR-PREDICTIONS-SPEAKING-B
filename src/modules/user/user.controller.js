import jwt from "jsonwebtoken";
import { userPortfolioService, userCartService } from "./user.service.js";

export const userPortfolio = async (req, res) => {
  try {
    const token = await req.headers.authorization.toString().split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

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

export const userCart = async (req, res) => {
  const { id } = req.params;

  try {
    const token = await req.headers.authorization.toString().split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await userCartService(id, req.body);

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
