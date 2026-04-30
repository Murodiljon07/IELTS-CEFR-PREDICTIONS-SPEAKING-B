import jwt from "jsonwebtoken";

export const jwtToken = (user) => {
  return jwt.sign({ id: user._id }, { role: user.role }, "secretkey", {
    expiresIn: "1d",
  });
};
