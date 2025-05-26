import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "./CategoryPage.css";

const CategoryPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/products/category/${id}`)
      .then((res) => {
        if (res.data.code === 200) {
          setProducts(res.data.data);
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <div className="category-page-wrapper">
      <h2 className="section-title">Sản phẩm thuộc danh mục</h2>
      <div className="product-grid">
        {products.map((product) => {
          const discount = Math.round(
            ((product.original_price - product.price) /
              product.original_price) *
              100
          );

          return (
            <div key={product.id} className="product-card">
              <img
                src={product.image_url}
                alt={product.title}
                className="product-image"
              />
              <h3 className="product-title">{product.title}</h3>

              <div className="product-price">
                <span className="current-price">
                  {Number(product.price).toLocaleString()}₫
                </span>
                {discount > 0 && (
                  <span className="discount-badge">-{discount}%</span>
                )}
              </div>

              <div className="old-price">
                {Number(product.original_price).toLocaleString()}₫
              </div>

              <div className="sold-info">Đã bán {product.number2}</div>

              <button className="add-to-cart-btn">Thêm giỏ hàng</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPage;
