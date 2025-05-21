const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Đăng ký tài khoản (mặc định là admin: role_id = 1)
exports.register = async (req, res) => {
  console.log("🔥 Đã nhận request đăng ký:", req.body);
  const { fullname, email, phone_number, address, password, role_id } =
    req.body;

  try {
    const existEmail = await User.findOne({ where: { email } });
    if (existEmail)
      return res.status(400).json({ message: "Email đã được sử dụng" });

    const existPhone = await User.findOne({ where: { phone_number } });
    if (existPhone)
      return res.status(400).json({ message: "Số điện thoại đã được sử dụng" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      phone_number,
      address,
      password: hashed,
      role_id: Number(role_id) === 1 ? 1 : 0,
      created_at: new Date(),
      update_at: new Date(),
    });

    res.json({ message: "Đăng ký thành công", data: newUser });
  } catch (error) {
    console.error("Đăng ký lỗi:", error);
    res.status(500).json({ message: "Đăng ký thất bại", error: error.message });
  }
};

// Đăng nhập bằng SĐT + mật khẩu
exports.login = async (req, res) => {
  const { phone_number, password } = req.body;

  if (!phone_number || !password) {
    return res
      .status(400)
      .json({ message: "Vui lòng nhập số điện thoại và mật khẩu" });
  }

  try {
    const user = await User.findOne({ where: { phone_number } });

    if (!user) {
      return res.status(400).json({ message: "Số điện thoại không tồn tại" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Mật khẩu không đúng" });
    }

    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    const { password: _, ...userWithoutPassword } = user.dataValues;

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("🔥 Đăng nhập lỗi:", error);
    res
      .status(500)
      .json({ message: "Đăng nhập thất bại", error: error.message });
  }
};
