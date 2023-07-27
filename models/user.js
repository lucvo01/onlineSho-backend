const mongoose = require("mongoose");
//Create schema
const userSchema = mongoose.Schema(
  {
    isAdmin: { type: Boolean, enum: [true, false], default: false },
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
      unique: true
    },
    password: { type: String, required: true, minlength: 3, maxlength: 1024 }
  },
  {
    timestamps: true
  }
);
//Create and export model
const User = mongoose.model("User", userSchema);
module.exports = User;
