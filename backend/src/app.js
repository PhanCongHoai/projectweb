require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { connectDB, syncDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// 1. Kết nối CSDL và đồng bộ Sequelize model
(async () => {
  await connectDB();
  await syncDB(); // Không dùng force: true nếu đã có dữ liệu thật
})();

// 2. CORS - Cho phép frontend truy cập
app.use(
  cors({
    origin: "http://localhost:3000", // ✅ khớp frontend
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// 3. Middleware đọc JSON và log
app.use(express.json());
app.use(morgan("dev"));

// 4. Mount route auth
app.use("/auth", authRoutes); // ✅ các route /auth/login và /auth/register

// 5. Route test đơn giản
app.get("/", (req, res) => {
  res.send("✅ API đang chạy bình thường");
});

// 6. 404 handler
app.use((req, res) => {
  console.warn(`❗️ Không tìm thấy route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "Không tìm thấy đường dẫn này" });
});

// 7. Error handler chung
app.use((err, req, res, next) => {
  console.error("🔥 Lỗi trong xử lý request:", err);
  res.status(err.status || 500).json({
    message: err.message || "Lỗi máy chủ nội bộ",
  });
});

module.exports = app;
