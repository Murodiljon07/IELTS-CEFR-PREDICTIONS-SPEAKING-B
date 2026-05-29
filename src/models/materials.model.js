import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
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
      data: Buffer,
      contentType: String,
      fileName: String,
      size: Number,
    },

    rate: {
      type: Number,
      required: false,
      min: 0,
      max: 5,
    },
    price: {
      type: Number,
      required: false,
      min: 0,
      default: 0,
    },
    oldPrice: {
      type: Number,
      required: false,
      min: 0,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // ✅ createdAt, updatedAt
  },
);

// ✅ Indexes for better performance
materialSchema.index({ category: 1, level: 1 });
materialSchema.index({ price: 1 });
materialSchema.index({ isPremium: 1 });
materialSchema.index({ name: "text" }); // ✅ search qilish uchun

export const Material = mongoose.model("Material", materialSchema);
