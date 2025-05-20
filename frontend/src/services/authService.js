import api from "../utils/axiosConfig";

// Đăng ký tài khoản
export const registerService = (data) => api.post("/auth/register", data);

// Đăng nhập tài khoản
export const loginService = (data) => api.post("/auth/login", data);
