const User = require("./model/userModel");
const bcrypt = require("bcryptjs");

const adminSeeder = async () => {
  const isAdminExist = await User.findOne({ userEmail: "admin@gmail.com" });
  if (!isAdminExist) {
    await User.create({
      userName: "admin",
      userPassword: bcrypt.hashSync("admin", 10),
      userPhoneNumber: 9845123652,
      role: "admin",
      userEmail: "admin@gmail.com",
    });
    console.log("Admin seeded successfully");
  } else {
    console.log("Admin already seeded");
  }
};

module.exports = adminSeeder;
