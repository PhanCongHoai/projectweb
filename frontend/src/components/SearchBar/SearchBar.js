import React from "react";
import "./SearchBar.css"; // Đổi tên từ SearchBar.css cho đúng chức năng

const Header = () => {
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

        {/* Icon + Language */}
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
          <div className="icon-with-label">
            <i className="fa fa-user"></i>
            <div className="label">Tài khoản</div>
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
