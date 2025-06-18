// frontend/src/components/Header.jsx

import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/axiosConfig";
import "./SearchBar.css";

const Header = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  // 1️⃣ Load user từ localStorage khi mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // 2️⃣ Các handler tài khoản
  const handleLogin = useCallback(() => {
    navigate("/login");
    setShowDropdown(false);
  }, [navigate]);

  const handleRegister = useCallback(() => {
    navigate("/login");
    setShowDropdown(false);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.setItem("userId", 0);
    setUser(null);
    setShowDropdown(false);
    navigate("/");
  }, [navigate]);

  // 3️⃣ Xử lý tìm kiếm với cache-buster
  const handleSearchSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const q = searchText.trim();
      if (!q) return;

      const timestamp = Date.now();

      try {
        // Gọi API search, thêm cache-buster param _
        const res = await api.get("/api/products/search", {
          params: { query: q, _: timestamp },
        });
        const results = res.data.data;

        // Chuyển sang trang /search?q=…&_TS to bust cache
        navigate(`/search?q=${encodeURIComponent(q)}&_=${timestamp}`, {
          state: { results },
        });
      } catch (err) {
        console.error("❌ Lỗi khi tìm kiếm:", err);
      }
    },
    [searchText, navigate]
  );

  return (
    <header className="header-wrapper">
      <div className="header-inner">
        {/* Logo + Menu */}
        <div className="header-left">
          <Link to="/" className="logo-link">
            <img
              src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/fahasa-logo.png"
              alt="Fahasa Logo"
              className="logo"
            />
          </Link>
        </div>

        {/* Search */}
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            name="query"
            placeholder="Tìm kiếm sản phẩm bạn muốn..."
            aria-label="Tìm kiếm sản phẩm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button type="submit" aria-label="Tìm kiếm">
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>
        </form>

        {/* Right icons */}
        <div className="header-right">
          <div className="icon-with-label">
            <Link to="/orders" className="icon-with-label link-no-underline">
              <div className="icon-bell">
                <i className="fa fa-history"></i>
              </div>
              <div className="label">Đơn đã mua</div>
            </Link>
          </div>

          <div className="icon-with-label">
            <i className="fa fa-shopping-cart" aria-hidden="true"></i>
            <Link to="/cart" className="cart-link link-no-underline">
              <div className="label">Giỏ Hàng</div>
            </Link>
          </div>

          {/* Tài khoản */}
          <div
            className="icon-with-label account-wrapper"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <i className="fa fa-user" aria-hidden="true"></i>
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

          <div className="lang-selector" aria-label="Chọn ngôn ngữ">
            🇻🇳 <i className="" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
