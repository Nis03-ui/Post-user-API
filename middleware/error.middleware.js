const { ApiError } = require("../utils/ApiError");
const handlePrismaError = require("../utils/prismaError");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors
    });
  }

  const prismaError = handlePrismaError(err);

  if (prismaError) {
    return res.status(prismaError.statusCode).json({
      success: false,
      message: prismaError.message
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
};

module.exports = errorHandler;