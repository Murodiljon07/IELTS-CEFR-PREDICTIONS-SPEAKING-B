import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  // ✅ User o'rniga ObjectId reference ishlatiladi (circular dependency yo'q)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  materials: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
    },
  ],
  totalPrice: { type: Number, required: true },
  // ✅ "types" → "type"
  date: { type: Date, default: Date.now },
});

export const Order = mongoose.model("Order", orderSchema);
