const {
  sendResponse,
  AppError,
  catchAsync,
  generateToken
} = require("../helpers/utils.js");
const bcrypt = require("bcryptjs");
const User = require("../models/user.js");

const userController = {};

userController.createUser = catchAsync(async (req, res, next) => {
  // Get data from request
  let { name, email, password, isAdmin } = req.body;
  // Business Logic Validation
  let user = await User.findOne({ email });
  if (user)
    throw new AppError(400, "User already exists", "Registration Error");

  // Process data
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  user = await User.create({ name, email, password, isAdmin });
  const accessToken = generateToken(user);

  // Response
  sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create User successful"
  );
});

userController.getCurrentUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.user._id;

  console.log(req);
  const user = await User.findById(currentUserId);
  if (!user)
    throw new AppError(400, "User not found", "Get current user error");

  sendResponse(res, 200, true, user, null, "Get current user successful");
});

userController.getSingleUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.params.userId;

  const user = await User.findById(currentUserId);
  if (!user)
    throw new AppError(400, "User not found", "Get current user error");

  sendResponse(res, 200, true, user, null, "Get current user successful");
});

userController.updateUserById = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const info = req.body;
  console.log("req", req);
  const options = { new: true };

  try {
    let newPassword = req.body.password;
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      newPassword = await bcrypt.hash(newPassword, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...info, password: newPassword },
      options
    );

    const accessToken = generateToken(updatedUser);

    sendResponse(
      res,
      200,
      true,
      { user: updatedUser, accessToken },
      null,
      "Update user success"
    );
  } catch (error) {
    next(error);
  }
});

//export
module.exports = userController;
