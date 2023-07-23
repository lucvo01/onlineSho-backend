const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validators = require("../middlewares/validators");
const authController = require("../controllers/auth.controller");

/**
 * @route POST /login
 * @description Log in with email and password
 * @body {email, password}
 * @access Public
 */
router.post(
  "/",
  validators.validate([
    body("email", "Invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid password").exists().notEmpty()
  ]),
  authController.loginWithEmail
);
module.exports = router;
