import dotenv from "dotenv";
dotenv.config();
import http from "http";

import connectDB from "./src/config/db.js";
connectDB();

import app from "./src/app.js";

const server = http.createServer(app);
const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(
    "Server is running on PORT: " + PORT,
    `\nlink: http://localhost:${PORT}`,
  );
});
