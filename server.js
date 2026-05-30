import dotenv from "dotenv";
dotenv.config();
import http from "http";
import cros from "cors";

import connectDB from "./src/config/db.js";
await connectDB();

import app from "./src/app.js";

app.use(cros());

const server = http.createServer(app);
const PORT = process.env.PORT;
console.log("DATABASE_URL:", process.env.DATABASE_URL);

server.listen(PORT, () => {
  console.log(
    "Server is running on PORT: " + PORT,
    `\nlink: http://localhost:${PORT}`,
  );
});
