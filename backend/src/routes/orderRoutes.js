const express = require("express");
const router = express.Router();

// Import controller xử lý đơn hàng
const orderController = require("../controllers/orderController");
console.log("✅ orderRoutes loaded");

// Tạo đơn hàng mới (từ “Mua ngay” hoặc thanh toán giỏ hàng)

router.post("/:userId", orderController.createOrder);

// Lấy danh sách đơn hàng theo userId
router.get("/user/:userId", orderController.getOrdersByUser);
router.put("/cancel/:orderId", orderController.cancelOrder);
module.exports = router;
