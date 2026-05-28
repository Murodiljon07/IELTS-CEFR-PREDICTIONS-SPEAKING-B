import { User } from "../../models/user.model.js";
import { Order } from "../../models/orders.model.js";

export const userPortfolioService = async (id) => {
  try {
    const user = await User.findById(id)
      .select("-password")
      .populate("orders", "status totalPrice date materials")
      .populate("allowedMaterials", "name price category level file");

    const stats = {
      totalOrders: user.orders?.length || 0,
      completedOrders:
        user.orders?.filter((o) => o.status === "completed").length || 0,
      totalMaterials: user.allowedMaterials?.length || 0,
      totalSpent:
        user.orders
          ?.filter((o) => o.status === "completed")
          .reduce((sum, order) => sum + (order.totalPrice || 0), 0) || 0,
    };

    return {
      profile: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isPremiumUser: user.isPremiumUser,
        createdAt: user.createdAt,
      },
      stats,
      orders: user.orders || [],
      materials: user.allowedMaterials || [],
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const userCartService = async (userId, cartData) => {
  try {
    if (!userId) {
      throw new Error("User ID required");
    }

    // Cart logic - order creation ready data
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Return cart data for order creation
    return {
      userId: user._id,
      email: user.email,
      cart: cartData,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
