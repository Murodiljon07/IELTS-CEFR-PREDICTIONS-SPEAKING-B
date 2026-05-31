import mongoose from "mongoose";

const connectDB = async () => {
  const mongoDB_URL = process.env.DATABASE_URL;
  try {
    await mongoose.connect(mongoDB_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB Error:", error);
    throw error;
  }
};

export default connectDB;
