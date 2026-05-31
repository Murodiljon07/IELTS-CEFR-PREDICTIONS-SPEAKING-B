import e from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = e();
app.use(cors());

/* Middlewares */
app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use("/uploads", e.static("uploads")); // ✅ Serve uploaded files

/* Routes */
import authRoutes from "./modules/auth/auth.routes.js";
import materialRoutes from "./modules/material/material.route.js";
import userRoutes from "./modules/user/user.routes.js";
import orderRoutes from "./modules/orders/orders.route.js";
import dashboardRoutes from "./modules/dashboard/dashboard.route.js";

app.get("/", (req, res) => {
  res.send("Welcome to the IELTS server...!");
});

/* Use routes */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/materials", materialRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/admin/dashboard", dashboardRoutes);

/* Error handling middleware */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

export default app;
