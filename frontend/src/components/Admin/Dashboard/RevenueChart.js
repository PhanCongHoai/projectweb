import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import api from "../../../utils/axiosConfig";

// 👇 Cần import và đăng ký các thành phần cần thiết của Chart.js
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = () => {
  const [chartData, setChartData] = useState(null); // 👈 ban đầu null
  const [type, setType] = useState("day");

  const fetchData = async () => {
    try {
      const res = await api.get(`/api/reports/revenue?type=${type}`); // ✅ Đã sửa đúng endpoint
      if (res.data.code === 200) {
        const labels = res.data.data.map((item) =>
          type === "day"
            ? new Date(item.date).toLocaleDateString("vi-VN")
            : item[type]
        );
        const totals = res.data.data.map((item) => item.total);

        setChartData({
          labels,
          datasets: [
            {
              label: "Doanh thu",
              data: totals,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.4,
            },
          ],
        });
      }
    } catch (error) {
      console.error("❌ Lỗi khi lấy dữ liệu thống kê:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type]);

  return (
    <div className="revenue-chart-container">
      <div className="chart-header">
        <h3>Biểu đồ doanh thu</h3>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="day">Theo ngày</option>
          <option value="month">Theo tháng</option>
          <option value="year">Theo năm</option>
        </select>
      </div>

      {chartData ? (
        <Line data={chartData} />
      ) : (
        <p>Đang tải dữ liệu biểu đồ...</p>
      )}
    </div>
  );
};

export default RevenueChart;
