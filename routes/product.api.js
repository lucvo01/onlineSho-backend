const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const userController = require("../controllers/user.controller");
const productController = require("../controllers/product.controller");
const authentication = require("../middlewares/authentication");
const validators = require("../middlewares/validators");
const multer = require("multer"); // v1.0.5
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});
const upload = multer({ storage });

/**
 * @route POST /products
 * @description Create a product
 * @body { name, price, description , image }
 * @access Login required
 */
router.post(
  "/",
  authentication.isAdmin,
  upload.single("file"),

  productController.createProduct
);

/**
 * @route DELETE /products/:productId
 * @description Delete a product
 * @access Login required
 */
router.put(
  "/:productId/delete",
  authentication.isAdmin,
  param("productId").exists().isString().custom(validators.checkObjectId),
  productController.deleteProduct
);

/**
 * @route PUT /products/:productId
 * @description Update a product
 * @body { name, price, description , image }
 * @access Login required
 */
router.put(
  "/:productId",
  authentication.isAdmin,
  param("productId").exists().isString().custom(validators.checkObjectId),
  productController.updateProduct
);

/**
 * @route GET /products?page=1&limit=10
 * @description Get all products a user can see with pagination
 * @access Public
 */
router.get("/", productController.getAllProducts);

/**
 * @route GET /products/:productId
 * @description Get product detail
 * @access Public
 */
router.get(
  "/:productId",
  validators.validate([
    param("productId").exists().isString().custom(validators.checkObjectId)
  ]),
  productController.getSingleProduct
);

module.exports = router;
