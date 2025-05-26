import React, { useState } from "react";
import "./LoginRegister.css";
import { registerService, loginService } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  // Login
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Register
  const [regFullname, setRegFullname] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState("");

  const handleLogin = async () => {
    setLoginError("");
    if (!loginPhone || !loginPassword) {
      setLoginError("Vui lòng nhập số điện thoại và mật khẩu!");
      return;
    }

    try {
      const res = await loginService({
        phone_number: loginPhone,
        password: loginPassword,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Đăng nhập thành công!");

      // ✅ Điều hướng theo vai trò
      if (res.data.user.role_id === 1) {
        navigate("/admin"); // Admin
      } else {
        navigate("/"); // Người dùng
      }
      window.location.reload();
    } catch (err) {
      setLoginError(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  const handleRegister = async () => {
    setRegisterError("");
    if (
      !regFullname ||
      !regEmail ||
      !regPhone ||
      !regAddress ||
      !regPassword ||
      !regConfirmPassword
    ) {
      setRegisterError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegisterError("Mật khẩu và xác nhận không khớp!");
      return;
    }

    try {
      await registerService({
        fullname: regFullname,
        email: regEmail,
        phone_number: regPhone,
        address: regAddress,
        password: regPassword,
        role_id: 0, // ✅ Mặc định là người dùng thường
      });

      alert("Đăng ký thành công!");
      setRegFullname("");
      setRegEmail("");
      setRegPhone("");
      setRegAddress("");
      setRegPassword("");
      setRegConfirmPassword("");
      setActiveTab("login");
    } catch (err) {
      setRegisterError(err.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="tab-menu">
        <button
          className={activeTab === "login" ? "active" : ""}
          onClick={() => setActiveTab("login")}
        >
          Đăng nhập
        </button>
        <button
          className={activeTab === "register" ? "active" : ""}
          onClick={() => setActiveTab("register")}
        >
          Đăng ký
        </button>
      </div>

      {/* Đăng nhập */}
      {activeTab === "login" && (
        <form
          className="login-container"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <label>Số điện thoại</label>
          <input
            type="text"
            placeholder="Nhập số điện thoại"
            value={loginPhone}
            onChange={(e) => setLoginPhone(e.target.value)}
          />
          <label>Mật khẩu</label>
          <div className="password-wrapper">
            <input
              type={showLoginPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <span onClick={() => setShowLoginPassword(!showLoginPassword)}>
              {showLoginPassword ? "Ẩn" : "Hiện"}
            </span>
          </div>
          {loginError && <p className="error-text">{loginError}</p>}
          <button type="submit" className="login-btn">
            Đăng nhập
          </button>
        </form>
      )}

      {/* Đăng ký */}
      {activeTab === "register" && (
        <form
          className="login-container"
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <label>Họ và tên</label>
          <input
            type="text"
            placeholder="Nhập họ tên"
            value={regFullname}
            onChange={(e) => setRegFullname(e.target.value)}
          />
          <label>Email</label>
          <input
            type="email"
            placeholder="Nhập email"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
          />
          <label>Số điện thoại</label>
          <input
            type="text"
            placeholder="Nhập số điện thoại"
            value={regPhone}
            onChange={(e) => setRegPhone(e.target.value)}
          />
          <label>Địa chỉ</label>
          <input
            type="text"
            placeholder="Nhập địa chỉ"
            value={regAddress}
            onChange={(e) => setRegAddress(e.target.value)}
          />
          <label>Mật khẩu</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
          />
          <label>Xác nhận mật khẩu</label>
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={regConfirmPassword}
            onChange={(e) => setRegConfirmPassword(e.target.value)}
          />
          {registerError && <p className="error-text">{registerError}</p>}
          <button
            type="submit"
            className="login-btn"
            disabled={
              !regFullname ||
              !regEmail ||
              !regPhone ||
              !regAddress ||
              !regPassword ||
              !regConfirmPassword ||
              regPassword !== regConfirmPassword
            }
          >
            Đăng ký
          </button>
        </form>
      )}
    </div>
  );
}
