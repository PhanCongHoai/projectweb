import { useState } from "react";
import Sidebar from "./Sidebar";
import "./Admin.css";

// Components
import SummaryCards from "./Dashboard/SummaryCards";
import RecentOrders from "./Dashboard/RecentOrders";
import TopProducts from "./Dashboard/TopProducts";
import SectionAdminUsers from "./SectionAdminUsers"; // ✅ import đúng đường dẫn nếu nằm trong Admin

const Admin = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* Main Content */}
      <div className="admin-content">
        {activeMenu === "dashboard" && <Dashboard />}
        {activeMenu === "users" && <SectionAdminUsers />}{" "}
        {/* ✅ THÊM DÒNG NÀY */}
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Tổng quan</h1>
      <SummaryCards />
      <div className="grid-2col">
        <RecentOrders />
        <TopProducts />
      </div>
    </div>
  );
};

export default Admin;
