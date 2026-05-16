import e from "express";
import cors from "cors";

const app = e();

/* CORS */
app.use(cors("*"));

/* middlewares */
app.use(e.json());

/* routes */
import authRoutes from "./modules/auth/auth.routes.js";
import materialRoutes from "./modules/material/material.route.js";
import userRoutes from "./modules/user/user.routes.js";

app.get("/", (req, res) => {
  res.send("welcome to the IELST server...!");
});

/* use routes */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/materials", materialRoutes);
app.use("/api/v1/user", userRoutes);

export default app;
