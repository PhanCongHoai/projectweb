const Product = require("../models/product");
exports.getProductsByCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const products = await Product.findAll({
      where: { category_id: id },
    });

    res.json({
      code: 200,
      message: "Lấy danh sách sản phẩm theo danh mục thành công",
      data: products,
    });
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
    res.status(500).json({
      code: 500,
      message: "Lỗi server",
    });
  }
};
exports.getSuggestedProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { is_suggested: true },
    });

    res.json({
      code: 200,
      message: "Lấy sản phẩm gợi ý thành công",
      data: products,
    });
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm gợi ý:", error);
    res.status(500).json({
      code: 500,
      message: "Lỗi server",
    });
  }
};
