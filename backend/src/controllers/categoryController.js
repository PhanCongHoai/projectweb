const db = require("../config/db"); // import object
const sequelize = db.sequelize;
const getAllCategories = async (req, res) => {
  try {
    const [results] = await sequelize.query(
      "SELECT id, name, url FROM [profectWeb].[dbo].[Category]"
    );

    const categories = results.map((row) => ({
      id: row.id,
      name: row.name,
      image: row.url,
    }));

    res.json({ code: 200, message: "Success", data: categories });
  } catch (err) {
    console.error("❌ Lỗi khi truy vấn danh mục:", err.message);
    console.error("🔥 Stack:", err.stack); // ✅ phải có
    res.status(500).json({
      code: 500,
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = { getAllCategories };
