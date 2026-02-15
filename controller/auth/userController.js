const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");

const User = require("../../model/userModel");
const sendEmail = require("../../services/sendEmail");

exports.registerUser = async (req, res) => {
  const { email, phoneNumber, userName, password } = req.body;
  if (!email || !phoneNumber || !userName || !password) {
    return res.status(400).json({
      message: "Please provide email,phoneNumber,userName and password",
    });
  }
  const userExist = await User.findOne({ userEmail: email });
  if (userExist) {
    return res.status(400).json({
      message: "User with that email address already exist",
    });
  }
  await User.create({
    userEmail: email,
    userPassword: bcrypt.hashSync(password, 10),
    userPhoneNumber: phoneNumber,
    userName,
  });
  res.status(201).json({
    message: "User registered successfully",
  });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Please enter email and password",
    });
  }
  const userExist = await User.findOne({ userEmail: email });
  if (!userExist) {
    return res.status(400).json({
      message: "User with that email address doesnot exist",
    });
  }
  const isPasswordMatch = bcrypt.compareSync(password, userExist.userPassword);
  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }
  const token = jwt.sign({ id: userExist._id }, process.env.SECRET_KEY, {
    expiresIn: "3d",
  });
  res.status(200).json({
    message: "User loggedIn successfully",
    token,
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Please provide email",
    });
  }
  const userExist = await User.findOne({ userEmail: email });
  if (!userExist) {
    return res.status(400).json({
      message: "User doesnot exist with that email address",
    });
  }

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  userExist.otp = otp;
  await userExist.save();
  await sendEmail({
    email,
    subject: "Your OTP for Momo Hub is:",
    message: `Your OTP is ${otp}. Don't share with anyone`,
  });
  res.status(200).json({
    message: "OTP sent successfully",
  });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({
      message: "Please provide email and otp",
    });
  }
  const userExist = await User.findOne({ userEmail: email });
  if (!userExist) {
    return res.status(400).json({
      message: "User with that email address doesnot exist",
    });
  }
  if (userExist.otp !== otp) {
    return res.status(400).json({
      message: "Invalid otp",
    });
  }
  userExist.isOtpVerified = true;
  userExist.otp = undefined;
  await userExist.save();
  res.status(200).json({
    message: "Otp verified successfully",
  });
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "Please provide email,new Password and confirm Password",
    });
  }
  const userExist = await User.findOne({ userEmail: email });
  if (!userExist) {
    return res.status(400).json({
      message: "User with that email doesnot exist",
    });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "New password and confirm password doesnot match",
    });
  }
  if (!userExist.isOtpVerified) {
    return res.status(400).json({
      message: "You cannot perform this action",
    });
  }
  userExist.userPassword = bcrypt.hashSync(newPassword, 10);
  userExist.isOtpVerified = false;
  await userExist.save();
  res.status(200).json({
    message: "Password reset successfully",
  });
};
