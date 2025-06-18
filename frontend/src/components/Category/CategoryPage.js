import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getUserId } from "../../utils/auth";
import axios from "../../utils/axiosConfig";
import "./CategoryPage.css";
import { Link } from "react-router-dom";
const CategoryPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);

  const handleAddToCart = (product) => {
    const userId = getUserId();
    if (userId === 0) {
      alert("Vui lòng đăng nhập");
      return;
    }
    // Giả sử đang đăng nhập với user_id = 1
    const remainingStock = product.number - product.number2;

    if (remainingStock <= 0) {
      alert("Sản phẩm đã hết hàng");
      return;
    }
    axios
      .post("/api/cart/add", {
        userId: userId,
        productId: product.id,
        quantity: 1,
      })
      .then(() => {
        alert("Đã thêm vào giỏ hàng (backend)");
      })
      .catch((err) => console.error("Lỗi thêm giỏ hàng", err));
  };

  useEffect(() => {
    axios
      .get(`/api/products/category/${id}`)
      .then((res) => {
        if (res.data.code === 200) {
          setProducts(res.data.data);
        }
      })
      .catch((err) => console.error("❌ Lỗi khi lấy sản phẩm:", err));
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
          const remaining = product.SL - product.DB;

          return (
            <div className="product-card" key={product.id}>
              <Link to={`/product/${product.id}`} className="link-no-underline">
                <div className="product-image-wrapper">
                  <img
                    src={product.image}
                    alt={product.title || "Sản phẩm"}
                    className="product-image"
                  />
                </div>

                {/* ✅ Hiển thị tên sản phẩm */}

                <h3 className="product-title">
                  {product.title || "Không có tiêu đề"}
                </h3>

                <div className="product-price-group">
                  <span className="current-price">
                    {Number(product.price).toLocaleString()}₫
                  </span>
                  <span className="old-price">
                    {Number(product.original_price).toLocaleString()}₫
                  </span>
                </div>

                {discount > 0 && (
                  <div className="discount-badge">-{discount}%</div>
                )}

                <div className="sold-info">
                  Đã bán {product.DB} | Còn lại {remaining}
                </div>
              </Link>
              {remaining > 0 ? (
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Thêm giỏ hàng
                </button>
              ) : (
                <span className="out-of-stock">Hết hàng</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPage;
