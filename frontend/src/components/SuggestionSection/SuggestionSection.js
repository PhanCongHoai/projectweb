import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import "./SuggestionSection.css";

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

  return (
    <div className="suggestion-section">
      <h2 className="suggestion-title">Gợi ý cho bạn</h2>
      <div className="suggestion-grid">
        {products.map((p) => (
          <div key={p.id} className="suggestion-card">
            {/* ✅ Thêm lớp bọc ảnh */}
            <div className="image-wrapper">
              <img src={p.image_url} alt={p.title} />
            </div>

            <div className="suggestion-info">
              <div className="suggestion-title-text">{p.title}</div>
              <div>
                <span className="suggestion-price">
                  {p.price.toLocaleString()}₫
                </span>
                <span className="suggestion-original">
                  {p.original_price.toLocaleString()}₫
                </span>
              </div>
              <div className="suggestion-discount">-{p.discount}%</div>
              <div className="suggestion-sold">Đã bán {p.number2}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionSection;
