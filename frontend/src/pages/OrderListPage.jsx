import { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import "./OrderListPage.css";

const OrderListPage = () => {
  const userId = localStorage.getItem("userId") || 42;
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api
      .get(`/api/orders/user/${userId}`)
      .then((res) => {
        setOrders(res.data.orders || []);
      })
      .catch((err) => {
        console.error("Lỗi lấy đơn hàng:", err);
      });
  }, [userId]);

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?");
    if (!confirmCancel) return;

    try {
      const res = await api.put(`/api/orders/cancel/${orderId}`);
      alert(res.data.message);

      // Cập nhật trạng thái trong state
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: "Đã hủy" } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Lỗi hủy đơn:", error);
      alert("Không thể hủy đơn hàng");
    }
  };

  return (
    <div className="order-list-container">
      <h2>Đơn hàng đã mua</h2>
      {orders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <h3>Đơn hàng</h3>
            <p><strong>Người đặt:</strong> {order.name}</p>
            <p><strong>Số điện thoại:</strong> {order.phone}</p>
            <p><strong>Địa chỉ:</strong> {order.address}</p>
            <p><strong>Ngày đặt:</strong> {new Date(order.orderDate).toLocaleString()}</p>
            <p><strong>Tổng tiền:</strong> {Number(order.totalAmount).toLocaleString()}₫</p>
            <p><strong>Trạng thái:</strong> {order.status}</p>

            {/* Nút hủy đơn hàng (chỉ hiển thị nếu chưa giao và chưa hủy) */}
            {order.status !== "Đã giao" && order.status !== "Đã hủy" && (
              <button
                onClick={() => handleCancelOrder(order.id)}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "5px",
                  marginTop: "10px",
                  cursor: "pointer"
                }}
              >
                Hủy đơn
              </button>
            )}

            <hr />
            {order.OrderItems?.map((item) => (
              <div key={item.id} className="order-item">
                <p><strong>Sản phẩm:</strong> {item.Product?.title}</p>
                <img
                  src={item.Product?.image_url}
                  alt={item.Product?.title}
                  style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                />
                <p><strong>Số lượng:</strong> {item.quantity}</p>
                <p><strong>Giá:</strong> {Number(item.unitPrice).toLocaleString()}₫</p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderListPage;
