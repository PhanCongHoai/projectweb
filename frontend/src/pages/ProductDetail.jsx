import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import { getUserId } from "../utils/auth";
import "./ProductDetail.css";
import { useNavigate } from "react-router-dom";


const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    api
      .get(`/api/products/${id}`)
      .then((res) => {
        if (res.data.code === 200) {
          setProduct(res.data.data);
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <div>Đang tải...</div>;

  const discount = Math.round(
    ((product.original_price - product.price) / product.original_price) * 100
  );

  const remaining = product.number - product.number2;
  const isOutOfStock = remaining <= 0;

  const handleBuyNow = () => {
    const userId = getUserId();
   if(userId === 0) { 
      alert("Vui lòng đăng nhập");
      return;
    }
    const orderData = {
        product: product,
        quantity: quantity,
    };
    localStorage.setItem("tempOrder", JSON.stringify(orderData));
    navigate("/checkout?from=buy");;
  };

const handleAddToCart = () => {
  const userId = getUserId();
  if(userId === 0) { 
      alert("Vui lòng đăng nhập");
      return;
    }
   // Giả sử đang đăng nhập với user_id = 1

  api.post("/api/cart/add", {
  userId: userId,
  productId: product.id,
  quantity: quantity,
})
    .then(() => {
      alert("Đã thêm vào giỏ hàng (backend)");
    })
    .catch((err) => console.error("Lỗi thêm giỏ hàng", err));
};


  return (
    <div className="product-detail-container">
      <div className="left-section">
        <img
          src={product.image_url}
          alt={product.title}
          className="product-image-large"
        />
      </div>

      <div className="right-section">
        <h2 className="product-title">{product.title}</h2>

        <div className="price-section">
          <span className="price">
            {Number(product.price).toLocaleString()}₫
          </span>
          {discount > 0 && <span className="discount">-{discount}%</span>}
        </div>

        <div className="original-price">
          Giá gốc: <del>{Number(product.original_price).toLocaleString()}₫</del>
        </div>

        <div className="sold">Đã bán: {product.number2} sản phẩm</div>

        <div className="stock">
          {isOutOfStock ? (
            <span className="out-of-stock">Hết hàng</span>
          ) : (
            <>Số lượng còn lại: {remaining}</>
          )}
        </div>

        <div className="quantity-section">
          <label>Số lượng:</label>
          <button
            className="quantity-btn"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            disabled={isOutOfStock}
          >
            -
          </button>
          <span className="quantity">{quantity}</span>
          <button
            className="quantity-btn"
            onClick={() =>
              setQuantity((prev) => (prev < remaining ? prev + 1 : prev))
            }
            disabled={isOutOfStock}
          >
            +
          </button>
        </div>

        <div className="button-group">
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            Thêm vào giỏ hàng
          </button>
          <button
            className="buy-now-btn"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
          >
            Mua ngay
          </button>
        </div>

        <div className="product-info-tabs">
          <h3>Thông Tin Chi Tiết</h3>
          <table className="product-info-table">
            <tbody>
              <tr>
                <td>Mã sản phẩm</td>
                <td>{product.id}</td>
              </tr>
              <tr>
                <td>Thương hiệu</td>
                <td>Đang cập nhật</td>
              </tr>
              <tr>
                <td>Danh mục</td>
                <td>{product.category_id}</td>
              </tr>
              <tr>
                <td>Số lượng còn lại</td>
                <td>{remaining}</td>
              </tr>
              <tr>
                <td>Đã bán</td>
                <td>{product.number2}</td>
              </tr>
            </tbody>
          </table>

          <h3>Mô Tả Sản Phẩm</h3>
          <div className="product-description">
            <p>
              Sản phẩm <strong>{product.title}</strong> là lựa chọn hoàn hảo dành
              cho bạn với chất lượng cao, hình ảnh sinh động, phù hợp cho học tập,
              làm việc và giải trí.
            </p>
            <p>
              Hãy nhanh tay đặt hàng để sở hữu sản phẩm chất lượng với mức giá ưu
              đãi chỉ còn{" "}
              <strong>{Number(product.price).toLocaleString()}₫</strong>!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
