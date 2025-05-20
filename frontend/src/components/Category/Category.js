import React from "react";
import { Link } from "react-router-dom";
import "./Category";

const DMSP = () => {
  const categories = [
    { name: "Đồ Chơi Lắp Ráp", image: "/img/do-choi-lap-rap.png" },
    { name: "Đồ Chơi Mô Hình", image: "/img/do-choi-mo-hinh.png" },
    { name: "Đèn Chống Cận", image: "/img/den-chong-can.png" },
    { name: "Đam Mỹ", image: "/img/dam-my.jpg" },
    { name: "Kinh Tế", image: "/img/kinh-te.jpg" },
    { name: "Văn Học", image: "/img/van-hoc.jpg" },
    { name: "Tâm Lý", image: "/img/tam-ly-ky-nang.jpg" },
    { name: "Thiếu Nhi", image: "/img/thieu-nhi.png" },
    { name: "Sách Học Ngoại Ngữ", image: "/img/sach-hoc-ngoai-ngu.jpg" },
    { name: "Ngoại Văn", image: "/img/ngoai-van.jpg" },
  ];

  return (
    <div className="categories-container">
      <h4 className="categories-title">DANH MỤC SẢN PHẨM</h4>
      <div className="categories-list">
        {categories.map((category, index) => (
          <Link
            key={index}
            to={`/category/${encodeURIComponent(category.name)}`}
            className="category-link"
          >
            <div className="category-item">
              <img
                src={category.image}
                alt={category.name}
                className="category-image"
              />
              <p className="category-name">{category.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DMSP;
