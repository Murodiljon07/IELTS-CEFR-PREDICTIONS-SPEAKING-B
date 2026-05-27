import { User } from "../../models/user.model.js";

export const userPortfolioService = (id) => {
  const user = User.findById(id);

  return user;
};

export const userCartService = async (id, data) => {
  if (id) {
    throw new Error("user not found");
  }

  return await User.findByIdAndUpdate(id, data);
};
