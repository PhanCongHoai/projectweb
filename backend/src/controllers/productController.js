const {Product} = require("../models");
const { Op } = require("sequelize");

// ✅ Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const host = `${req.protocol}://${req.get("host")}`;
    const products = await Product.findAll({
      order: [["id", "DESC"]],
    });

    const data = products.map((p) => {
      const discount = p.discount || 0;
      const price = p.original_price
        ? Math.round(p.original_price * (1 - discount / 100))
        : 0;
      const raw = p.image_url || "";
      const image = raw.startsWith("http")
        ? raw
        : raw
        ? `${host}/uploads/products/${raw}`
        : "";

      return {
        ...p.toJSON(),
        price,
        image,
      };
    });

    res.json({
      code: 200,
      message: "Lấy danh sách tất cả sản phẩm thành công",
      data,
    });
  } catch (error) {
    console.error("Lỗi khi lấy tất cả sản phẩm:", error);
    res.status(500).json({ code: 500, message: "Lỗi server" });
  }
};

// ✅ Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        code: 404,
        message: "Sản phẩm không tồn tại",
      });
    }
    await Product.destroy({ where: { id } });
    res.json({ code: 200, message: "Xóa sản phẩm thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    res.status(500).json({ code: 500, message: "Lỗi server" });
  }
};

// ✅ Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const { title, image_url, discount, original_price, SL, DB, category_id } =
      req.body;

    if (!title || original_price == null || category_id == null) {
      return res.status(400).json({
        code: 400,
        message: "Thiếu thông tin bắt buộc: title, original_price, category_id",
      });
    }

    if (original_price < 0 || (discount != null && discount < 0)) {
      return res.status(400).json({
        code: 400,
        message: "Giá và giảm giá không được âm",
      });
    }

    const discountValue = discount || 0;
    const finalPrice = Math.max(0, original_price * (1 - discountValue / 100));

    const newProduct = await Product.create({
      title,
      image_url: image_url || "",
      price: Math.round(finalPrice),
      discount: discountValue,
      original_price,
      SL: SL || 0,
      DB: DB || 0,
      category_id,
    });

    res.status(201).json({
      code: 201,
      message: "Thêm sản phẩm thành công",
      data: newProduct,
    });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        code: 400,
        message: "Dữ liệu không hợp lệ",
        errors: error.errors.map((e) => e.message),
      });
    }
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        code: 400,
        message: "Category ID không tồn tại",
      });
    }
    res.status(500).json({
      code: 500,
      message: "Lỗi server khi thêm sản phẩm",
    });
  }
};

// ✅ Lấy sản phẩm theo danh mục
exports.getProductsByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const host = `${req.protocol}://${req.get("host")}`;
    const products = await Product.findAll({ where: { category_id: id } });

    const data = products.map((p) => {
      const discount = p.discount || 0;
      const price = p.original_price
        ? Math.round(p.original_price * (1 - discount / 100))
        : 0;
      const raw = p.image_url || "";
      const image = raw.startsWith("http")
        ? raw
        : raw
        ? `${host}/uploads/products/${raw}`
        : "";

      return {
        id: p.id,
        title: p.title,
        image,
        original_price: p.original_price,
        discount,
        price,
        SL: p.SL,
        DB: p.DB,
        category_id: p.category_id,
        is_suggested: p.is_suggested,
        created_at: p.created_at,
        updated_at: p.updated_at,
      };
    });

    res.json({
      code: 200,
      message: "Lấy danh sách sản phẩm theo danh mục thành công",
      data,
    });
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
    res.status(500).json({ code: 500, message: "Lỗi server" });
  }
};

// ✅ Lấy sản phẩm gợi ý
exports.getSuggestedProducts = async (req, res) => {
  try {
    const host = `${req.protocol}://${req.get("host")}`;
    const products = await Product.findAll({ where: { is_suggested: true } });

    const data = products.map((p) => {
      const discount = p.discount || 0;
      const price = p.original_price
        ? Math.round(p.original_price * (1 - discount / 100))
        : 0;
      const raw = p.image_url || "";
      const image = raw.startsWith("http")
        ? raw
        : raw
        ? `${host}/uploads/products/${raw}`
        : "";

      return { ...p.toJSON(), price, image };
    });

    res.json({
      code: 200,
      message: "Lấy sản phẩm gợi ý thành công",
      data,
    });
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm gợi ý:", error);
    res.status(500).json({ code: 500, message: "Lỗi server" });
  }
};

// ✅ Tìm kiếm sản phẩm
exports.searchProducts = async (req, res) => {
  const { query } = req.query;
  if (!query || !query.trim()) {
    return res.status(400).json({ code: 400, message: "Thiếu tham số query" });
  }

  res.set("Cache-Control", "no-store");

  try {
    const q = `%${query.trim()}%`;
    const host = `${req.protocol}://${req.get("host")}`;
    const products = await Product.findAll({
      where: { title: { [Op.like]: q } },
    });

    const data = products.map((p) => {
      const discount = p.discount || 0;
      const price = p.original_price
        ? Math.round(p.original_price * (1 - discount / 100))
        : 0;
      const raw = p.image_url || "";
      const image = raw.startsWith("http")
        ? raw
        : raw
        ? `${host}/uploads/products/${raw}`
        : "";

      return { ...p.toJSON(), price, image };
    });

    res.json({
      code: 200,
      message: `Tìm kiếm sản phẩm thành công cho từ khóa "${query.trim()}"`,
      data,
    });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    res.status(500).json({
      code: 500,
      message: "Lỗi server khi tìm kiếm sản phẩm",
    });
  }
};
