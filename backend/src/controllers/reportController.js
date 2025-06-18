const { Order } = require("../models");
const { Op, fn, col, literal } = require("sequelize");

const getRevenue = async (req, res) => {
  const { type = "day" } = req.query;

  let groupExpr, labelName;

  switch (type) {
    case "month":
      groupExpr = fn("FORMAT", col("orderDate"), "yyyy-MM");
      labelName = "month";
      break;
    case "year":
      groupExpr = fn("YEAR", col("orderDate"));
      labelName = "year";
      break;
    default:
      groupExpr = fn("CONVERT", literal("DATE"), col("orderDate"));
      labelName = "date";
  }

  try {
    let rawData = await Order.findAll({
      where: { status: "Đã xác nhận" },
      attributes: [
        [groupExpr, labelName],
        [fn("SUM", col("totalAmount")), "total"],
      ],
      group: [groupExpr],
      order: [[groupExpr, "ASC"]],
      raw: true,
    });

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-based
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    if (type === "month") {
      const fullYearMonths = Array.from({ length: 12 }, (_, i) => {
        const month = String(i + 1).padStart(2, "0");
        return `${currentYear}-${month}`;
      });

      rawData = fullYearMonths.map((m) => {
        const existing = rawData.find((item) => item.month === m);
        return {
          month: m,
          total: existing ? Number(existing.total) : 0,
        };
      });
    }

    if (type === "year") {
      const y = currentYear.toString();
      const existing = rawData.find((item) => item.year == y);
      rawData = [
        {
          year: y,
          total: existing ? Number(existing.total) : 0,
        },
      ];
    }

    if (type === "day") {
      const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(currentYear, currentMonth, i + 1);
        return d.toISOString().slice(0, 10); // yyyy-MM-dd
      });

      rawData = currentMonthDays.map((dateStr) => {
        const existing = rawData.find((item) => {
          const d = item.date?.toISOString?.() || item.date;
          return d?.slice(0, 10) === dateStr;
        });

        return {
          date: dateStr,
          total: existing ? Number(existing.total) : 0,
        };
      });
    }

    res.status(200).json({
      code: 200,
      message: `Thống kê doanh thu theo ${type}`,
      data: rawData,
    });
  } catch (err) {
    console.error("❌ Lỗi thống kê doanh thu:", err);
    res.status(500).json({ code: 500, message: "Lỗi server" });
  }
};

module.exports = { getRevenue };
