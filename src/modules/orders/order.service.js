import { Order } from "../../models/orders.model.js";
import { User } from "../../models/user.model.js";

// User localStorage'dan yuborgan cartni order qilib saqlaydi
export const createOrderService = async (userId, materialIds, totalPrice) => {
  const order = await Order.create({
    user: userId,
    materials: materialIds,
    totalPrice,
    status: "pending",
  });

  // Populatsiya qilib TG ga yuborish uchun to'liq ma'lumot olish
  const populated = await Order.findById(order._id)
    .populate("user", "fullName email phone")
    .populate("materials", "name price category");

  // await sendOrderToTelegram(populated);

  // User modeliga ham order qo'shish
  await User.findByIdAndUpdate(userId, {
    $push: { orders: order._id },
  });

  return order;
};

// Admin tasdiqlaydi → user materialga access oladi
export const approveOrderService = async (orderId) => {
  return await Order.findByIdAndUpdate(
    orderId,
    { status: "completed" },
    { new: true },
  );
};

// Admin bekor qiladi
export const cancelOrderService = async (orderId) => {
  return await Order.findByIdAndUpdate(
    orderId,
    { status: "cancelled" },
    { new: true },
  );
};

export const getAllOrdersService = async () => {
  return Order.find()
    .populate("user", "fullName email phone")
    .populate("materials", "name price category");
};

export const getUserOrdersService = async (userId) => {
  return Order.find({ user: userId }).populate("materials");
};
