import React from "react";
import { Link } from "react-router-dom";
import "./Category.css";

const Category = ({ categories }) => {
  return (
    <div className="categories-wrapper">
      <div className="categories-container">
        <h4 className="categories-title">Danh mục sản phẩm</h4>
        <div className="categories-list">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="category-item">
                <Link
                  to={`/category/${encodeURIComponent(category.name)}`}
                  className="category-link"
                >
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
