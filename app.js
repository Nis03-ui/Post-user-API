const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const errorHandler = require("./middleware/error.middleware");
const notFound = require("./middleware/notFound.middleware");
const logger = require("./middleware/logger");

const userApi = require("./route/user.routes");
const postApi = require("./route/post.route");
const relationship=require("./route/user.post.route")

const app = express();

// Security
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Body limits
app.use(
  express.json({
    limit: "10kb",
  })
);

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

// Logging
app.use(logger);

// Routes
app.use("/api/user", userApi);
app.use("/api/post", postApi);
app.use("/api/relationship",relationship)

// 404
app.use(notFound);

// Error handler — ALWAYS LAST
app.use(errorHandler);

module.exports = app;