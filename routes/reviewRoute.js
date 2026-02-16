const {
  createReview,
  getProductReview,
  deleteReview,
  getMyReview,
} = require("../controller/user/reviewController");
const isAuthenticated = require("../middleware/isAuthenticated");
const catchAsync = require("../services/catchAsync");

const router = require("express").Router();

router.route("/reviews").get(isAuthenticated, catchAsync(getMyReview));
router
  .route("/reviews/:id")
  .post(isAuthenticated, catchAsync(createReview))
  .get(isAuthenticated, catchAsync(getProductReview))
  .delete(isAuthenticated, catchAsync(deleteReview));

module.exports = router;
