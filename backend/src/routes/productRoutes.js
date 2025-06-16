const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// ✅ **QUAN TRỌNG** - Route để lấy tất cả sản phẩm (phải đặt TRƯỚC các route có params)
router.get("/", productController.getAllProducts);

// ✅ **QUAN TRỌNG** - Route để xóa sản phẩm
router.delete("/:id", productController.deleteProduct);

// Thêm sản phẩm mới
router.post("/add", productController.createProduct);

// Lấy sản phẩm theo danh mục
router.get("/category/:id", productController.getProductsByCategory);

// Lấy sản phẩm gợi ý
router.get("/suggested", productController.getSuggestedProducts);

// Tìm kiếm sản phẩm
router.get("/search", productController.searchProducts);

// Xem chi tiết sản phẩm
router.get("/:id", productController.getProductById);

// Xuất router
module.exports = router;
