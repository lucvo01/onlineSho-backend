const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const Product = require("./product");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: false, ref: "User" },
    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 }
      }
    ],
    // cartTotal: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    shipping: { type: Object, required: true },
    delivery_status: { type: String, default: "pending" },
    payment_method: { type: String, required: true },
    payment_status: {
      type: String,
      enum: ["Paid", "Unpaid"],
      required: false,
      default: "Unpaid"
    },
    isDeleted: { type: Boolean, enum: [true, false], default: false }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
