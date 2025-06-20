const { Product } = require("../models");
const { Op, Sequelize } = require("sequelize");

function formatDateForSQLServer(date) {
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const HH = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`; // ✅ Sửa: thêm dấu `
}

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
    const finalPrice = Math.max(
      0,
      parseFloat(original_price) -
        (parseFloat(original_price) * discountValue) / 100
    );

    const formattedDate = formatDateForSQLServer(new Date());
    const newProduct = await Product.create({
      title,
      image_url: image_url || "",
      price: Math.round(finalPrice),
      discount: discountValue,
      original_price,
      number: SL || 0,
      number2: DB || 0,
      category_id,
      created_at: formattedDate,
      updated_at: formattedDate,
    });
    console.log(newProduct);
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
        SL: p.number,
        DB: p.number2,
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

    const products = await Product.findAll({
      where: Sequelize.where(Sequelize.literal("[number] - [number2]"), {
        [Op.gt]: 0,
      }),
      order: [["number2", "DESC"]],
      limit: 10,
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
        SL: p.number, // Số lượng tồn
        DB: p.number2, // Đã bán
        price,
        image,
      };
    });

    res.json({
      code: 200,
      message: "Lấy sản phẩm gợi ý thành công",
      data,
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy sản phẩm gợi ý:", error);
    res.status(500).json({ code: 500, message: "Lỗi server" });
  }
};

// ✅ Tìm kiếm sản phẩm
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

      return { ...p.toJSON(), SL: p.number, DB: p.number2, price, image };
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

// ✅ Lấy chi tiết sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        code: 404,
        message: "Sản phẩm không tồn tại",
      });
    }
    const discount = product.discount || 0;
    const price = product.original_price
      ? Math.round(product.original_price * (1 - discount / 100))
      : 0;

    const raw = product.image_url || "";
    const host = `${req.protocol}://${req.get("host")}`;
    const image = raw.startsWith("http")
      ? raw
      : raw
      ? `${host}/uploads/products/${raw}`
      : "";

    res.json({
      code: 200,
      message: "Lấy chi tiết sản phẩm thành công",
      data: {
        ...product.toJSON(),
        price,
        image,
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    res.status(500).json({
      code: 500,
      message: "Lỗi server",
    });
  }
};
