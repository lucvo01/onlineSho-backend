const { sendResponse, AppError, catchAsync } = require("../helpers/utils.js");
const bcrypt = require("bcryptjs");

const Order = require("../models/order.js");

const orderController = {};

orderController.createOrder = catchAsync(async (req, res, next) => {
  const newOrder = new Order(req.body);
  await newOrder.populate("userId");
  await newOrder.populate("products._id");

  await newOrder.save();
  sendResponse(res, 200, true, newOrder, null, "Create Order Success");
});

orderController.updateOrder = catchAsync(async (req, res, next) => {
  const id = req.params.orderId;
  const {
    email,
    phone,
    address,
    state,
    city,
    delivery_status,
    payment_method,
    payment_status
  } = req.body;

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      $set: req.body
    },
    { new: true }
  );

  sendResponse(res, 200, true, updatedOrder, null, "Update Order Success");
});

orderController.deleteOrder = catchAsync(async (req, res, next) => {
  const id = req.params.orderId;

  const order = await Order.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  sendResponse(res, 200, true, order, null, "Delete Product Success");
});

orderController.getAllOrders = catchAsync(async (req, res, next) => {
  let { page, limit, ...filter } = { ...req.query };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const filterConditions = [{ isDeleted: false }];

  if (Object.keys(filter).length > 0) {
    filterConditions.push({ ...filter });
  }

  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await Order.countDocuments(filterConditions);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let allOrders = await Order.find(filterCriteria)
    .skip(offset)
    .limit(limit)
    .populate("userId")
    .populate("products._id");

  sendResponse(
    res,
    200,
    true,
    { orders: allOrders, totalPages, count },
    null,
    "Get All Orders Success"
  );
});

orderController.getSingleUserOrders = catchAsync(async (req, res, next) => {
  const id = req.params.userId;
  console.log(req.user);
  const orders = await Order.find({ userId: id })
    .populate("userId")
    .populate("products._id");

  sendResponse(
    res,
    200,
    true,
    { orders: orders },
    null,
    "Get User's Orders Success"
  );
});

orderController.getAnOrder = catchAsync(async (req, res, next) => {
  const id = req.params.orderId;

  const order = await Order.findById(id)
    .populate("userId")
    .populate("products._id");
  if (order.isDeleted)
    throw new AppError(400, "Order Not Found", "Get Order Error");
  sendResponse(res, 200, true, order, null, "Get Single Order Success");
});

//export
module.exports = orderController;
