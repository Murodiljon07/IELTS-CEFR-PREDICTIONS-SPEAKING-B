import { Order } from "../../models/orders.model.js";
import { Material } from "../../models/materials.model.js";
import { User } from "../../models/user.model.js";
import { AccessCode } from "../../models/accessCode.model.js";

export const getDashboardStatsService = async () => {
  try {
    // Get current month range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Parallel queries for better performance
    const [
      totalOrders,
      totalRevenue,
      totalMaterials,
      totalUsers,
      activatedCodes,
      pendingOrders,
      monthlyRevenue,
      lastMonthRevenue,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      Material.countDocuments(),
      User.countDocuments({ role: "user" }),
      AccessCode?.countDocuments({ isUsed: true }) || 0,
      Order.countDocuments({ status: "pending" }),
      Order.aggregate([
        { $match: { status: "completed", createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      Order.aggregate([
        {
          $match: {
            status: "completed",
            createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          },
        },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
    ]);

    const totalRevenueAmount = totalRevenue[0]?.total || 0;
    const monthlyRevenueAmount = monthlyRevenue[0]?.total || 0;
    const lastMonthRevenueAmount = lastMonthRevenue[0]?.total || 0;

    // Calculate growth percentage
    let growth = 0;
    if (lastMonthRevenueAmount > 0) {
      growth =
        ((monthlyRevenueAmount - lastMonthRevenueAmount) /
          lastMonthRevenueAmount) *
        100;
    }

    return {
      totalRevenue: totalRevenueAmount,
      totalOrders,
      totalMaterials,
      totalUsers,
      activatedCodes,
      pendingOrders,
      monthlyRevenue: monthlyRevenueAmount,
      growth: Math.round(growth),
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getRecentOrdersService = async () => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "email fullName")
      .populate("materials", "name");

    return orders.map((order) => ({
      id: order._id,
      user: order.user?.email || "Unknown",
      userName: order.user?.fullName,
      amount: order.totalPrice,
      status: order.status,
      date: order.createdAt,
      materials: order.materials?.map((m) => m.name).join(", "),
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};
