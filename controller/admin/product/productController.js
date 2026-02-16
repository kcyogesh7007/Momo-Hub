const Product = require("../../../model/productModel");
const fs = require("fs");

exports.createProduct = async (req, res) => {
  const {
    productName,
    productPrice,
    productStatus,
    productDescription,
    productStockQty,
  } = req.body;
  const file = req.file;
  let filePath;
  if (!file) {
    filePath =
      "https://imgs.search.brave.com/pjt9Yr-bQVIk6vy-04yC7OgmFzXxMG-44ONTW--7SWY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/c2hvcGlmeS5jb20v/cy9maWxlcy8xLzAw/NzAvNzAzMi9hcnRp/Y2xlcy93aGF0XzIw/aXNfMjBhXzIwcHJv/ZHVjdF8xODQ4eDk3/MF8yYzllODFhYy1m/NmUwLTQ1ZTQtODY0/My02NjU1ZTM4MWI2/Y2MucG5nP3Y9MTc2/MzQxMTA3OSZvcmln/aW5hbFdpZHRoPTE4/NDgmb3JpZ2luYWxI/ZWlnaHQ9Nzgy";
  } else {
    filePath = req.file.filename;
  }
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
    productImage: process.env.BACKEND_URL + filePath,
  });
  res.status(201).json({
    message: "Product created successfully",
  });
};

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  if (products.length == 0) {
    return res.status(400).json({
      message: "No product found",
    });
  }
  res.status(200).json({
    message: "Products fetched successfully",
    data: products,
  });
};

exports.getProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "Please provide id",
    });
  }
  const product = await Product.findById(id);
  if (!product) {
    return res.status(400).json({
      message: "No product found",
    });
  }
  res.status(200).json({
    message: "Product fetched successfully",
    data: product,
  });
};

exports.updateProduct = async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "Please provide id",
    });
  }
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
  const oldData = await Product.findById(id);
  if (!oldData) {
    return res.status(400).json({
      message: "No data found with that ID",
    });
  }
  const oldImage = oldData.productImage;
  const lengthToCut = process.env.BACKEND_URL.length;
  const finalPath = oldImage.slice(lengthToCut);

  if (req.file && req.file.filename) {
    fs.unlink("./uploads/" + finalPath, (err) => {
      if (err) {
        console.log("Error deleting file", err);
      } else {
        console.log("File deleted successfully");
      }
    });
  }
  const product = await Product.findByIdAndUpdate(
    id,
    {
      productName,
      productPrice,
      productStatus,
      productDescription,
      productStockQty,
      productImage:
        req.file && req.file.filename
          ? process.env.BACKEND_URL + req.file.filename
          : oldImage,
    },
    {
      new: true,
    },
  );
  res.status(200).json({
    message: "Produt updated successfully",
    data: product,
  });
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "Please provide id",
    });
  }
  const oldData = await Product.findById(id);
  if (!oldData) {
    return res.status(400).json({
      message: "No product found with that Id",
    });
  }
  const oldImage = oldData.productImage;
  const lengthToCut = process.env.BACKEND_URL.length;
  const finalPath = oldImage.slice(lengthToCut);
  fs.unlink("./uploads/" + finalPath, (err) => {
    if (err) {
      console.log("Error deleting file", err);
    } else {
      console.log("File deleted successfully");
    }
  });
  await Product.findByIdAndDelete(id);
  res.status(200).json({
    message: "Product deleted successfully",
  });
};
