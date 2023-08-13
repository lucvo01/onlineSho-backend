const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, require: true, minLenth: 3, maxLenth: 200 },
    description: { type: String, require: true, minLenth: 3, maxLenth: 200 },
    price: { type: Number, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    category: {
      type: String,
      enum: ["shoes", "shirt", "pants"],
      required: true
    },
    image: { type: Object, required: false },
    isDeleted: { type: Boolean, enum: [true, false], default: false }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
