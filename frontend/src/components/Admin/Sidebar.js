import {
  FaHome,
  FaChartLine,
  FaShoppingCart,
  FaBox,
  FaUsers,
  FaChartBar,
  FaCog,
} from "react-icons/fa";
import "./Admin.css";

const Sidebar = ({ activeMenu, setActiveMenu }) => {
  const menuItems = [
    { icon: <FaChartLine />, label: "Tổng quan", key: "dashboard" },
    { icon: <FaShoppingCart />, label: "Đơn hàng", key: "orders" },
    { icon: <FaBox />, label: "Sản phẩm", key: "products" },
    // ✅ key sửa thành "users" để trùng với Admin.js
    { icon: <FaUsers />, label: "Khách hàng", key: "users" },
    { icon: <FaChartBar />, label: "Phân tích", key: "analytics" },
    { icon: <FaCog />, label: "Cài đặt", key: "settings" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand-icon">
          <FaHome />
        </div>
        <div className="sidebar-brand-text">Admin</div>
      </div>

      <div className="sidebar-divider"></div>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={`sidebar-item ${
              activeMenu === item.key ? "active" : ""
            }`}
            onClick={() => setActiveMenu(item.key)}
          >
            <div className="sidebar-icon">{item.icon}</div>
            <span className="sidebar-item-text">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
