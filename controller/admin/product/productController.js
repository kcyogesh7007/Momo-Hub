const Product = require("../../../model/productModel");

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
    productImage: "http://localhost:3000/" + filePath,
  });
  res.status(201).json({
    message: "Product created successfully",
  });
};
