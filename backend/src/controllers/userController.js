const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ code: 200, data: users });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách user:", error);
    res.status(500).json({ code: 500, message: "Lỗi server" });
  }
};
