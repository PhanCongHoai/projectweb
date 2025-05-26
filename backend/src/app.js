require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { connectDB, syncDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// ---------------- KẾT NỐI CSDL ---------------- //
(async () => {
  try {
    await connectDB(); // Kết nối SQL Server
    await syncDB(); // Đồng bộ Sequelize model
    console.log("✅ Kết nối CSDL thành công");
  } catch (error) {
    console.error("❌ Lỗi kết nối CSDL:", error);
  }
})();

// ---------------- CẤU HÌNH CORS ---------------- //
const allowedOrigins = ["http://localhost:3000"]; // ✅ chỉ cho phép frontend chạy ở cổng 3000

app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép cả Postman, curl không có Origin
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("🚫 CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// ---------------- MIDDLEWARE CHUNG ---------------- //
app.use(express.json());
app.use(morgan("dev"));

// ---------------- ROUTES ---------------- //
app.use("/auth", authRoutes); // Login, Register
app.use("/api/categories", categoryRoutes); // Lấy danh mục sản phẩm
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
// ---------------- ROUTE KIỂM TRA ---------------- //
app.get("/", (req, res) => {
  res.send("✅ API đang chạy bình thường");
});

// ---------------- 404 NOT FOUND ---------------- //
app.use((req, res) => {
  console.warn(`Không tìm thấy route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "Không tìm thấy đường dẫn này" });
});

// ---------------- XỬ LÝ LỖI TOÀN CỤC ---------------- //
app.use((err, req, res, next) => {
  console.error("🔥 Lỗi xử lý request:", err);
  res.status(err.status || 500).json({
    message: err.message || "Lỗi máy chủ nội bộ",
  });
});

module.exports = app;
