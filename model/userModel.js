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
      default: "admin",
    },
    otp: {
      type: Number,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
