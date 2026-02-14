const express = require("express");
const app = express();
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connectDB = require("./database/database");
connectDB();
const User = require("./model/userModel");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
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
});

app.post("/login", async (req, res) => {
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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
