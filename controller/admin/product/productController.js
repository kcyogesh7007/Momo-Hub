const Product = require("../../../model/productModel");

exports.createProduct = async (req, res) => {
  const {
    productName,
    productPrice,
    productStatus,
    productDescription,
    productStockQty,
  } = req.body;
  if (
    !productName ||
    !productPrice ||
    !productStatus ||
    !productDescription ||
    !productStockQty
  ) {
    return res.status(400).json({
      message:
        "Please provide productName,productPrice,productStatus,productDescription and productStockQty",
    });
  }
  await Product.create({
    productName,
    productPrice,
    productStatus,
    productDescription,
    productStockQty,
  });
  res.status(201).json({
    message: "Product created successfully",
  });
};
