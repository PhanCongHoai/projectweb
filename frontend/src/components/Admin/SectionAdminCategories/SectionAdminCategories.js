import React, { useEffect, useState } from "react";
import axios from "../../../utils/axiosConfig";
import "./SectionAdminCategories.css";

const SectionAdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [formError, setFormError] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/categories");
      if (res.data.code === 200) {
        setCategories(res.data.data);
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim() || !url.trim()) {
      setFormError("Vui lòng điền đầy đủ tên danh mục và URL");
      return;
    }
    try {
      const res = await axios.post("/api/categories", { name, url });
      if (res.data.code === 201) {
        setName("");
        setUrl("");
        await fetchCategories();
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || err.message);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await axios.delete(`/api/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Xóa thất bại");
    }
  };

  if (loading)
    return <div className="cat-table-wrapper">Đang tải danh mục…</div>;
  if (error) return <div className="cat-table-wrapper error">{error}</div>;

  return (
    <div className="cat-table-wrapper">
      <h2>Quản lý Danh mục</h2>

      {/* Form thêm danh mục */}
      <form className="cat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên danh mục"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL ảnh"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Thêm</button>
      </form>
      {formError && <p className="form-error">{formError}</p>}

      {/* Bảng danh mục */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>URL</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="4">Không có dữ liệu</td>
            </tr>
          ) : (
            categories.map((cate) => (
              <tr key={cate.id}>
                <td>{cate.id}</td>
                <td>{cate.name}</td>
                <td>
                  <a href={cate.url} target="_blank" rel="noopener noreferrer">
                    {cate.url}
                  </a>
                </td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(cate.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SectionAdminCategories;
