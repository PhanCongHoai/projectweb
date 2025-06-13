const User = require("../models/user");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({
      code: 200,
      message: "Lấy danh sách user thành công",
      data: users,
    });
  } catch (error) {
    console.error("Lỗi lấy user:", error);
    res.status(500).json({ code: 500, message: "Lỗi server" });
  }
};
