import mongoose from "mongoose";

const connectDB = async () => {
  const mongoDB_URL = process.env.DATABASE_URL;
  console.log(mongoDB_URL);

  try {
    await mongoose.connect(mongoDB_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
