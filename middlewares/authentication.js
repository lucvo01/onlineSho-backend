const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { AppError } = require("../helpers/utils");

const authentication = {};

authentication.loginRequired = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString)
      throw new AppError(401, "Login Required", "Authentication Error");

    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          throw new AppError(401, "Token expired", "Athentication Error");
        } else {
          throw new AppError(401, "Token is invalid", "Athentication Error");
        }
      }
      req.user = payload;
      //   req.userId = payload._id;
    });
    next();
  } catch (error) {
    next(error);
  }
};

// For Admin
authentication.isAdmin = (req, res, next) => {
  authentication.loginRequired(req, res, () => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).send("Access denied. Not authorized...");
    }
  });
};

// For User
authentication.isUser = (req, res, next) => {
  authentication.loginRequired(req, res, () => {
    if (req.user._id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).send("Access denied. Not authorized...");
    }
  });
};

module.exports = authentication;
