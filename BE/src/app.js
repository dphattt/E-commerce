const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const routes = require("@/routes");
const {
  notFoundHandler,
  errorHandler,
} = require("@/middlewares/error.middleware");

const app = express();

const corsOrigin = process.env.CORS_ORIGIN;
app.use(
  cors({
    origin:
      corsOrigin === "*" || !corsOrigin
        ? true
        : corsOrigin.split(",").map((o) => o.trim()),
    credentials: true,
  }),
);

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
