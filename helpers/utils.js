const jwt = require("jsonwebtoken");

const utilsHelper = {};

utilsHelper.sendResponse = (res, status, success, data, errors, message) => {
  const response = {};
  if (success) response.success = success;
  if (data) response.data = data;
  if (errors) response.errors = errors;
  if (message) response.message = message;
  return res.status(status).json(response);
};

utilsHelper.catchAsync = (func) => async (req, res, next) =>
  func(req, res, next).catch((error) => next(error));
class AppError extends Error {
  constructor(statusCode, message, errorType) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
    // all errors using this class are operational errors.
    this.isOperational = true;
    // create a stack trace for debugging (Error obj, void obj to avoid stack polution)
    Error.captureStackTrace(this, this.constructor);
  }
}
utilsHelper.AppError = AppError;

utilsHelper.generateToken = (user) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
   if (!jwtSecretKey || typeof jwtSecretKey !== "string") {
     throw new Error(
       "Invalid JWT secret key. Please check your environment variable."
     );
   }
  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    },
    jwtSecretKey,
    {
      expiresIn: "24h" // expires in 24 hours
    }
  );
  return token;
};

module.exports = utilsHelper;
