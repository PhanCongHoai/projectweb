// backend/src/controllers/categoryController.js
const { sequelize } = require("../config/db");
const { QueryTypes } = require("sequelize");

exports.getAllCategories = async (req, res) => {
  try {
    const raw = await sequelize.query(
      "SELECT id, name, url FROM [profectWeb].[dbo].[Category]",
      { type: QueryTypes.SELECT }
    );

    const host = `${req.protocol}://${req.get("host")}`;
    const categories = raw.map((cat) => {
      const { id, name, url } = cat;
      const image = url.startsWith("http")
        ? url
        : `${host}/uploads/categories/${url}`;

      // Trả cả url lẫn image
      return { id, name, url, image };
    });

    return res.json({
      code: 200,
      message: "Lấy danh mục thành công",
      data: categories,
    });
  } catch (err) {
    console.error("❌ Lỗi khi truy vấn danh mục:", err);
    return res.status(500).json({
      code: 500,
      message: "Lỗi server khi lấy danh mục",
      error: err.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedCount = await sequelize.query(
      "DELETE FROM [profectWeb].[dbo].[Category] WHERE id = :id",
      { replacements: { id }, type: QueryTypes.DELETE }
    );

    if (deletedCount === 0) {
      return res.status(404).json({
        code: 404,
        message: `Không tìm thấy danh mục với id = ${id}`,
      });
    }

    return res.json({
      code: 200,
      message: "Xóa danh mục thành công",
    });
  } catch (err) {
    console.error("❌ Lỗi khi xóa danh mục:", err);
    return res.status(500).json({
      code: 500,
      message: "Lỗi server khi xóa danh mục",
      error: err.message,
    });
  }
};
exports.createCategory = async (req, res) => {
  const { name, url } = req.body;
  try {
    await sequelize.query(
      `INSERT INTO [profectWeb].[dbo].[Category] (name, url)
       VALUES (:name, :url)`,
      {
        replacements: { name, url },
        type: QueryTypes.INSERT,
      }
    );
    return res.status(201).json({
      code: 201,
      message: "Tạo danh mục thành công",
    });
  } catch (err) {
    console.error("❌ Lỗi khi tạo danh mục:", err);
    return res.status(500).json({
      code: 500,
      message: "Lỗi server khi tạo danh mục",
      error: err.message,
    });
  }
};
