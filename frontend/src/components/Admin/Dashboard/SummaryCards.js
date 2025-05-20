import { useState } from 'react';
import { FaChartLine, FaShoppingCart, FaUsers, FaBox } from 'react-icons/fa';

const SummaryCards = () => {
    const [stats] = useState({
        revenue: 'VND 53.000',
        orders: '4.557',
        customers: '1.234',
        products: '235'
    });

    return (
        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-card-header">
                    <FaChartLine className="stat-card-icon" size={24} />
                    <div className="stat-card-title">Tổng doanh thu</div>
                </div>
                <div className="stat-card-value">
                    {stats.revenue}
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-card-header">
                    <FaShoppingCart className="stat-card-icon" size={24} />
                    <div className="stat-card-title">Đơn hàng</div>
                </div>
                <div className="stat-card-value">
                    {stats.orders} <span className="trend-up">↑</span>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-card-header">
                    <FaUsers className="stat-card-icon" size={24} />
                    <div className="stat-card-title">Khách hàng</div>
                </div>
                <div className="stat-card-value">
                    {stats.customers} <span className="trend-up">↑</span>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-card-header">
                    <FaBox className="stat-card-icon" size={24} />
                    <div className="stat-card-title">Tổng sản phẩm</div>
                </div>
                <div className="stat-card-value">
                    {stats.products}
                </div>
            </div>
        </div>
    );
};

export default SummaryCards;