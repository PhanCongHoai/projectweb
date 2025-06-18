import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import api from "../../../utils/axiosConfig";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký thành phần của Bar chart
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = () => {
  const [chartData, setChartData] = useState(null);
  const [type, setType] = useState("day");

  const fetchData = async () => {
    try {
      const res = await api.get(`/api/reports/revenue?type=${type}`);
      if (res.data.code === 200) {
        const data = res.data.data;
        console.log("📊 Dữ liệu từ backend:", data);

        // Tạo nhãn theo loại dữ liệu
        const labels = data.map((item) => {
          if (type === "day" && item.date) {
            const d = new Date(item.date);
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            return `${day}/${month}`;
          } else if (type === "month" && item.month) {
            return `Tháng ${item.month.slice(5)}/${item.month.slice(0, 4)}`;
          } else if (type === "year" && item.year) {
            return `Năm ${item.year}`;
          } else {
            return "Không xác định";
          }
        });

        // Lấy dữ liệu doanh thu
        const totals = data.map((item) => Number(item.total || 0));

        setChartData({
          labels,
          datasets: [
            {
              label: "Doanh thu",
              data: totals,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
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
        <Bar
          data={chartData}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => value.toLocaleString("vi-VN") + " ₫",
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (ctx) =>
                    `${ctx.dataset.label}: ${ctx.raw.toLocaleString(
                      "vi-VN"
                    )} ₫`,
                },
              },
            },
          }}
        />
      ) : (
        <p>Đang tải dữ liệu biểu đồ...</p>
      )}
    </div>
  );
};

export default RevenueChart;
