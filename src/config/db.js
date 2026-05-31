import mongoose from "mongoose";

const connectDB = async () => {
  const mongoDB_URL = process.env.DATABASE_URL;

  try {
    await mongoose.connect(mongoDB_URL);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
