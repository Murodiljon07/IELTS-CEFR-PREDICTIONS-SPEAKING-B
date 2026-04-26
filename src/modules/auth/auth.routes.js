import e from "express";
import { loginController, registerController } from "./auth.controller.js";

const router = e.Router();

router.post("/login", loginController);
router.post("/register", registerController);

export default router;
