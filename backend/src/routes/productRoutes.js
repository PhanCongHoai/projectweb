const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");


// Lấy sản phẩm theo danh mục
router.get("/category/:id", productController.getProductsByCategory);

// Lấy sản phẩm gợi ý
router.get("/suggested", productController.getSuggestedProducts);

// ✅ Thêm sản phẩm mới
router.post("/add", productController.createProduct);

module.exports = router;