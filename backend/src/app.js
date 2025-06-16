require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const { connectDB, syncDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require('./routes/orderRoutes');


const userRoutes = require("./routes/userRoutes");
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");

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

// ---------------- PHỤC VỤ FILE TĨNH ---------------- //
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------- CẤU HÌNH CORS ---------------- //
const allowedOrigins = ["http://localhost:3000"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
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
app.use("/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes); // ✅ THÊM ROUTE GIỎ HÀNG
app.use('/api/orders', orderRoutes);
app.use("/api/forgot-password", forgotPasswordRoutes);

// ---------------- ROUTE KIỂM TRA ---------------- //
app.get("/", (req, res) => {
  res.send("✅ API đang chạy bình thường");
});

// ---------------- 404 NOT FOUND ---------------- //
app.use((req, res) => {
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
