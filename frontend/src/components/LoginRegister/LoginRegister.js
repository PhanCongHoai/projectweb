import React, { useState } from "react";
import "./LoginRegister.css";
import { registerService, loginService } from "../../services/authService";
import { sendResetRequest, verifyOTP } from "../../services/forgotPasswordService";
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

  // Forgot Password
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [resetMethod, setResetMethod] = useState("email");
  const [showOTPStep, setShowOTPStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [showResetStep, setShowResetStep] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

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

      if (res.data.user.role_id === 1) {
        navigate("/admin");
      } else {
        navigate("/");
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
        role_id: 0,
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

  const handleForgotPassword = async () => {
    setForgotError("");
    setForgotSuccess("");

    if (!forgotPhone || !forgotEmail) {
      setForgotError("Vui lòng nhập số điện thoại và email!");
      return;
    }

    try {
      const response = await sendResetRequest({
        phone_number: forgotPhone,
        email: forgotEmail,
        method: resetMethod
      });

      setForgotSuccess(response.message);

      if (resetMethod === "sms") {
        setTimeout(() => {
          setShowOTPStep(true);
          setForgotSuccess("");
        }, 2000);
      } else {
        setTimeout(() => {
          closeForgotModal();
        }, 3000);
      }

    } catch (err) {
      setForgotError(err.response?.data?.message || "Không thể khôi phục mật khẩu");
    }
  };

  const handleVerifyOTP = async () => {
    setForgotError("");

    if (!otpCode) {
      setForgotError("Vui lòng nhập mã OTP!");
      return;
    }

    try {
      const response = await verifyOTP({
        phone_number: forgotPhone,
        otp: otpCode
      });

      setResetToken(response.resetToken);
      setForgotSuccess("Xác thực thành công!");

      setTimeout(() => {
        setShowOTPStep(false);
        setShowResetStep(true);
        setForgotSuccess("");
      }, 1500);

    } catch (err) {
      setForgotError(err.response?.data?.message || "Mã OTP không chính xác");
    }
  };

  const handleResetPassword = async () => {
    setForgotError("");

    if (!newPassword || !confirmNewPassword) {
      setForgotError("Vui lòng nhập đầy đủ mật khẩu!");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setForgotError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const { resetPassword } = await import("../../services/forgotPasswordService");
      const response = await resetPassword({
        token: resetToken,
        newPassword: newPassword,
        confirmPassword: confirmNewPassword
      });

      setForgotSuccess(response.message);

      setTimeout(() => {
        closeForgotModal();
        alert("Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");
      }, 2000);

    } catch (err) {
      setForgotError(err.response?.data?.message || "Không thể đặt lại mật khẩu");
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotPhone("");
    setForgotEmail("");
    setForgotError("");
    setForgotSuccess("");
    setShowOTPStep(false);
    setShowResetStep(false);
    setOtpCode("");
    setResetToken("");
    setNewPassword("");
    setConfirmNewPassword("");
    setResetMethod("email");
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

          <div className="forgot-password-link">
            <button
              type="button"
              className="forgot-btn"
              onClick={() => setShowForgotModal(true)}
            >
              Quên mật khẩu?
            </button>
          </div>
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

      {/* Modal Quên mật khẩu */}
      {showForgotModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                {showResetStep ? "Đặt lại mật khẩu" :
                  showOTPStep ? "Xác thực OTP" : "Quên mật khẩu"}
              </h3>
              <button className="close-btn" onClick={closeForgotModal}>
                ×
              </button>
            </div>

            {/* Bước 1: Nhập thông tin và chọn phương thức */}
            {!showOTPStep && !showResetStep && (
              <form
                className="forgot-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleForgotPassword();
                }}
              >
                <label>Số điện thoại</label>
                <input
                  type="text"
                  placeholder="Nhập số điện thoại đã đăng ký"
                  value={forgotPhone}
                  onChange={(e) => setForgotPhone(e.target.value)}
                />
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Nhập email đã đăng ký"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />

                <label>Phương thức khôi phục</label>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: 0 }}>
                    <input
                      type="radio"
                      value="email"
                      checked={resetMethod === "email"}
                      onChange={(e) => setResetMethod(e.target.value)}
                    />
                    Gửi email
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: 0 }}>
                    <input
                      type="radio"
                      value="sms"
                      checked={resetMethod === "sms"}
                      onChange={(e) => setResetMethod(e.target.value)}
                    />
                    Gửi SMS
                  </label>
                </div>

                {forgotError && <p className="error-text">{forgotError}</p>}
                {forgotSuccess && <p className="success-text">{forgotSuccess}</p>}

                <div className="modal-buttons">
                  <button type="submit" className="submit-btn">
                    Gửi yêu cầu
                  </button>
                  <button type="button" className="cancel-btn" onClick={closeForgotModal}>
                    Hủy
                  </button>
                </div>
              </form>
            )}

            {/* Bước 2: Nhập OTP (chỉ cho SMS) */}
            {showOTPStep && !showResetStep && (
              <form
                className="forgot-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVerifyOTP();
                }}
              >
                <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
                  Mã OTP đã được gửi đến số điện thoại của bạn
                </p>

                <label>Mã OTP</label>
                <input
                  type="text"
                  placeholder="Nhập mã OTP (6 số)"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  maxLength="6"
                />

                {forgotError && <p className="error-text">{forgotError}</p>}
                {forgotSuccess && <p className="success-text">{forgotSuccess}</p>}

                <div className="modal-buttons">
                  <button type="submit" className="submit-btn">
                    Xác thực
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowOTPStep(false);
                      setOtpCode("");
                      setForgotError("");
                    }}
                  >
                    Quay lại
                  </button>
                </div>
              </form>
            )}

            {/* Bước 3: Đặt mật khẩu mới */}
            {showResetStep && (
              <form
                className="forgot-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleResetPassword();
                }}
              >
                <label>Mật khẩu mới</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <label>Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />

                {forgotError && <p className="error-text">{forgotError}</p>}
                {forgotSuccess && <p className="success-text">{forgotSuccess}</p>}

                <div className="modal-buttons">
                  <button type="submit" className="submit-btn">
                    Đặt lại mật khẩu
                  </button>
                  <button type="button" className="cancel-btn" onClick={closeForgotModal}>
                    Hủy
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}