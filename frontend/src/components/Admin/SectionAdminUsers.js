import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "./SectionAdminUsers.css";

const SectionAdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log("📦 Gọi API: /api/users");

    axios
      .get("/api/users")
      .then((res) => {
        console.log("✅ Kết quả:", res.data);
        if (res.data.code === 200) {
          setUsers(res.data.data);
        }
      })
      .catch((err) => {
        console.error("❌ Lỗi khi lấy user:", err);
      });
  }, []);

  return (
    <div className="user-table-wrapper">
      <h2>Danh sách khách hàng</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Địa chỉ</th>
            <th>Vai trò</th>
            <th>Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="7">Không có dữ liệu</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.fullname}</td>
                <td>{user.email}</td>
                <td>{user.phone_number}</td>
                <td>{user.address}</td>
                <td>{user.role_id === 1 ? "Admin" : "User"}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SectionAdminUsers;
