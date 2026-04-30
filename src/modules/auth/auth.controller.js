import { jwtToken } from "../../config/jwt.js";
import { loginService, registerService } from "./auth.service.js";

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await loginService(email, password);

    const token = jwtToken(user);

    res.json({ msg: "success", user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerController = async (req, res) => {
  const body = req.body;

  try {
    let user = await registerService(body);

    const token = jwtToken(user);

    res.status(201).json({ msg: "User created", user, token });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
