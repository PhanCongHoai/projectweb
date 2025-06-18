const express = require("express");
const router = express.Router();
// Import controller xử lý đơn hàng
const orderController = require("../controllers/orderController");

// Tạo đơn hàng mới (từ “Mua ngay” hoặc thanh toán giỏ hàng)

router.post("/:userId", orderController.createOrder);

// Lấy danh sách đơn hàng theo userId
router.get("/user/:userId", orderController.getOrdersByUser);
router.put("/cancel/:orderId", orderController.cancelOrder);
router.get("/pending", orderController.getPendingOrders);
router.put("/:orderId/confirm", orderController.confirmOrder);
router.put("/:orderId/cancel", orderController.cancelOrder);
router.get("/all", orderController.getAllOrders);
router.get("/others", orderController.getOtherOrders);

module.exports = router;
