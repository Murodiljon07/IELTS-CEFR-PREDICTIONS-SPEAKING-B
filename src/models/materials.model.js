import mongoose from "mongoose";

const matererialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["beginner", "intermediate", "advanced", "reading"],
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
});

export const Material = mongoose.model("Material", matererialSchema);
