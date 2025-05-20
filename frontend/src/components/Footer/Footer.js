import React from "react";
import "./Footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaPinterestP,
} from "react-icons/fa";

const Footer = () => {
  const socialLinks = [
    { icon: <FaFacebookF />, href: "https://www.facebook.com/fahasa/" },
    { icon: <FaInstagram />, href: "" },
    {
      icon: <FaYoutube />,
      href: "https://www.youtube.com/channel/UCUZcVOLSxK1q6RfgzQ9-HYQ",
    },
    { icon: <FaTwitter />, href: "https://fahasa-blog.tumblr.com/" },
    { icon: <FaPinterestP />, href: "https://www.pinterest.com/fahasavn/" },
  ];

  const serviceLinks = [
    {
      title: "DỊCH VỤ",
      links: [
        "Điều khoản sử dụng",
        "Chính sách bảo mật thông tin cá nhân",
        "Chính sách bảo mật thanh toán",
        "Giới thiệu Fahasa",
        "Hệ thống trung tâm - nhà sách",
      ],
    },
    {
      title: "HỖ TRỢ",
      links: [
        "Chính sách đổi - trả - hoàn tiền",
        "Chính sách bảo hành - bồi hoàn",
        "Chính sách vận chuyển",
        "Chính sách khách sỉ",
      ],
    },
    {
      title: "TÀI KHOẢN CỦA TÔI",
      links: [
        "Đăng nhập/Tạo mới tài khoản",
        "Thay đổi địa chỉ khách hàng",
        "Chi tiết tài khoản",
        "Lịch sử mua hàng",
      ],
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left section - Company Info */}
        <div className="left-section">
          <img
            src="https://www.fahasa.com/skin/frontend/ma_vanese/fahasa/images/logo.png"
            alt="Fahasa.com"
            className="logo"
          />
          <p className="address">Lầu 5, 387-389 Hai Bà Trưng, Quận 3, TP HCM</p>
          <p className="company-name">
            Công Ty Cổ Phần Phát Hành Sách TP HCM - FAHASA
          </p>
          <p className="address-detail">
            60 - 62 Lê Lợi, Quận 1, TP. HCM, Việt Nam
          </p>
          <p className="note">
            Fahasa.com nhận đặt hàng trực tuyến và giao hàng tận nơi. <br />
            KHÔNG hỗ trợ đặt mua và nhận hàng trực tiếp tại văn phòng <br />
            cũng như tất cả Hệ Thống Fahasa trên toàn quốc.
          </p>

          <img
            src="https://www.fahasa.com/media/wysiwyg/Logo-NCC/logo-bo-cong-thuong-da-thong-bao.png"
            alt="Bộ Công Thương certification"
            className="cert-img"
          />

          <div className="social-links">
            {socialLinks.map((item, index) => (
              <a key={index} href={item.href} className="social-icon">
                {item.icon}
              </a>
            ))}
          </div>

          <div className="app-links">
            {["android.png", "appstore.png"].map((img, index) => (
              <a key={index} href="#">
                <img
                  src={`https://www.fahasa.com/media/wysiwyg/Logo-NCC/${img}`}
                  alt={img.includes("android") ? "Google Play" : "App Store"}
                  className="app-badge"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Right section - Services & Support */}
        <div className="right-section">
          <div className="service-columns">
            {serviceLinks.map((service, index) => (
              <div key={index} className="service-column">
                <h3 className="column-title">{service.title}</h3>
                <ul className="service-links">
                  {service.links.map((link, i) => (
                    <li key={i}>
                      <a href="#">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* License */}
      <div className="license">
        <p>
          Giấy chứng nhận Đăng ký Kinh doanh số 0304132047 do Sở Kế hoạch và Đầu
          tư TP HCM cấp ngày 20/12/2005, đăng ký thay đổi lần thứ 10, ngày
          20/05/2022.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
