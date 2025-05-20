import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const RecentOrders = () => {
    const [orders] = useState([
        { id: '#2045', customer: 'Jane Smith', date: '24 Tháng 07, 2023', status: 'Hoàn thành' },
        { id: '#2044', customer: 'Michael Johnson', date: '24 Tháng 07, 2023', status: 'Đang xử lý' },
        { id: '#2043', customer: 'Emily Davis', date: '23 Tháng 07, 2023', status: 'Đã giao' },
        { id: '#2042', customer: 'David Brown', date: '21 Tháng 07, 2023', status: 'Trạng khác' },
        { id: '#2041', customer: 'Sarah Wilson', date: '20 Tháng 07, 2023', status: 'Đã hủy' }
    ]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Hoàn thành': return 'status-badge status-completed';
            case 'Đang xử lý': return 'status-badge status-processing';
            case 'Đã giao': return 'status-badge status-delivered';
            case 'Đã hủy': return 'status-badge status-cancelled';
            default: return 'status-badge status-other';
        }
    };

    return (
        <div className="table-container">
            <div className="table-header">
                <h2 className="table-title">Đơn hàng gần đây</h2>
                <ChevronRight size={24} className="text-blue-500" />
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>Mã đơn</th>
                        <th>Khách hàng</th>
                        <th>Ngày</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customer}</td>
                            <td>{order.date}</td>
                            <td><span className={getStatusClass(order.status)}>{order.status}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RecentOrders;