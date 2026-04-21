import http from "http";
import ora from "ora";
import cros from "cros";

import app from "./src/app";

const server = http.createServer(app);

app.use(
  cros({
    origin: "http://localhost:5173",
    Credentials: true,
  }),
);

const spinner = ora("server is starting...").start();
