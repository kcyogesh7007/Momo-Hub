const {
  getProfile,
  deleteProfile,
  updateProfile,
  changePassword,
} = require("../controller/profile/profileController");
const isAuthenticated = require("../middleware/isAuthenticated");
const catchAsync = require("../services/catchAsync");

const router = require("express").Router();

router
  .route("/")
  .get(isAuthenticated, catchAsync(getProfile))
  .delete(isAuthenticated, catchAsync(deleteProfile))
  .patch(isAuthenticated, catchAsync(updateProfile));

router
  .route("/changePassword")
  .patch(isAuthenticated, catchAsync(changePassword));

module.exports = router;
