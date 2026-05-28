import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    materials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material",
        required: true,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // ✅ createdAt, updatedAt avtomatik
  },
);

// ✅ Indexes
orderSchema.index({ user: 1, status: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ date: -1 });

export const Order = mongoose.model("Order", orderSchema);
