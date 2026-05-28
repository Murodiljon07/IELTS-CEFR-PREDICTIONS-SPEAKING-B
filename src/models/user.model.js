import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }], // ✅ Array -> Reference
  allowedMaterials: [{ type: mongoose.Schema.Types.ObjectId, ref: "Material" }], // ✅ Access control
  isPremiumUser: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);
