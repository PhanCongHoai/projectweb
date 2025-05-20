require("dotenv").config();
const { Sequelize } = require("sequelize");

// Tạo đối tượng Sequelize kết nối SQL Server
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      options: {
        encrypt: process.env.DB_ENCRYPT === "true", // Mã hoá kết nối
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === "true", // Cho phép chứng chỉ tự ký
      },
    },
    logging: process.env.DB_LOGGING === "true" ? console.log : false, // Bật/tắt log SQL
  }
);

// Hàm kiểm tra kết nối DB
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Kết nối SQL Server thành công");
  } catch (err) {
    console.error("❌ Kết nối thất bại:", err);
    process.exit(1);
  }
};

// Hàm sync cấu trúc bảng (không xóa dữ liệu)
const syncDB = async () => {
  try {
    await sequelize.sync(); // ✅ KHÔNG sử dụng force để tránh xóa bảng có FOREIGN KEY
    console.log("🔄 Sequelize sync thành công");
  } catch (err) {
    console.error("❌ Sequelize sync lỗi:", err);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB, syncDB };
