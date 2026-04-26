import e from "express";

const app = e();

/* routes */
import authRoutes from "./modules/auth/auth.routes.js";
import materialRoutes from "./modules/material/material.route.js";

app.use(e.json());

app.get("/", (req, res) => {
  res.send("welcome to the IELST server...🚀");
});

/* use routes */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/materials", materialRoutes);

export default app;
