const { sendResponse, AppError } = require("../helpers/utils.js");
var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).send("Welcome to CoderSchool!");
});

//authApi
const authApi = require("./auth.api.js");
router.use("/login", authApi);

//userApi
const userApi = require("./user.api.js");
router.use("/users", userApi);

//productApi
const productApi = require("./product.api");
router.use("/products", productApi);

//orderApi
const orderApi = require("./order.api");
router.use("/orders", orderApi);

module.exports = router;
