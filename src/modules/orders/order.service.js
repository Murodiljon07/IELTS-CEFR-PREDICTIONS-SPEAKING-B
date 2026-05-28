import { Order } from "../../models/orders.model.js";
import { User } from "../../models/user.model.js";
import { Material } from "../../models/materials.model.js";

export const createOrderService = async (userId, materialIds, totalPrice) => {
  try {
    // ✅ Validate materials exist
    const materials = await Material.find({ _id: { $in: materialIds } });
    if (materials.length !== materialIds.length) {
      throw new Error("Some materials not found");
    }

    const order = await Order.create({
      user: userId,
      materials: materialIds,
      totalPrice,
      status: "pending",
    });

    // ✅ Add order to user's orders array
    await User.findByIdAndUpdate(userId, {
      $push: { orders: order._id },
    });

    return order.populate("materials", "name price category");
  } catch (error) {
    throw new Error(error.message);
  }
};

export const approveOrderService = async (orderId) => {
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== "pending") {
      throw new Error(`Order already ${order.status}`);
    }

    // ✅ Grant material access to user
    await User.findByIdAndUpdate(order.user, {
      $addToSet: { allowedMaterials: { $each: order.materials } },
    });

    // ✅ Update order status
    order.status = "completed";
    await order.save();

    return order.populate("materials", "name price category");
  } catch (error) {
    throw new Error(error.message);
  }
};

export const cancelOrderService = async (orderId) => {
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status !== "pending") {
      throw new Error(`Cannot cancel ${order.status} order`);
    }

    // ✅ Remove order from user's orders array
    await User.findByIdAndUpdate(order.user, {
      $pull: { orders: order._id },
    });

    // ✅ Update order status
    order.status = "cancelled";
    await order.save();

    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllOrdersService = async () => {
  return Order.find()
    .sort({ date: -1 })
    .populate("user", "fullName email phone")
    .populate("materials", "name price category level");
};

export const getUserOrdersService = async (userId) => {
  return Order.find({ user: userId })
    .sort({ date: -1 })
    .populate("materials", "name price category level file");
};

export const getOrderByIdService = async (orderId) => {
  return Order.findById(orderId)
    .populate("user", "fullName email phone")
    .populate("materials", "name price category");
};
