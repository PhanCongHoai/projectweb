const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { User } = require('../models/User'); // Adjust path theo cấu trúc project của bạn

// Cấu hình nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Store reset tokens tạm thời (production nên dùng Redis hoặc database)
const resetTokens = new Map();

// Gửi yêu cầu reset password
const sendResetRequest = async (req, res) => {
    try {
        const { phone_number, email, method } = req.body;

        // Tìm user trong database
        let user;
        if (method === 'email' || !method) {
            // Chỉ tìm theo email
            user = await User.findOne({
                where: { email: email }
            });
        } else {
            // Tìm theo cả phone và email
            user = await User.findOne({
                where: {
                    phone_number: phone_number,
                    email: email
                }
            });
        }

        if (!user) {
            return res.status(404).json({
                message: 'Không tìm thấy tài khoản với thông tin này!'
            });
        }

        if (method === 'sms') {
            // Logic cho SMS OTP - tạm thời return success
            return res.json({
                message: 'Mã OTP đã được gửi đến số điện thoại của bạn!',
                method: 'sms'
            });
        } else {
            // Gửi email reset
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

            // Lưu token tạm thời (5 phút)
            resetTokens.set(resetToken, {
                userId: user.id,
                email: user.email,
                expires: Date.now() + 5 * 60 * 1000 // 5 phút
            });

            // Template email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Đặt lại mật khẩu - Profect Web',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #e53935;">Đặt lại mật khẩu</h2>
                        <p>Xin chào <strong>${user.fullname}</strong>,</p>
                        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
                        <p>Vui lòng click vào liên kết bên dưới để đặt lại mật khẩu:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetLink}" 
                               style="background-color: #e53935; color: white; padding: 12px 30px; 
                                      text-decoration: none; border-radius: 5px; display: inline-block;">
                                Đặt lại mật khẩu
                            </a>
                        </div>
                        <p style="color: #666; font-size: 14px;">
                            <strong>Lưu ý:</strong> Liên kết này chỉ có hiệu lực trong 5 phút.
                        </p>
                        <p style="color: #666; font-size: 14px;">
                            Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                        </p>
                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            Email này được gửi từ hệ thống Profect Web
                        </p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);

            return res.json({
                message: 'Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư.',
                method: 'email',
                emailSent: user.email
            });
        }

    } catch (error) {
        console.error('Lỗi gửi email reset:', error);
        return res.status(500).json({
            message: 'Có lỗi xảy ra khi gửi email. Vui lòng thử lại!'
        });
    }
};

// Xác thực token reset
const validateResetToken = async (req, res) => {
    try {
        const { token } = req.params;

        const tokenData = resetTokens.get(token);

        if (!tokenData) {
            return res.status(400).json({
                message: 'Liên kết không hợp lệ hoặc đã hết hạn!'
            });
        }

        if (Date.now() > tokenData.expires) {
            resetTokens.delete(token);
            return res.status(400).json({
                message: 'Liên kết đã hết hạn! Vui lòng yêu cầu đặt lại mật khẩu mới.'
            });
        }

        return res.json({
            message: 'Token hợp lệ',
            email: tokenData.email
        });

    } catch (error) {
        console.error('Lỗi validate token:', error);
        return res.status(500).json({
            message: 'Có lỗi xảy ra!'
        });
    }
};

// Đặt lại mật khẩu
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: 'Mật khẩu xác nhận không khớp!'
            });
        }

        const tokenData = resetTokens.get(token);

        if (!tokenData) {
            return res.status(400).json({
                message: 'Liên kết không hợp lệ hoặc đã hết hạn!'
            });
        }

        if (Date.now() > tokenData.expires) {
            resetTokens.delete(token);
            return res.status(400).json({
                message: 'Liên kết đã hết hạn!'
            });
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu trong database
        await User.update(
            { password: hashedPassword },
            { where: { id: tokenData.userId } }
        );

        // Xóa token đã sử dụng
        resetTokens.delete(token);

        return res.json({
            message: 'Đặt lại mật khẩu thành công!'
        });

    } catch (error) {
        console.error('Lỗi reset password:', error);
        return res.status(500).json({
            message: 'Có lỗi xảy ra khi đặt lại mật khẩu!'
        });
    }
};

// Xác thực OTP (cho SMS)
const verifyOTP = async (req, res) => {
    try {
        const { phone_number, otp } = req.body;

        // Logic xác thực OTP - tạm thời return success
        // Trong thực tế, bạn cần tích hợp với SMS provider

        if (otp === '123456') { // Mock OTP
            const resetToken = crypto.randomBytes(32).toString('hex');

            // Tìm user theo phone
            const user = await User.findOne({
                where: { phone_number: phone_number }
            });

            if (user) {
                resetTokens.set(resetToken, {
                    userId: user.id,
                    phone: user.phone_number,
                    expires: Date.now() + 5 * 60 * 1000
                });

                return res.json({
                    message: 'Xác thực OTP thành công!',
                    resetToken: resetToken
                });
            }
        }

        return res.status(400).json({
            message: 'Mã OTP không chính xác!'
        });

    } catch (error) {
        console.error('Lỗi verify OTP:', error);
        return res.status(500).json({
            message: 'Có lỗi xảy ra!'
        });
    }
};

module.exports = {
    sendResetRequest,
    validateResetToken,
    resetPassword,
    verifyOTP
};