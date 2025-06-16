const express = require("express");
const router = express.Router();

// Import các hàm controller
const cartController = require("../controllers/cartController");
console.log("✅ cartRoutes loaded");
// Thêm sản phẩm vào giỏ hàng
router.post("/add", cartController.addToCart);

// Lấy giỏ hàng theo userId
router.get("/:userId", cartController.getCartByUser);

router.delete("/remove/:itemId", cartController.deleteCartItem);

router.put("/item/:itemId", cartController.updateCartItemQuantity);
router.post("/checkout/:userId", cartController.checkoutCart);
router.delete("/clear/:userId", cartController.clearCart);


module.exports = router;
