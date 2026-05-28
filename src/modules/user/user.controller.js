import { userPortfolioService, userCartService } from "./user.service.js";

export const userPortfolio = async (req, res) => {
  try {
    // ✅ User already attached by authMiddleware
    const userId = req.user._id;

    const portfolio = await userPortfolioService(userId);

    res.status(200).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userCart = async (req, res) => {
  try {
    // ✅ Get user from authMiddleware
    const userId = req.user._id;
    const { id } = req.params;

    // Validate user matches
    if (userId.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: "You can only modify your own cart",
      });
    }

    const cartData = await userCartService(userId, req.body);

    res.status(200).json({
      success: true,
      data: cartData,
      message: "Cart updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
