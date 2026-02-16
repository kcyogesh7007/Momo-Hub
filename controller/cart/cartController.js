const Product = require("../../model/productModel");
const User = require("../../model/userModel");

exports.addToCart = async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.id;
  if (!productId) {
    return res.status(400).json({
      message: "Please provide producId",
    });
  }
  const user = await User.findById(userId);

  const productExist = await Product.findById(productId);
  if (!productExist) {
    return res.status(404).json({
      message: "No product found with that id",
    });
  }
  user.cart.push(productId);
  await user.save();
  res.status(200).json({
    message: "Product added to cart successfully",
  });
};

exports.getMyCartItems = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).populate({
    path: "cart",
    select: "-productStatus",
  });
  res.status(200).json({
    message: "cart item fetched successfully",
    data: user.cart,
  });
};

exports.deleteItemFromCart = async (req, res) => {
  const productId = req.params.id;

  const userId = req.user.id;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      message: "No product with that productId",
    });
  }

  const user = await User.findById(userId);

  user.cart = user.cart.filter((pId) => pId != productId);

  await user.save();
  res.status(200).json({
    message: "Item removed From Cart",
  });
};
