import React, { useEffect, useState } from "react";
import api from "../../../utils/axiosConfig";

const PendingOrders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [otherOrders, setOtherOrders] = useState([]);

  useEffect(() => {
    // Lấy đơn hàng chờ xác nhận
    api
      .get("/api/orders/pending")
      .then((res) => {
        if (res.data.code === 200) {
          setPendingOrders(res.data.data);
        }
      })
      .catch((err) => console.error("❌ Lỗi khi lấy pending orders:", err));

    // Lấy đơn hàng khác
    api
      .get("/api/orders/others") // 👈 endpoint mới cần backend hỗ trợ
      .then((res) => {
        if (res.data.code === 200) {
          setOtherOrders(res.data.data);
        }
      })
      .catch((err) => console.error("❌ Lỗi khi lấy other orders:", err));
  }, []);

  // ✅ Xác nhận đơn hàng
  const confirmOrder = async (orderId) => {
    try {
      const res = await api.put(`/api/orders/${orderId}/confirm`);
      if (res.data.code === 200 || res.status === 200) {
        setPendingOrders((prev) => prev.filter((o) => o.id !== orderId));
      }
    } catch (err) {
      console.error("❌ Lỗi khi xác nhận đơn hàng:", err);
    }
  };

  return (
    <div className="pending-orders-container">
      <h2>Đơn hàng chờ xác nhận</h2>
      <table className="pending-orders-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>UserId</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Họ tên</th>
            <th>Điện thoại</th>
            <th>Địa chỉ</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {pendingOrders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.userId}</td>
              <td>
                {o.orderDate ? new Date(o.orderDate).toLocaleString() : "–"}
              </td>
              <td>{o.totalAmount?.toLocaleString() || "–"}</td>
              <td>{o.name || "–"}</td>
              <td>{o.phone || "–"}</td>
              <td>{o.address || "–"}</td>
              <td>
                <button
                  className="confirm-btn"
                  onClick={() => confirmOrder(o.id)}
                >
                  Xác nhận
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: "40px" }}>Đơn hàng </h2>
      <table className="pending-orders-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>UserId</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Họ tên</th>
            <th>Điện thoại</th>
            <th>Địa chỉ</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {otherOrders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.userId}</td>
              <td>
                {o.orderDate ? new Date(o.orderDate).toLocaleString() : "–"}
              </td>
              <td>{o.totalAmount?.toLocaleString() || "–"}</td>
              <td>{o.name || "–"}</td>
              <td>{o.phone || "–"}</td>
              <td>{o.address || "–"}</td>
              <td>{o.status || "–"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingOrders;
