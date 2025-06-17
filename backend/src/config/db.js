require("dotenv").config();
const { Sequelize } = require("sequelize");

// ✅ Khởi tạo Sequelize instance
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
        encrypt: process.env.DB_ENCRYPT === "true",
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === "true",
      },
    },
    logging: process.env.DB_LOGGING === "true" ? console.log : false,
  }
);

// ✅ Export riêng từng thành phần
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Kết nối SQL Server thành công");
  } catch (err) {
    console.error("❌ Kết nối thất bại:", err);
    process.exit(1);
  }
};

const syncDB = async () => {
  try {
    await sequelize.sync();
    console.log("🔄 Sequelize sync thành công");
  } catch (err) {
    console.error("❌ Sequelize sync lỗi:", err);
    process.exit(1);
  }
};

// ✅ Cách export đúng
module.exports = {
  sequelize, // dùng để import vào model: `require(...).sequelize`
  connectDB,
  syncDB,
};

console.log("👉 ENV CHECK", {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME
});
