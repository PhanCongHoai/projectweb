import { useState } from 'react';
import Sidebar from "./Sidebar";
import "./Admin.css";

// Components
import SummaryCards from "./Dashboard/SummaryCards";
import RevenueChart from "./Dashboard/RevenueChart";
import RecentOrders from './Dashboard/RecentOrders';
import TopProducts from "./Dashboard/TopProducts";

const Admin = () => {
    const [activeMenu, setActiveMenu] = useState('dashboard');

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

            {/* Main Content */}
            <div className="admin-content">
                {activeMenu === 'dashboard' && <Dashboard />}
                {/* Các trang khác sẽ được hiển thị tùy thuộc vào activeMenu */}
            </div>
        </div>
    );
};

// Dashboard Component
const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Tổng quan</h1>

            {/* Cards thống kê */}
            <SummaryCards />

            {/* Biểu đồ doanh thu */}
            <div className="chart-container">
                <div className="chart-header">
                    <h2 className="chart-title">Phân tích doanh thu</h2>
                    <button className="chart-actions">Thêm -</button>
                </div>
                <RevenueChart />
            </div>

            <div className="grid-2col">
                {/* Đơn hàng gần đây */}
                <RecentOrders />

                {/* Sản phẩm bán chạy */}
                <TopProducts />
            </div>
        </div>
    );
};

export default Admin;