import mongoose from "mongoose";
import ora from "ora";

const connectDB = async () => {
  const spinner = ora("Connecting to database...").start();

  const mongoDB_URL = process.env.DATABASE_URL;

  try {
    await mongoose.connect(mongoDB_URL);

    spinner.succeed("MongoDB connected successfully ");
  } catch (error) {
    spinner.fail("DB connection failed");
    console.log(error);
  }
};

export default connectDB;
