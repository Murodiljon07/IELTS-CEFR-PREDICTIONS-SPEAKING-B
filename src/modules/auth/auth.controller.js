import { loginService, registerService } from "./auth.service.js";

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    let result = await loginService(email, password);

    res.json({ msg: "success", user: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerController = async (req, res) => {
  const body = req.body;

  try {
    let user = await registerService(body);

    res.status(201).json({ msg: "User created", user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
