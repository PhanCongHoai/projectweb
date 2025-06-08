const Product = require("../models/product");

// ✅ Thêm function để lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['id', 'DESC']] // Sắp xếp theo ID giảm dần (mới nhất trước)
    });

    res.json({
      code: 200,
      message: "Lấy danh sách tất cả sản phẩm thành công",
      data: products,
    });
  } catch (error) {
    console.error("Lỗi khi lấy tất cả sản phẩm:", error);
    res.status(500).json({
      code: 500,
      message: "Lỗi server",
    });
  }
};

// ✅ Thêm function để xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        code: 404,
        message: "Sản phẩm không tồn tại",
      });
    }

    // Xóa sản phẩm
    await Product.destroy({
      where: { id: id }
    });

    res.json({
      code: 200,
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    res.status(500).json({
      code: 500,
      message: "Lỗi server",
    });
  }
};

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

exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      product_url,
      image_url,
      price,
      discount,
      original_price,
      number,
      number2,
      category_id,
    } = req.body;

    // ✅ Validation: Kiểm tra các trường bắt buộc
    if (!title || !original_price || !category_id) {
      return res.status(400).json({
        code: 400,
        message: "Thiếu thông tin bắt buộc: title, original_price, category_id",
      });
    }

    // ✅ Validation: Kiểm tra số âm
    if (original_price < 0 || discount < 0) {
      return res.status(400).json({
        code: 400,
        message: "Giá và giảm giá không được âm",
      });
    }

    // ✅ Fix: Tính giá cuối cùng đúng cách
    const discountValue = discount || 0;
    const finalPrice = Math.max(0, original_price - (original_price * discountValue) / 100);

    console.log("📊 Dữ liệu nhận được:", {
      title,
      product_url,
      image_url,
      price: finalPrice,
      discount: discountValue,
      original_price,
      number,
      number2,
      category_id,
    });

    const newProduct = await Product.create({
      title,
      product_url: product_url || "",
      image_url: image_url || "",
      price: Math.round(finalPrice), // ✅ Làm tròn giá
      discount: discountValue,
      original_price,
      number: number || 0,
      number2: number2 || 0,
      category_id,
    });

    res.status(201).json({
      code: 201,
      message: "Thêm sản phẩm thành công",
      data: newProduct,
    });
  } catch (error) {
    console.error("❌ Lỗi khi thêm sản phẩm:", error);

    // ✅ Trả về thông tin lỗi chi tiết hơn
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        code: 400,
        message: "Dữ liệu không hợp lệ",
        errors: error.errors.map(e => e.message),
      });
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        code: 400,
        message: "Category ID không tồn tại",
      });
    }

    res.status(500).json({
      code: 500,
      message: "Lỗi server khi thêm sản phẩm",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};