import mongoose from "mongoose";

const matererialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true,
  },
  category: {
    type: String,
    enum: [
      "IELTS",
      "grammar",
      "vocabulary",
      "reading",
      "listening",
      "writing",
      "speaking",
    ],
    required: true,
  },
  file: {
    type: String,
    required: false,
  },
  banner: { type: String, required: false },
  rate: { type: Number, required: false },
  price: { type: Number, required: true },
  oldPrice: { type: Number, required: false },
  isPremium: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date },
});

export const Material = mongoose.model("Material", matererialSchema);
