const Product = require("../../model/productModel");
const Review = require("../../model/reviewModel");

exports.createReview = async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.id;
  const { message, rating } = req.body;
  if (!productId || !message || !rating) {
    return res.status(400).json({
      message: "Please provide productId,message and rating",
    });
  }
  const productExist = await Product.findById(productId);
  if (!productExist) {
    return res.status(404).json({
      message: "Product doesnot exist with that productId",
    });
  }
  await Review.create({
    userId,
    productId,
    message,
    rating,
  });
  res.status(201).json({
    message: "Review added successfully",
  });
};

exports.getProductReview = async (req, res) => {
  const productId = req.params.id;
  if (!productId) {
    return res.status(400).json({
      message: "Please provide productId",
    });
  }
  const productExist = await Product.findById(productId);
  if (!productExist) {
    return res.status(400).json({
      message: "Product doesnot exist with that productId",
    });
  }
  const review = await Review.find({ productId }).populate(
    "userId",
    "-userPassword",
  );

  res.status(200).json({
    message: "Product fetched successfully",
    data: review,
  });
};

exports.deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user._id;
  if (!reviewId) {
    return res.status(400).json({
      message: "Please provide reviewId",
    });
  }
  const review = await Review.findById(reviewId);

  const ownerReviewId = review.userId;
  if (ownerReviewId !== userId) {
    return res.status(400).json({
      message: "You dont have permission to this",
    });
  }
  await Review.findByIdAndDelete(reviewId);
  res.status(200).json({
    message: "Review deleted successfully",
  });
};

exports.getMyReview = async (req, res) => {
  const userId = req.user._id;
  const review = await Review.find({ userId });
  if (!review) {
    return res.status(404).json({
      message: "You have given review to any product yet",
    });
  }
  res.status(400).json({
    message: "Review fetched successfully",
    data: review,
  });
};
