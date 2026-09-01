const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/ApiError");

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  console.log("AUTH HEADER:", req.headers.authorization);

  if (!header) {
    throw new ApiError("Authentication required", 401);
  }

  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new ApiError("Invalid authorization format", 401);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);

    throw new ApiError("Invalid or expired token", 401);
  }
};

module.exports = authMiddleware;