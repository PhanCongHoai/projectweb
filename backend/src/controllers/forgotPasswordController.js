const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// ✅ Import đúng model
const { User } = require("../models");

// ✅ Cấu hình nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const resetTokens = new Map();

// ✅ Gửi yêu cầu khôi phục mật khẩu
const sendResetRequest = async (req, res) => {
  try {
    const { phone_number, email, method } = req.body;
    console.log("[RESET] Yêu cầu:", { phone_number, email, method });

    if (!email) {
      return res.status(400).json({ message: "Vui lòng nhập email." });
    }

    let user;
    if (method === "sms") {
      if (!phone_number) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập số điện thoại." });
      }
      user = await User.findOne({ where: { email, phone_number } });
    } else {
      user = await User.findOne({ where: { email } });
    }

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản!" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    resetTokens.set(resetToken, {
      userId: user.id,
      email: user.email,
      phone: user.phone_number,
      expires: Date.now() + 5 * 60 * 1000,
    });

    if (method === "sms") {
      console.log("[RESET] Gửi OTP mock:", user.phone_number);
      return res.json({
        message: "Đã gửi mã OTP (mock)",
        method: "sms",
        otp: "123456",
      });
    }

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: `"Profect Web" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Khôi phục mật khẩu - Profect Web",
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: auto;">
          <h2 style="color: #e53935;">Khôi phục mật khẩu</h2>
          <p>Xin chào <strong>${user.fullname || "bạn"}</strong>,</p>
          <p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
          <a href="${resetLink}" style="display:inline-block; background:#e53935; color:white; padding:10px 20px; border-radius:5px; text-decoration:none;">Đặt lại mật khẩu</a>
          <p style="margin-top:20px; color:#666;">Liên kết này chỉ có hiệu lực trong 5 phút.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("[RESET] Email đã gửi đến:", user.email);

    return res.json({
      message: "Email đặt lại mật khẩu đã được gửi!",
      method: "email",
    });
  } catch (err) {
    console.error("[RESET] Lỗi gửi yêu cầu:", err);
    return res.status(500).json({ message: "Lỗi server khi gửi yêu cầu!" });
  }
};

// ✅ Kiểm tra token hợp lệ
const validateResetToken = (req, res) => {
  const { token } = req.params;
  const tokenData = resetTokens.get(token);
  if (!tokenData || Date.now() > tokenData.expires) {
    return res
      .status(400)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
  return res.json({ message: "Token hợp lệ", email: tokenData.email });
};

// ✅ Đặt lại mật khẩu
const resetPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;
  const tokenData = resetTokens.get(token);

  if (!tokenData || Date.now() > tokenData.expires) {
    return res.status(400).json({ message: "Liên kết đã hết hạn!" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Mật khẩu xác nhận không khớp!" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await User.update({ password: hashed }, { where: { id: tokenData.userId } });
  resetTokens.delete(token);

  return res.json({ message: "Mật khẩu đã được cập nhật!" });
};

// ✅ Xác thực mã OTP (mock)
const verifyOTP = async (req, res) => {
  const { phone_number, otp } = req.body;
  if (otp !== "123456") {
    return res.status(400).json({ message: "Mã OTP không đúng!" });
  }

  const user = await User.findOne({ where: { phone_number } });
  if (!user) {
    return res.status(404).json({ message: "Không tìm thấy tài khoản!" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  resetTokens.set(resetToken, {
    userId: user.id,
    phone: user.phone_number,
    expires: Date.now() + 5 * 60 * 1000,
  });

  return res.json({
    message: "OTP xác thực thành công!",
    resetToken,
  });
};

module.exports = {
  sendResetRequest,
  validateResetToken,
  resetPassword,
  verifyOTP,
};
