const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");

/**
 * @route POST /user/register
 * @description Register a new user
 * @body {name, email, password}
 * @access Public
 */
router.post(
  "/register",
  validators.validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("email", "Invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid password").exists().notEmpty()
  ]),
  userController.createUser
);

/**
 * @route GET /users/me
 * @description Get current user info
 * @access Login required
 */
router.get("/me", authentication.loginRequired, userController.getCurrentUser);

/**
 * @route GET /user/:userId
 * @description Get user info
 * @body { email, password }
 * @access Login required
 */
router.get(
  "/:userId",
  authentication.loginRequired,
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId)
  ]),
  userController.getSingleUser
);

// Cart APIs

/**
 * @route GET /cart
 * @description Get all products in cart
 * @access Public
 */

/**
 * @route GET /cart/checkout
 * @description Checkout cart
 * @access Public
 */

/**
 * @route GET /cart/checkout/payment
 * @description Make payment
 * @access Public
 */

module.exports = router;
