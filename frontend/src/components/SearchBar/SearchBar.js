import React from "react";
import "./SearchBar.css";
const Header = () => {
  return (
    <header className="header">
      {/* Logo */}
      <div className="logo">
        <a href="file:///C:/Users/ASUS/Documents/Project_Web/UserInterface/TrangChu.html">
          <img
            src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/fahasa-logo.png"
            alt="Fahasa Logo"
            className="logo-img"
          />
        </a>
      </div>

      {/* Thanh tìm kiếm */}
      <form className="search-bar" action="search.html" method="GET">
        <input
          type="text"
          name="query"
          placeholder="Tìm kiếm sản phẩm..."
          required
        />
        <button type="submit">🔍</button>
      </form>

      {/* Menu điều hướng */}
      <nav>
        <ul>
          <li>
            <a href="file:///C:/Users/ASUS/Documents/JAVA/QuanLyNhaTro/GD_TrangChu.html">
              Trang chủ
            </a>
          </li>
          <li>
            <a href="#">Giỏ hàng</a>
          </li>
          <li>
            <a href="#">Liên hệ</a>
          </li>
          <li>
            <a href="Login.html">Tài khoản</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
