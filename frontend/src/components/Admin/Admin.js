// frontend/src/components/Admin/Admin.jsx

import { useState } from "react";
import Sidebar from "./Sidebar";
import "./Admin.css";
import SectionAdminProducts from "./SectionAdminProducts";

// Components
import SummaryCards from "./Dashboard/SummaryCards";
import RecentOrders from "./Dashboard/RecentOrders";
import SectionAdminUsers from "./SectionAdminUsers";
import SectionAdminCategories from "./SectionAdminCategories/SectionAdminCategories";

const Admin = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* Main Content */}
      <div className="admin-content">
        {activeMenu === "dashboard" && <Dashboard />}
        {activeMenu === "users" && <SectionAdminUsers />}
        {activeMenu === "products" && <SectionAdminProducts />}
        {activeMenu === "categories" && <SectionAdminCategories />}
        {activeMenu === "orders" && <RecentOrders />}
      </div>
    </div>
  );
};

// Dashboard component giữ nguyên
const Dashboard = () => (
  <div className="dashboard-container">
    <h1 className="dashboard-title">Tổng quan</h1>
    <SummaryCards />
    <div className="grid-2col">
      <RecentOrders />
    </div>
  </div>
);

export default Admin;
