import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/axiosConfig";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId") || 42;

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const provinces = [
    { code: "01", name: "TP Hồ Chí Minh" },
    { code: "02", name: "Hà Nội" },
  ];

  const districts = {
    "01": [
      { code: "011", name: "Quận 1" },
      { code: "012", name: "Quận 2" },
    ],
    "02": [
      { code: "021", name: "Quận Ba Đình" },
      { code: "022", name: "Quận Hoàn Kiếm" },
    ],
  };

  const wards = {
    "011": [
      { code: "0111", name: "Phường 1" },
      { code: "0112", name: "Phường 2" },
    ],
    "012": [
      { code: "0121", name: "Phường Thảo Điền" },
      { code: "0122", name: "Phường Bình An" },
    ],
    "021": [
      { code: "0211", name: "Phường Kim Mã" },
      { code: "0212", name: "Phường Giảng Võ" },
    ],
    "022": [
      { code: "0221", name: "Phường Hàng Bạc" },
      { code: "0222", name: "Phường Hàng Gai" },
    ],
  };

  const from = new URLSearchParams(location.search).get("from");

  useEffect(() => {
    const tempOrder = JSON.parse(localStorage.getItem("tempOrder"));
    if (from === "buy" && tempOrder) {
      setOrder(tempOrder);
      setTotal(tempOrder.quantity * tempOrder.product.price);
    } else {
      localStorage.removeItem("tempOrder");
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
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = async () => {
    if (
      !customerInfo.name ||
      !customerInfo.phone ||
      !customerInfo.address ||
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard
    ) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const fullAddress = `${customerInfo.address}, ${
        wards[selectedDistrict]?.find((w) => w.code === selectedWard)?.name
      }, ${
        districts[selectedProvince]?.find((d) => d.code === selectedDistrict)
          ?.name
      }, ${provinces.find((p) => p.code === selectedProvince)?.name}`;

      if (order) {
        const orderData = {
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: fullAddress,
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
        await api.post(`/api/cart/checkout/${userId}`, {
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: fullAddress,
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

      {order && (
        <div className="order-summary">
          <img src={order.product.image_url} alt={order.product.title} />
          <div>
            <h3>{order.product.title}</h3>
            <p>Số lượng: {order.quantity}</p>
            <p>Giá: {Number(order.product.price).toLocaleString()}₫</p>
            <p>
              <strong>Tổng tiền: {Number(total).toLocaleString()}₫</strong>
            </p>
          </div>
        </div>
      )}

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
                  Thành tiền:{" "}
                  {(item.quantity * item.Product.price).toLocaleString()}₫
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
          placeholder="Địa chỉ (số nhà, đường...)"
          value={customerInfo.address}
          onChange={handleChange}
        />

        <select
          value={selectedProvince}
          onChange={(e) => {
            setSelectedProvince(e.target.value);
            setSelectedDistrict("");
            setSelectedWard("");
          }}
        >
          <option value="">Chọn tỉnh/thành</option>
          {provinces.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={selectedDistrict}
          onChange={(e) => {
            setSelectedDistrict(e.target.value);
            setSelectedWard("");
          }}
          disabled={!selectedProvince}
        >
          <option value="">Chọn quận/huyện</option>
          {(districts[selectedProvince] || []).map((d) => (
            <option key={d.code} value={d.code}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
          disabled={!selectedDistrict}
        >
          <option value="">Chọn phường/xã</option>
          {(wards[selectedDistrict] || []).map((w) => (
            <option key={w.code} value={w.code}>
              {w.name}
            </option>
          ))}
        </select>

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
