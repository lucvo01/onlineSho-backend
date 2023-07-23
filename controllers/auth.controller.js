const {
  sendResponse,
  AppError,
  catchAsync,
  generateToken
} = require("../helpers/utils.js");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const authController = {};

authController.loginWithEmail = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }, "+password");
  if (!user) throw new AppError(400, "Invalid Credentials", "Login Error");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError(400, "Wrong password", "Login Error");
  const accessToken = generateToken(user);

  sendResponse(res, 200, true, { user, accessToken }, null, "Login Successful");
});

//export
module.exports = authController;
