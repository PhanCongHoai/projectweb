import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/axiosConfig";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId") || 42;

  const [order, setOrder] = useState(null);        // mua ngay
  const [items, setItems] = useState([]);          // giỏ hàng
  const [total, setTotal] = useState(0);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");

  // Lấy source từ URL (?from=buy hoặc ?from=cart)
  const from = new URLSearchParams(location.search).get("from");

  useEffect(() => {
    const tempOrder = JSON.parse(localStorage.getItem("tempOrder"));

    // Nếu từ "mua ngay" thì dùng tempOrder
    if (from === "buy" && tempOrder) {
      setOrder(tempOrder);
      setTotal(tempOrder.quantity * tempOrder.product.price);
    } else {
      // Xóa tempOrder nếu đến từ giỏ hàng
      localStorage.removeItem("tempOrder");

      // Lấy dữ liệu giỏ hàng
      api
        .get(`/api/cart/${userId}`)
        .then((res) => {
          const cartItems = res.data.items || [];
          setItems(cartItems);
          const sum = cartItems.reduce(
            (acc, item) => acc + item.quantity * item.Product.price,
            0
          );
          setTotal(sum);
        })
        .catch((err) => console.error("Lỗi tải giỏ hàng:", err));
    }
  }, [userId, from]);

  const handleChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleConfirmOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      if (order) {
        // ✅ Mua ngay
        const orderData = {
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: customerInfo.address,
          total: total,
          items: [
            {
              product_id: order.product.id,
              quantity: order.quantity,
              price: order.product.price,
            },
          ],
        };

        await api.post(`/api/orders/${userId}`, orderData);
        localStorage.removeItem("tempOrder");
      } else {
        // ✅ Thanh toán giỏ hàng
        await api.post(`/api/cart/checkout/${userId}`, {
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: customerInfo.address,
          total: total,
        });

        await api.delete(`/api/cart/clear/${userId}`);
      }

      alert("Đặt hàng thành công!");
      navigate("/");
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
      alert("Không thể đặt hàng!");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Thanh Toán Đơn Hàng</h2>

      {/* Nếu là mua ngay */}
      {order && (
        <div className="order-summary">
          <img src={order.product.image_url} alt={order.product.title} />
          <div>
            <h3>{order.product.title}</h3>
            <p>Số lượng: {order.quantity}</p>
            <p>Giá: {Number(order.product.price).toLocaleString()}₫</p>
            <p><strong>Tổng tiền: {Number(total).toLocaleString()}₫</strong></p>
          </div>
        </div>
      )}

      {/* Nếu là giỏ hàng */}
      {!order &&
        items.map((item) => (
          <div key={item.id} className="order-summary">
            <img src={item.Product.image_url} alt={item.Product.title} />
            <div>
              <h3>{item.Product.title}</h3>
              <p>Số lượng: {item.quantity}</p>
              <p>Giá: {Number(item.Product.price).toLocaleString()}₫</p>
              <p>
                <strong>
                  Thành tiền: {(item.quantity * item.Product.price).toLocaleString()}₫
                </strong>
              </p>
            </div>
          </div>
        ))}

      <h3>Thông Tin Khách Hàng</h3>
      <div className="customer-form">
        <input
          type="text"
          name="name"
          placeholder="Họ tên"
          value={customerInfo.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          value={customerInfo.phone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ giao hàng"
          value={customerInfo.address}
          onChange={handleChange}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      <h3>Hình thức thanh toán: Tiền mặt khi nhận hàng</h3>

      <button className="confirm-order-btn" onClick={handleConfirmOrder}>
        Xác nhận đơn hàng
      </button>
    </div>
  );
};

export default CheckoutPage;
