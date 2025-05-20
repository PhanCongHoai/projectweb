import { useState } from 'react';

const RevenueChart = () => {
    // Các điểm dữ liệu mẫu cho biểu đồ theo hình mẫu
    const [chartData] = useState([
        { month: 'Th1', value: 30 },
        { month: 'Th3', value: 65 },
        { month: 'Th5', value: 40 },
        { month: 'Thng', value: 25 },
        { month: 'Th6', value: 55 },
        { month: 'Th7', value: 35 },
        { month: 'Th7', value: 45 },
    ]);

    return (
        <div className="chart-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 800 300"
                preserveAspectRatio="none"
                style={{ display: 'block' }}
            >
                {/* Định nghĩa gradient */}
                <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Grid lines (nếu cần) */}
                <line x1="0" y1="250" x2="800" y2="250" stroke="#E5E7EB" strokeWidth="1" />

                {/* Đường biểu đồ */}
                <path
                    d="M0,100 C66.7,70 133.3,150 200,120 C266.7,90 333.3,130 400,170 C466.7,210 533.3,110 600,80 C666.7,50 733.3,110 800,100"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Vùng tô màu dưới đường biểu đồ */}
                <path
                    d="M0,100 C66.7,70 133.3,150 200,120 C266.7,90 333.3,130 400,170 C466.7,210 533.3,110 600,80 C666.7,50 733.3,110 800,100 L800,250 L0,250 Z"
                    fill="url(#areaGradient)"
                />
            </svg>

            {/* Nhãn tháng - căn chỉnh để khớp với biểu đồ */}
            <div
                className="chart-labels"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    padding: '0 5px'
                }}
            >
                <div style={{ flex: '0 0 auto' }}>Th1</div>
                <div style={{ flex: '0 0 auto' }}>Th3</div>
                <div style={{ flex: '0 0 auto' }}>Th5</div>
                <div style={{ flex: '0 0 auto' }}>Thng</div>
                <div style={{ flex: '0 0 auto' }}>Th6</div>
                <div style={{ flex: '0 0 auto' }}>Th7</div>
                <div style={{ flex: '0 0 auto' }}>Th7</div>
            </div>
        </div>
    );
};

export default RevenueChart;