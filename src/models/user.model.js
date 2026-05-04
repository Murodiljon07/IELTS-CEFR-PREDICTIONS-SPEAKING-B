import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: { type: Number, required: true },

  role: {
    type: String,
    default: "user",
  },
  buyedMaterials: {
    type: Number,
    default: 0,
  },

  card: { type: Array, default: [] },
  myCodes: { type: Array, default: [] },
});

export const User = mongoose.model("User", userSchema);
