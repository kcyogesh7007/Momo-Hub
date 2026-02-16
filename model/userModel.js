const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "Username must be provided"],
    },
    userEmail: {
      type: String,
      required: [true, "userEmail must be provided"],
      lowercase: true,
      unique: true,
    },
    userPassword: {
      type: String,
      required: [true, "userPassword must be provided"],
    },
    userPhoneNumber: {
      type: String,
      required: [true, "userPhoneNumber must be provided"],
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    otp: {
      type: Number,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    cart: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
