import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import { Link, useLocation } from "react-router-dom";
import "./SearchResults.css";

const priceRanges = [
  { id: "1", label: "0đ - 150,000đ", min: 0, max: 150000 },
  { id: "2", label: "150,000đ - 300,000đ", min: 150000, max: 300000 },
  { id: "3", label: "300,000đ - 500,000đ", min: 300000, max: 500000 },
  { id: "4", label: "500,000đ - 700,000đ", min: 500000, max: 700000 },
  { id: "5", label: "700,000đ Trở Lên", min: 700000 },
];

const SearchResults = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);

  useEffect(() => {
    axios.get("/api/categories").then((res) => {
      if (res.data.code === 200) setCategories(res.data.data);
    });
  }, []);

  useEffect(() => {
    if (!query) return;
    axios.get(`/api/products/search?query=${query}`).then((res) => {
      if (res.data.code === 200) setProducts(res.data.data);
    });
  }, [query]);

  const toggleCategory = (id) => {
    const numericId = parseInt(id);
    setSelectedCategories((prev) =>
      prev.includes(numericId)
        ? prev.filter((c) => c !== numericId)
        : [...prev, numericId]
    );
  };

  const togglePrice = (id) => {
    setSelectedPrices((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const calculatePrice = (original_price, discount) => {
    if (!original_price) return 0;
    return Math.round((original_price * (100 - (discount || 0))) / 100);
  };

  const filteredProducts = products.filter((p) => {
    const price = p.price || calculatePrice(p.original_price, p.discount);
    const priceMatch =
      selectedPrices.length === 0 ||
      selectedPrices.some((id) => {
        const range = priceRanges.find((r) => r.id === id);
        return (
          range && price >= range.min && (!range.max || price <= range.max)
        );
      });
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(p.category_id);
    return priceMatch && categoryMatch;
  });

  return (
    <div className="search-results-container">
      <div className="sidebar1">
        <h3>LỌC THEO</h3>
        <div className="filter-group">
          <h4>Danh Mục</h4>
          {categories.map((cat) => (
            <label key={cat.id}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
              />
              {cat.name}
            </label>
          ))}
        </div>

        <div className="filter-group">
          <h4>Giá</h4>
          {priceRanges.map((pr) => (
            <label key={pr.id}>
              <input
                type="checkbox"
                checked={selectedPrices.includes(pr.id)}
                onChange={() => togglePrice(pr.id)}
              />
              {pr.label}
            </label>
          ))}
        </div>
      </div>

      <div className="product-area">
        <h2>KẾT QUẢ TÌM KIẾM: {query}</h2>
        <div className="product-grid">
          {filteredProducts.map((p) => {
            const price =
              p.price > 0
                ? p.price
                : calculatePrice(p.original_price, p.discount);
            return (
              <Link
                to={`/product/${p.id}`}
                key={p.id}
                className="link-no-underline"
              >
                <div className="product-card">
                  <div className="image-wrapper">
                    <img src={p.image || p.image_url} alt={p.title} />
                  </div>
                  <div className="product-info">
                    <div className="product-title">{p.title}</div>
                    <div>
                      <span className="product-price">
                        {price.toLocaleString()}₫
                      </span>
                      {p.discount > 0 && (
                        <span className="product-original">
                          {p.original_price.toLocaleString()}₫
                        </span>
                      )}
                    </div>
                    {p.discount > 0 && (
                      <div className="product-discount">-{p.discount}%</div>
                    )}
                    <div className="product-sold">
                      Đã bán {p.DB || 0} | Còn lại {p.SL - p.DB}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
