const {
  Order,
  OrderItem,
  Cart,
  CartItem,
  Product,
  User,
} = require("../models");

const { sequelize } = require("../config/db");
const { Op } = require("sequelize");

// 📌 Format ngày kiểu SQL Server
function formatDateForSQLServer(date) {
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const HH = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
}

// ✅ Tạo đơn hàng mới
const createOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { items, name, phone, address, total } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    let orderItems = [];

    if (items && items.length > 0) {
      for (const item of items) {
        const product = await Product.findByPk(item.product_id);
        if (!product) {
          return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

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
      const cart = await Cart.findOne({ where: { userId } });
      if (!cart)
        return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

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

    const newOrder = await Order.create({
      userId,
      orderDate: formattedDate,
      totalAmount: total,
      status: "Chờ xác nhận",
      name,
      phone,
      address,
    });

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

    if (!items) {
      const cart = await Cart.findOne({ where: { userId } });
      if (cart) await CartItem.destroy({ where: { cartId: cart.id } });
    }

    res.status(201).json({
      message: "Đã tạo đơn hàng thành công",
      orderId: newOrder.id,
    });
  } catch (error) {
    console.error("❌ Lỗi khi tạo đơn hàng:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi tạo đơn hàng" });
  }
};

// ✅ Lấy tất cả đơn hàng
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      attributes: [
        "id",
        "userId",
        "orderDate",
        "totalAmount",
        "status",
        "name",
        "phone",
        "address",
      ],
      include: [
        {
          model: User,
          attributes: ["fullname", "email"],
        },
      ],
      order: [["orderDate", "DESC"]],
    });

    res.status(200).json({
      code: 200,
      message: "Lấy danh sách tất cả đơn hàng thành công",
      data: orders,
    });
  } catch (error) {
    console.error("❌ Lỗi getAllOrders:", error);
    res.status(500).json({
      code: 500,
      message: "Lỗi server khi lấy tất cả đơn hàng",
    });
  }
};

// ✅ Lấy đơn hàng theo userId
const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.findAll({
      where: { userId },
      attributes: [
        "id",
        "userId",
        "orderDate",
        "totalAmount",
        "status",
        "name",
        "phone",
        "address",
      ],
      include: [
        {
          model: OrderItem,
          attributes: ["id", "orderId", "productId", "quantity", "unitPrice"],
          include: [
            {
              model: Product,
              attributes: ["id", "title", "price", "image_url"],
            },
          ],
        },
      ],
      order: [["orderDate", "DESC"]],
    });

    res.status(200).json({ code: 200, data: orders });
  } catch (error) {
    console.error("❌ Lỗi khi lấy đơn hàng theo user:", error);
    res.status(500).json({ code: 500, message: "Lỗi máy chủ" });
  }
};

// ✅ Lấy đơn hàng chờ xác nhận
const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { status: "Chờ xác nhận" },
      attributes: [
        "id",
        "userId",
        "orderDate",
        "totalAmount",
        "status",
        "name",
        "phone",
        "address",
      ],
      include: [{ model: User, attributes: ["fullname", "email"] }],
      order: [["orderDate", "DESC"]],
    });

    res.status(200).json({
      code: 200,
      message: "Lấy danh sách đơn hàng chờ xác nhận thành công",
      data: orders,
    });
  } catch (error) {
    console.error("❌ Lỗi getPendingOrders:", error);
    res.status(500).json({ code: 500, message: "Lỗi server" });
  }
};

// ✅ Xác nhận đơn hàng
const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId);
    if (!order)
      return res
        .status(404)
        .json({ code: 404, message: "Không tìm thấy đơn hàng" });

    if (order.status !== "Chờ xác nhận")
      return res
        .status(400)
        .json({ code: 400, message: "Đơn hàng không hợp lệ" });

    order.status = "Đã xác nhận";
    await order.save();

    res
      .status(200)
      .json({ code: 200, message: "Xác nhận đơn hàng thành công" });
  } catch (error) {
    console.error("❌ Lỗi confirmOrder:", error);
    res.status(500).json({ code: 500, message: "Lỗi server" });
  }
};

// ✅ Hủy đơn hàng
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId, { include: [OrderItem] });
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    if (order.status === "Đã hủy") {
      return res.status(400).json({ message: "Đơn hàng đã bị hủy trước đó" });
    }

    order.status = "Đã hủy";
    await order.save();

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
    console.error("❌ Lỗi khi hủy đơn hàng:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi hủy đơn hàng" });
  }
};
const getOtherOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { status: { [Op.ne]: "Chờ xác nhận" } },
      order: [["orderDate", "DESC"]],
    });

    res.status(200).json({
      code: 200,
      message: "Lấy đơn hàng khác thành công",
      data: orders,
    });
  } catch (error) {
    console.error("❌ Lỗi getOtherOrders:", error);
    res.status(500).json({ code: 500, message: "Lỗi server" });
  }
};

// ✅ Export tất cả
module.exports = {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  getPendingOrders,
  confirmOrder,
  cancelOrder,
  getOtherOrders,
};
