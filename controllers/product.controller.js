const { sendResponse, AppError, catchAsync } = require("../helpers/utils.js");
const bcrypt = require("bcryptjs");
const cloudinary = require("../helpers/cloudinary.js");
const Product = require("../models/product.js");
const { param } = require("../routes/product.api.js");

const productController = {};

productController.createProduct = catchAsync(async (req, res, next) => {
  const { name, description, price } = req.body;

  let uploadResponse = null;
  if (req.file) {
    uploadResponse = await cloudinary.uploader.upload(req.file.path, {
      upload_preset: "online_shop"
    });
  }

  const product = await Product.create({
    name,
    description,
    price,
    image: uploadResponse
  });
  await product.save();
  sendResponse(res, 200, true, product, null, "Create Product Success");
});

productController.deleteProduct = catchAsync(async (req, res, next) => {
  const id = req.params.productId;

  const product = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  sendResponse(res, 200, true, product, null, "Delete Product Success");
});

productController.updateProduct = catchAsync(async (req, res, next) => {
  const id = req.params.productId;
  const { name, description, price, image } = req.body;

  const uploadResponse = image;
  if (image) {
    uploadResponse = await cloudinary.uploader.upload(image, {
      upload_preset: "online_shop"
    });
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      name,
      description,
      price
      // image: uploadResponse
    },
    { new: true }
  );
  await updatedProduct.save();
  sendResponse(res, 200, true, updatedProduct, null, "Update Product Success");
});

productController.getAllProducts = catchAsync(async (req, res, next) => {
  let { page, limit, ...filter } = { ...req.query };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const filterConditions = [{ isDeleted: false }];

  if (filter.name) {
    filterConditions.push({ name: { $regex: new RegExp(filter.name, "i") } });
    delete filter.name;
  }
  if (filter.gender) {
    filterConditions.push({
      gender: { $regex: new RegExp(`^${filter.gender}$`, "i") }
    });
    delete filter.gender;
  }
  if (filter.category) {
    filterConditions.push({
      category: { $regex: new RegExp(`^${filter.category}$`, "i") }
    });
    delete filter.category;
  }

  if (
    filter.priceRange &&
    Array.isArray(filter.priceRange) &&
    filter.priceRange.length === 2
  ) {
    const [minPrice, maxPrice] = filter.priceRange;
    const priceFilter = {};
    if (!isNaN(minPrice)) priceFilter.$gte = parseInt(minPrice);
    if (!isNaN(maxPrice)) priceFilter.$lte = parseInt(maxPrice);
    filterConditions.push({ price: priceFilter });
    delete filter.priceRange;
  }

  if (Object.keys(filter).length > 0) {
    filterConditions.push({ ...filter });
  }

  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};
  console.log(filterConditions);
  const count = await Product.countDocuments(filterCriteria);
  console.log("count", count);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let allProducts = await Product.find(filterCriteria)
    .skip(offset)
    .limit(limit);

  sendResponse(
    res,
    200,
    true,
    { products: allProducts, totalPages, count },
    null,
    "Get All Products Success"
  );
});

productController.getSingleProduct = catchAsync(async (req, res, next) => {
  const id = req.params.productId;

  const product = await Product.findById(id);
  if (product.isDeleted)
    throw new AppError(400, "Product Not Found", "Get Product Error");
  sendResponse(res, 200, true, product, null, "Get Single Product Success");
});

//export
module.exports = productController;
