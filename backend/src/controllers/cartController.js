const { Order, OrderItem, Cart, CartItem, Product, User } = require("../models");

function formatDateForSQLServer(date) {
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const HH = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
}

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
  console.log("🔥 Đã nhận request addToCart:", req.body);
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Thiếu thông tin đầu vào hoặc số lượng không hợp lệ" });
    }

    const user = await User.findByPk(userId);
    if (!user || user === 0) return res.status(404).json({ message: "Người dùng không tồn tại" });

    // ✅ Dùng đúng tên thuộc tính userId
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

    const remaining = product.number - product.number2;
    if (quantity > remaining) {
      return res.status(400).json({ message: "Số lượng vượt quá tồn kho" });
    }

    const existingItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId: product.id,
      },
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      await CartItem.create({
        cartId: cart.id,
        productId: product.id,
        quantity,
      });
    }

    return res.status(200).json({ message: "Đã thêm vào giỏ hàng thành công" });
  } catch (error) {
    console.error("❌ Lỗi khi thêm vào giỏ hàng:", error);
    return res.status(500).json({ message: "Lỗi máy chủ khi thêm vào giỏ hàng" });
  }
};

// Lấy giỏ hàng của người dùng
exports.getCartByUser = async (req, res) => {
  const { userId } = req.params;
    if (!userId || userId === 0) {
      return res.status(400).json({ error: "Người dùng chưa đăng nhập" });
    }
  try {
    
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    const items = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [{
        model: Product,
        attributes: ['title', 'price', 'image_url', 'number', 'number2']
      }]
    });

    res.status(200).json({ cartId: cart.id, items });
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy giỏ hàng" });
  }
};

// Xoá một sản phẩm khỏi giỏ hàng
exports.deleteCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await CartItem.findByPk(itemId);
    if (!item) return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ" });

    await item.destroy();
    res.status(200).json({ message: "Xoá sản phẩm khỏi giỏ hàng thành công" });
  } catch (error) {
    console.error("Lỗi xoá sản phẩm:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi xoá sản phẩm" });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ
exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) return res.status(400).json({ message: "Số lượng không hợp lệ" });

    const item = await CartItem.findByPk(itemId, {
      include: [Product]
    });
    if (!item) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    const remaining = item.Product.number - item.Product.number2;
    if (quantity > remaining) {
      return res.status(400).json({ message: "Số lượng vượt quá tồn kho" });
    }

    item.quantity = quantity;
    await item.save();

    res.status(200).json({ message: "Cập nhật số lượng thành công" });
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi cập nhật" });
  }
};

// Thanh toán giỏ hàng
exports.checkoutCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, address } = req.body;

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

    const items = await CartItem.findAll({ where: { cartId: cart.id }, include: [Product] });

    if (!items.length) {
      return res.status(400).json({ message: "Giỏ hàng trống!" });
    }

    for (let item of items) {
      const available = item.Product.number - item.Product.number2;
      if (item.quantity > available) {
        return res.status(400).json({ message: `Sản phẩm ${item.Product.title} không đủ hàng` });
      }
    }

    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.Product.price, 0);
    const formattedDate = formatDateForSQLServer(new Date());

    const order = await Order.create({
      userId,
      name,
      phone,
      address,
      totalAmount,
      orderDate: formattedDate,
      status: "Chờ xác nhận"
    });

    const orderItems = items.map(item => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.Product.price
    }));
    await OrderItem.bulkCreate(orderItems);

    for (let item of items) {
      item.Product.number2 += item.quantity;
      await item.Product.save();
    }

    await CartItem.destroy({ where: { cartId: cart.id } });

    res.status(201).json({ message: "Thanh toán thành công", orderId: order.id });
  } catch (error) {
    console.error("Lỗi thanh toán:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi thanh toán" });
  }
};

// Xoá toàn bộ giỏ hàng
exports.clearCart = async (req, res) => {
  const userId = req.params.userId;

  try {
    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }

    await CartItem.destroy({ where: { cartId: cart.id } });

    res.json({ message: "Đã xoá toàn bộ sản phẩm trong giỏ hàng" });
  } catch (error) {
    console.error("Lỗi khi xoá giỏ hàng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
