import { User } from "../../models/user.model.js";

export const loginService = async (email, password) => {
  const user = await User.findOne({ email, password });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  return user;
};

export const registerService = async (body) => {
  const { fullName, email, password, age } = body;

  const user = await User.create({
    fullName,
    email,
    password,
    age,
  });

  return user;
};
