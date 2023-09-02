const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: false, ref: "User" },
    products: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        size: { type: String, enum: ["XS", "S", "M", "L", "XL"] }
      }
    ],
    subtotal: { type: Number, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    delivery_status: { type: String, default: "Pending" },
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
