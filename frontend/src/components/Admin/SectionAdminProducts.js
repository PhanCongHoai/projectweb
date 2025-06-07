import React, { useState } from 'react';
import './SectionAdminProducts.css';

export default function SectionAdminProducts() {
    const [formData, setFormData] = useState({
        title: '',
        product_url: '',
        image_url: '',
        price: '',
        discount: '',
        original_price: '',
        number: '',
        number2: '',
        category_id: '',
    });

    const [productList, setProductList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // ✅ Validation phía frontend
        if (!formData.title || !formData.original_price || !formData.category_id) {
            alert("❌ Vui lòng điền đầy đủ: Tên sản phẩm, Giá gốc, và Danh mục");
            setIsLoading(false);
            return;
        }

        try {
            console.log("📤 Gửi dữ liệu:", formData);

            const response = await fetch("http://localhost:5005/api/products/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formData.title,
                    product_url: formData.product_url,
                    image_url: formData.image_url,
                    price: formData.price ? parseInt(formData.price) : 0,
                    discount: formData.discount ? parseInt(formData.discount) : 0,
                    original_price: parseInt(formData.original_price),
                    number: formData.number ? parseInt(formData.number) : 0,
                    number2: formData.number2 ? parseInt(formData.number2) : 0,
                    category_id: parseInt(formData.category_id),
                }),
            });

            console.log("📥 Response status:", response.status);
            const data = await response.json();
            console.log("📥 Response data:", data);

            if (response.ok) {
                alert("✅ Thêm sản phẩm thành công!");

                // ✅ Fix: Thêm sản phẩm mới vào danh sách với dữ liệu từ server
                setProductList([...productList, data.data]);

                // ✅ Reset form
                setFormData({
                    title: '',
                    product_url: '',
                    image_url: '',
                    price: '',
                    discount: '',
                    original_price: '',
                    number: '',
                    number2: '',
                    category_id: '',
                });
            } else {
                console.error("❌ Server error:", data);
                alert(`❌ Thêm sản phẩm thất bại: ${data.message}`);
                if (data.errors) {
                    console.error("Validation errors:", data.errors);
                }
            }
        } catch (error) {
            console.error("❌ Network error:", error);
            alert(`❌ Lỗi kết nối tới server: ${error.message}`);
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
                        placeholder="Nhập tên sản phẩm"
                    />
                </div>

                <div className="form-group">
                    <label>URL sản phẩm</label>
                    <input
                        type="url"
                        name="product_url"
                        value={formData.product_url}
                        onChange={handleChange}
                        placeholder="https://example.com/product"
                    />
                </div>

                <div className="form-group">
                    <label>URL hình ảnh</label>
                    <input
                        type="url"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div className="form-group">
                    <label>Giá hiện tại</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        placeholder="Để trống sẽ tự tính"
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
                        placeholder="0-100"
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
                        placeholder="Nhập giá gốc"
                    />
                </div>

                <div className="form-group">
                    <label>Số lượng 1</label>
                    <input
                        type="number"
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        min="0"
                        placeholder="0"
                    />
                </div>

                <div className="form-group">
                    <label>Số lượng 2</label>
                    <input
                        type="number"
                        name="number2"
                        value={formData.number2}
                        onChange={handleChange}
                        min="0"
                        placeholder="0"
                    />
                </div>

                <div className="form-group">
                    <label>ID Danh mục *</label>
                    <input
                        type="number"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        required
                        min="1"
                        placeholder="Nhập ID danh mục"
                    />
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Đang thêm..." : "Thêm sản phẩm"}
                </button>
            </form>

            <h3>Danh sách sản phẩm đã thêm ({productList.length})</h3>
            {productList.length > 0 ? (
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá hiện tại</th>
                            <th>Giảm giá (%)</th>
                            <th>Giá gốc</th>
                            <th>Danh mục</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productList.map((product, index) => (
                            <tr key={product.id || index}>
                                <td>{product.id || 'N/A'}</td>
                                <td>{product.title}</td>
                                <td>{product.price?.toLocaleString()} đ</td>
                                <td>{product.discount}%</td>
                                <td>{product.original_price?.toLocaleString()} đ</td>
                                <td>{product.category_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Chưa có sản phẩm nào được thêm.</p>
            )}
        </div>
    );
}