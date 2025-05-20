// testDb.js
require("dotenv").config();
const { connectDB } = require("./src/config/db");

connectDB()
  .then(() => {
    console.log("✔️  Test kết nối thành công!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌  Test kết nối thất bại:", err);
    process.exit(1);
  });
