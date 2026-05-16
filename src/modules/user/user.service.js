import { User } from "../../models/user.model.js";

export const userCardService = (id) => {};

export const userPortfolioService = (id) => {
  const user = User.findById(id);

  return user;
};
