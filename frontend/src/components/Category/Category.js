import React from "react";
import { Link } from "react-router-dom";
import "./Category.css";

const Category = ({ categories }) => {
  return (
    <div className="section-container">
      <div className="categories-container">
        <h4 className="categories-title">
          <i
            className="fa-solid fa-border-all"
            style={{ color: "#c92127", marginRight: 8 }}
          ></i>
          Danh mục sản phẩm
        </h4>

        <div className="categories-list-grid">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="category-item">
                <Link to={`/category/${category.id}`} className="category-link">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="category-image"
                  />
                </Link>
                <p className="category-name">{category.name}</p>
              </div>
            ))
          ) : (
            <p>Không có danh mục nào để hiển thị.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
