const User = require("../../../model/userModel");

exports.getUsers = async (req, res) => {
  const userId = req.user._id;
  const users = await User.find({ _id: { $ne: userId } }).select(
    "-userPassword",
  );
  if (users.length > 1) {
    res.status(200).json({
      message: "users fetched successfully",
      data: users,
    });
  } else {
    res.status(404).json({
      message: "User collection is empty",
    });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({
      message: "Please provide userId",
    });
  }
  const userExist = await User.findById(userId);
  if (!userExist) {
    return res.status(404).json({
      message: "User doesnot exist with that id",
    });
  }
  await User.findByIdAndDelete(userId);
  res.status(200).json({
    message: "User deleted successfully",
  });
};
