import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

const Header = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // ✅ Lấy user từ localStorage khi component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = () => {
    navigate("/login");
    setShowDropdown(false);
  };

  const handleRegister = () => {
    navigate("/login");
    setShowDropdown(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    navigate("/"); // chuyển về trang chủ nếu cần
  };

  return (
    <header className="header-wrapper">
      <div className="header-inner">
        {/* Logo + Menu */}
        <div className="header-left">
          <a href="/">
            <img
              src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/fahasa-logo.png"
              alt="Fahasa Logo"
              className="logo"
            />
          </a>
          <div className="menu-icon">
            <i className="fa fa-th"></i>
          </div>
        </div>

        {/* Search */}
        <form className="search-bar" action="/search" method="GET">
          <input
            type="text"
            name="query"
            placeholder="Một Con Người Và Một Dân Tộc"
            required
          />
          <button type="submit">
            <i className="fa fa-search"></i>
          </button>
        </form>

        {/* Right icons */}
        <div className="header-right">
          <div className="icon-with-label">
            <div className="icon-bell">
              <i className="fa fa-bell"></i>
            </div>
            <div className="label">Thông Báo</div>
          </div>
          <div className="icon-with-label">
            <i className="fa fa-shopping-cart"></i>
            <div className="label">Giỏ Hàng</div>
          </div>

          {/* Tài khoản */}
          <div
            className="icon-with-label account-wrapper"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <i className="fa fa-user"></i>
            <div className="label">{user ? user.fullname : "Tài khoản"}</div>

            {showDropdown && (
              <div className="account-dropdown">
                {!user ? (
                  <>
                    <div onClick={handleLogin}>Đăng nhập</div>
                    <div onClick={handleRegister}>Đăng ký</div>
                  </>
                ) : (
                  <div onClick={handleLogout}>Đăng xuất</div>
                )}
              </div>
            )}
          </div>

          <div className="lang-selector">
            🇻🇳 <i className="fa fa-chevron-down"></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
