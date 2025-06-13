import React, { useState, useEffect } from "react";
import "./SectionAdminProducts.css";

export default function SectionAdminProducts() {
  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    discount: "",
    original_price: "",
    SL: "",
    DB: "",
    category_id: "",
  });

  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(true);

  const fetchProducts = async () => {
    try {
      setIsLoadingList(true);
      const response = await fetch("http://localhost:5005/api/products");
      const data = await response.json();
      setProductList(data.data || []);
    } catch (error) {
      alert("❌ Lỗi tải danh sách sản phẩm: " + error.message);
    } finally {
      setIsLoadingList(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?"))
      return;
    try {
      const res = await fetch(
        `http://localhost:5005/api/products/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setProductList(productList.filter((p) => p.id !== productId));
        alert("✅ Xóa sản phẩm thành công");
      } else {
        const err = await res.json();
        alert(`❌ Lỗi xóa: ${err.message || "Server error"}`);
      }
    } catch (error) {
      alert("❌ Lỗi mạng: " + error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.title || !formData.original_price || !formData.category_id) {
      alert("❌ Vui lòng điền tên, giá gốc và danh mục.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5005/api/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          image_url: formData.image_url,
          discount: parseInt(formData.discount) || 0,
          original_price: parseInt(formData.original_price),
          SL: parseInt(formData.SL) || 0,
          DB: parseInt(formData.DB) || 0,
          category_id: parseInt(formData.category_id),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Thêm sản phẩm thành công");
        setProductList([...productList, data.data]);
        setFormData({
          title: "",
          image_url: "",
          discount: "",
          original_price: "",
          SL: "",
          DB: "",
          category_id: "",
        });
      } else {
        alert(`❌ Thêm thất bại: ${data.message}`);
      }
    } catch (error) {
      alert("❌ Lỗi kết nối: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-section">
      <h2>Thêm sản phẩm mới</h2>
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên sản phẩm *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>URL hình ảnh</label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Giảm giá (%)</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            min="0"
            max="100"
          />
        </div>

        <div className="form-group">
          <label>Giá gốc *</label>
          <input
            type="number"
            name="original_price"
            value={formData.original_price}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Số lượng (SL)</label>
          <input
            type="number"
            name="SL"
            value={formData.SL}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Đã bán (DB)</label>
          <input
            type="number"
            name="DB"
            value={formData.DB}
            onChange={handleChange}
            min="0"
          />
        </div>

        {/* ✅ Bọc nhóm danh mục + nút vào hàng ngang */}
        <div className="form-group-inline">
          <div className="form-group">
            <label>ID Danh mục *</label>
            <input
              type="number"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              min="1"
            />
          </div>
          <button
            type="submit"
            className="refresh-btn"
            disabled={isLoading}
            style={{ marginTop: "26px" }}
          >
            {isLoading ? "Đang thêm..." : "Thêm sản phẩm"}
          </button>
        </div>
      </form>

      <div className="table-header">
        <h3>Danh sách sản phẩm ({productList.length})</h3>
        <button
          className="refresh-btn"
          onClick={fetchProducts}
          disabled={isLoadingList}
        >
          {isLoadingList ? "🔄 Đang tải..." : "🔁 Làm mới"}
        </button>
      </div>

      {isLoadingList ? (
        <p>Đang tải...</p>
      ) : productList.length > 0 ? (
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Giá</th>
              <th>Giảm (%)</th>
              <th>Giá gốc</th>
              <th>Danh mục</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {productList.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.title}</td>
                <td>
                  {(
                    p.original_price *
                    (1 - (p.discount || 0) / 100)
                  ).toLocaleString()}{" "}
                  đ
                </td>
                <td>{p.discount}%</td>
                <td>{p.original_price?.toLocaleString()} đ</td>
                <td>{p.category_id}</td>
                <td>
                  <button onClick={() => deleteProduct(p.id)}>🗑️ Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Chưa có sản phẩm nào</p>
      )}
    </div>
  );
}
