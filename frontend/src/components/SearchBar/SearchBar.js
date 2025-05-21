import React from "react";
import "./SearchBar.css"; // Hoặc Header.css nếu bạn đổi tên

const Header = () => {
  return (
    <header className="header">
      {/* Logo + Menu Dropdown */}
      <div className="header-left">
        <a href="/">
          <img
            src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/fahasa-logo.png"
            alt="Fahasa Logo"
            className="logo-img"
          />
        </a>
        <div className="menu-icon">
          <i className="fa fa-th"></i>
        </div>
      </div>

      {/* Search Bar */}
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

      {/* Right Side Icons */}
      <div className="header-right">
        <div className="icon-group">
          <button type="button" className="icon notification">
            <i className="fa fa-bell"></i>
            <div>Thông Báo</div>
          </button>
          <button type="button" className="icon">
            <i className="fa fa-shopping-cart"></i>
            <div>Giỏ Hàng</div>
          </button>
          <button type="button" className="icon">
            <i className="fa fa-user"></i>
            <div>Tài Khoản</div>
          </button>
        </div>

        <div className="lang">
          <button className="lang-btn" type="button">
            🇻🇳
            <i className="fa fa-chevron-down"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
