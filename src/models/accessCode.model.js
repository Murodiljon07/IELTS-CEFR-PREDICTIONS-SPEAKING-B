import mongoose from "mongoose";

const accessCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    usedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    usedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

accessCodeSchema.index({ code: 1 });
accessCodeSchema.index({ isUsed: 1 });

export const AccessCode = mongoose.model("AccessCode", accessCodeSchema);
