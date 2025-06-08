import React, { useState, useEffect } from 'react';
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
    const [isLoadingList, setIsLoadingList] = useState(true); // Loading cho danh sách

    // 🆕 Hàm để lấy danh sách sản phẩm từ database
    const fetchProducts = async () => {
        try {
            setIsLoadingList(true);
            console.log("🔄 Đang tải danh sách sản phẩm...");

            const response = await fetch("http://localhost:5005/api/products");
            console.log("📡 Response status:", response.status);

            if (response.ok) {
                const data = await response.json();
                console.log("📥 Raw response data:", data);

                // Thử các cấu trúc response khác nhau
                let products = [];
                if (Array.isArray(data)) {
                    products = data;
                } else if (data.data && Array.isArray(data.data)) {
                    products = data.data;
                } else if (data.products && Array.isArray(data.products)) {
                    products = data.products;
                } else {
                    console.warn("⚠️ Không tìm thấy mảng sản phẩm trong response");
                }

                setProductList(products);
                console.log("✅ Đã tải", products.length, "sản phẩm");
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error("❌ API error:", response.status, errorData);
                alert(`❌ Lỗi tải sản phẩm: ${errorData.message || 'Kiểm tra API endpoint'}`);
            }
        } catch (error) {
            console.error("❌ Network error:", error);
            alert(`❌ Lỗi kết nối: ${error.message}\nKiểm tra xem server có đang chạy không?`);
        } finally {
            setIsLoadingList(false);
        }
    };

    // 🆕 Hàm xóa sản phẩm
    const deleteProduct = async (productId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
            return;
        }

        try {
            console.log("🗑️ Đang xóa sản phẩm ID:", productId);

            const response = await fetch(`http://localhost:5005/api/products/${productId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("✅ Xóa sản phẩm thành công!");
                // Cập nhật danh sách bằng cách loại bỏ sản phẩm đã xóa
                setProductList(productList.filter(product => product.id !== productId));
                console.log("✅ Đã xóa sản phẩm khỏi danh sách");
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error("❌ Delete error:", errorData);
                alert(`❌ Xóa sản phẩm thất bại: ${errorData.message || 'Lỗi server'}`);
            }
        } catch (error) {
            console.error("❌ Network error:", error);
            alert(`❌ Lỗi kết nối: ${error.message}`);
        }
    };

    // 🆕 useEffect để load dữ liệu khi component mount
    useEffect(() => {
        fetchProducts();
    }, []);

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

                // ✅ Thêm sản phẩm mới vào danh sách
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

                // 🆕 Tùy chọn: Reload lại danh sách để đảm bảo đồng bộ
                // fetchProducts();
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

            {/* 🆕 Hiển thị loading khi đang tải danh sách */}
            <h3>Danh sách sản phẩm đã thêm ({productList.length})</h3>

            {isLoadingList ? (
                <p>Đang tải danh sách sản phẩm...</p>
            ) : productList.length > 0 ? (
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá hiện tại</th>
                            <th>Giảm giá (%)</th>
                            <th>Giá gốc</th>
                            <th>Danh mục</th>
                            <th>Thao tác</th>
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
                                <td>
                                    <button
                                        onClick={() => deleteProduct(product.id)}
                                        style={{
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 10px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                        disabled={!product.id}
                                    >
                                        🗑️ Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Chưa có sản phẩm nào trong database.</p>
            )}

            {/* 🆕 Nút refresh danh sách */}
            <button
                onClick={fetchProducts}
                disabled={isLoadingList}
                style={{ marginTop: '10px', padding: '8px 16px' }}
            >
                {isLoadingList ? "Đang tải..." : "🔄 Làm mới danh sách"}
            </button>
        </div>
    );
}