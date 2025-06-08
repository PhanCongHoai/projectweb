import axios from 'axios';

const BASE_URL = 'http://localhost:5005/api/forgot-password';

// Gửi yêu cầu reset password - chỉ cần email
export const sendResetRequest = async (data) => {
    try {
        const response = await axios.post(`${BASE_URL}/send-reset-request`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Xác thực OTP (cho trường hợp SMS)
export const verifyOTP = async (data) => {
    try {
        const response = await axios.post(`${BASE_URL}/verify-otp`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Đặt lại mật khẩu
export const resetPassword = async (data) => {
    try {
        const response = await axios.post(`${BASE_URL}/reset-password`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Kiểm tra token reset
export const validateResetToken = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}/validate-token/${token}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};