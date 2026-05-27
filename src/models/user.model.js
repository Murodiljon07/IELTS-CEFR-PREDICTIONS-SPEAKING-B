import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, default: "user" },
  orders: { type: Array, default: [] },
  isPremiumUser: { type: Boolean, default: false },
});

export const User = mongoose.model("User", userSchema);
