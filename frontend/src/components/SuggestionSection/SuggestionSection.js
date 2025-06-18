import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "./SuggestionSection.css";
import { Link } from "react-router-dom";
const SuggestionSection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("/api/products/suggested")
      .then((res) => {
        if (res.data.code === 200) {
          setProducts(res.data.data);
        }
      })
      .catch((err) => console.error("Lỗi khi lấy sản phẩm gợi ý:", err));
  }, []);

  const calculatePrice = (original_price, discount) => {
    if (!original_price) return 0;
    return Math.round((original_price * (100 - (discount || 0))) / 100);
  };

  return (
    <div className="suggestion-section">
      <h2 className="suggestion-title">Gợi ý cho bạn</h2>
      <div className="suggestion-grid">
        {products.map((p) => {
          const price =
            p.price && p.price > 0
              ? p.price
              : calculatePrice(p.original_price, p.discount);

          return (
            <Link
              to={`/product/${p.id}`}
              key={p.id}
              className="link-no-underline"
            >
              <div className="suggestion-card">
                <div className="image-wrapper">
                  <img src={p.image_url} alt={p.title} />
                </div>

                <div className="suggestion-info">
                  <div className="suggestion-title-text">{p.title}</div>
                  <div>
                    <span className="suggestion-price">
                      {price.toLocaleString()}₫
                    </span>
                    {p.discount > 0 && (
                      <span className="suggestion-original">
                        {p.original_price.toLocaleString()}₫
                      </span>
                    )}
                  </div>
                  {p.discount > 0 && (
                    <div className="suggestion-discount">-{p.discount}%</div>
                  )}
                  <div className="suggestion-sold">
                    Đã bán {p.DB} | còn lại {p.SL - p.DB}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestionSection;
