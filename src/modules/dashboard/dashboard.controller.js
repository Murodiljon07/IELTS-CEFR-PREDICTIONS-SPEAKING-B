import {
  getDashboardStatsService,
  getRecentOrdersService,
} from "./dashboard.service.js";

export const getDashboardStatsController = async (req, res) => {
  try {
    const stats = await getDashboardStatsService();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRecentOrdersController = async (req, res) => {
  try {
    const orders = await getRecentOrdersService();
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
