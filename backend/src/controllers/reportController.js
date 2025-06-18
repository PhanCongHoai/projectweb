const { Order } = require("../models");
const { Op, fn, col, literal } = require("sequelize");

const getRevenue = async (req, res) => {
  const { type = "day" } = req.query;

  let groupExpr, labelExpr;

  // Chọn cách group theo ngày / tháng / năm
  switch (type) {
    case "month":
      groupExpr = fn("FORMAT", col("orderDate"), "yyyy-MM");
      labelExpr = "month";
      break;
    case "year":
      groupExpr = fn("YEAR", col("orderDate"));
      labelExpr = "year";
      break;
    default:
      groupExpr = fn("CONVERT", literal("DATE"), col("orderDate"));
      labelExpr = "date";
  }

  try {
    const data = await Order.findAll({
      where: { status: "Đã xác nhận" },
      attributes: [
        [groupExpr, labelExpr],
        [fn("SUM", col("totalAmount")), "total"],
      ],
      group: [groupExpr],
      order: [[groupExpr, "ASC"]],
      raw: true,
    });

    res.status(200).json({
      code: 200,
      message: `Thống kê doanh thu theo ${type}`,
      data,
    });
  } catch (err) {
    console.error("❌ Lỗi thống kê doanh thu:", err);
    res.status(500).json({ code: 500, message: "Lỗi server" });
  }
};

module.exports = { getRevenue };
