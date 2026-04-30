import jwt from "jsonwebtoken";
import { loginService, registerService } from "./auth.service.js";

export const loginController = async (req, res) => {
  const SECRET_KEY = process.env.JWT_SECRET;
  const { email, password } = req.body;

  try {
    let user = await loginService(email, password);

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ msg: "success", user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerController = async (req, res) => {
  const body = req.body;

  try {
    let user = await registerService(body);

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(201).json({ msg: "User created", user, token });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
