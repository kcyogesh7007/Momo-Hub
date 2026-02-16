const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/admin/product/productController");
const isAuthenticated = require("../middleware/isAuthenticated");
const isRestrictTo = require("../middleware/isRestrictTo");
const { multer, storage } = require("../middleware/multerConfig");
const catchAsync = require("../services/catchAsync");
const upload = multer({ storage });

const router = require("express").Router();

router
  .route("/products")
  .post(
    isAuthenticated,
    isRestrictTo("admin"),
    upload.single("productImage"),
    catchAsync(createProduct),
  )
  .get(getProducts);

router
  .route("/products/:id")
  .get(getProduct)
  .patch(
    isAuthenticated,
    isRestrictTo("admin"),
    upload.single("productImage"),
    catchAsync(updateProduct),
  )
  .delete(isAuthenticated, isRestrictTo("admin"), catchAsync(deleteProduct));

module.exports = router;
