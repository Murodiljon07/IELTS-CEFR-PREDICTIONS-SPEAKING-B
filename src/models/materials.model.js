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
  salary: { type: Number, required: true },
  createdAt: { type: Date, default: Date },
  activeCodes: { type: Array, default: [] },
});

export const Material = mongoose.model("Material", matererialSchema);
