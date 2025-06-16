const { Order, OrderItem, Cart, CartItem, Product, User } = require("../models");
const { sequelize } = require("../config/db");

function formatDateForSQLServer(date) {
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const HH = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`; // ❌ Không có +00:00
}

// ✅ Tạo đơn hàng mới từ giỏ hàng
exports.createOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { items, name, phone, address, total } = req.body;

    console.log("🔥 Nhận tạo đơn hàng cho userId:", userId);

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    let orderItems = [];

    if (items && items.length > 0) {
      // ✅ Trường hợp "Mua ngay"
      for (const item of items) {
        const product = await Product.findByPk(item.product_id);
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

        const remaining = product.number - product.number2;
        if (item.quantity > remaining) {
          return res.status(400).json({
            message: `Sản phẩm "${product.title}" không đủ tồn kho`,
          });
        }

        orderItems.push({
          product,
          quantity: item.quantity,
          unitPrice: product.price,
        });
      }
    } else {
      // ✅ Trường hợp "giỏ hàng"
      const cart = await Cart.findOne({ where: { userId } });
      if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

      const cartItems = await CartItem.findAll({
        where: { cartId: cart.id },
        include: [Product],
      });

      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Giỏ hàng đang trống" });
      }

      orderItems = cartItems.map((item) => ({
        product: item.Product,
        quantity: item.quantity,
        unitPrice: item.Product.price,
      }));
    }


const formattedDate = formatDateForSQLServer(new Date());
console.log("🕒 formattedDate:", formattedDate); // kiểm tra
    // Tạo đơn hàng
    const newOrder = await Order.create({
      userId,
      orderDate: formattedDate,
      totalAmount: total,
      status: "Chờ xác nhận",
      name: req.body.name,       // 👈 thêm dòng này
      phone: req.body.phone,     // 👈 thêm dòng này
      address: req.body.address  // 👈 thêm dòng này
    });

    // Tạo từng mục đơn hàng + cập nhật tồn kho
    for (const item of orderItems) {
      await OrderItem.create({
        orderId: newOrder.id,
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      });

      item.product.number2 += item.quantity;
      await item.product.save();
    }

    // Nếu là giỏ hàng thì xóa giỏ
    const cart = await Cart.findOne({ where: { userId } });
    if (!items && cart) {
      await CartItem.destroy({ where: { cartId: cart.id } });
    }

    res.status(201).json({ message: "Đã tạo đơn hàng thành công", orderId: newOrder.id });
  } catch (error) {
    console.error("❌ Lỗi khi tạo đơn hàng:", error);
    res.status(500).json({ message: error.message || "Lỗi máy chủ khi tạo đơn hàng" });
  }
};


// ✅ Lấy danh sách đơn hàng của user
// controllers/orderController.js
// ✅ Lấy danh sách đơn hàng của user
exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.findAll({
      where: { userId },
      attributes: [
        'id',
        'userId',
        'orderDate',
        'totalAmount',
        'status',
        'name',       // 👈 thêm dòng này
        'phone',      // 👈 thêm dòng này
        'address'     // 👈 thêm dòng này
      ],
      include: [
        {
          model: OrderItem,
          attributes: ['id', 'orderId', 'productId', 'quantity', 'unitPrice'],
          include: [
            {
              model: Product,
              attributes: ['id', 'title', 'price', 'image_url'],
            },
          ],
        },
      ],
      order: [['orderDate', 'DESC']]
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách đơn hàng:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách đơn hàng" });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId, {
      include: [OrderItem]
    });

    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    if (order.status === "Đã hủy") {
      return res.status(400).json({ message: "Đơn hàng đã bị hủy trước đó" });
    }

    // Cập nhật trạng thái
    order.status = "Đã hủy";
    await order.save();

    // Khôi phục lại số lượng đã bán
    for (let item of order.OrderItems) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        product.number2 -= item.quantity;
        if (product.number2 < 0) product.number2 = 0;
        await product.save();
      }
    }

    res.status(200).json({ message: "Đã hủy đơn hàng thành công" });
  } catch (error) {
    console.error("Lỗi khi hủy đơn hàng:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi hủy đơn hàng" });
  }
};

