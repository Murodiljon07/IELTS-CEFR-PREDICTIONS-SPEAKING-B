import dotenv from "dotenv";
dotenv.config();
import http from "http";

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

connectDB();

const server = http.createServer(app);
const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(
    "Server is running on PORT: " + PORT,
    `\nlink: http://localhost:${PORT}`,
  );
});
