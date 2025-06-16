import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserId } from "../utils/auth";
import './CartPage.css';
import { useNavigate } from 'react-router-dom';


const CartPage = () => {
    const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const userId = getUserId();

  // Load giỏ hàng
  const fetchCart = () => {
    if(userId === 0) return;
    axios
      .get(`http://localhost:5005/api/cart/${userId}`)
      .then((res) => setItems(res.data.items || []))
      .catch((err) => console.error('Lỗi tải giỏ hàng:', err));
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  // Tổng tiền
  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.Product.price,
    0
  );

  // Tăng/giảm số lượng
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axios.put(`http://localhost:5005/api/cart/item/${itemId}`, {
        cartItemId: itemId,
        quantity: newQuantity,
      });
      fetchCart();
    } catch (err) {
      alert('Không thể cập nhật số lượng!');
      console.error(err);
    }
  };

  // Xoá sản phẩm khỏi giỏ hàng
  const removeItem = async (itemId) => {
    if (!window.confirm('Bạn có chắc muốn xoá sản phẩm này khỏi giỏ hàng?')) return;

    try {
      await axios.delete(`http://localhost:5005/api/cart/remove/${itemId}`);
      fetchCart();
    } catch (err) {
      alert('Không thể xoá sản phẩm!');
      console.error(err);
    }
  };

  return (
    <div className="cart-page">
      <h2>🛒 Giỏ hàng của bạn</h2>
      {items.length === 0 ? (
        <p>Không có sản phẩm nào trong giỏ.</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Tên</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Số lượng còn</th>
                <th>Thành tiền</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const product = item.Product;
                const available = product.number - product.number2;

                return (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={product.image_url}
                        alt={product.title}
                        width="80"
                      />
                    </td>
                    <td>{product.title}</td>
                    <td>{product.price.toLocaleString()}₫</td>
                    <td>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span style={{ margin: '0 8px' }}>{item.quantity}</span>
                      <button
                        onClick={() => {
                          if (item.quantity < available) {
                            updateQuantity(item.id, item.quantity + 1);
                          } else {
                            alert('Vượt quá số lượng tồn kho!');
                          }
                        }}
                      >
                        +
                      </button>
                    </td>
                    <td>{available}</td>
                    <td>
                      {(product.price * item.quantity).toLocaleString()}₫
                    </td>
                    <td>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{ color: 'red' }}
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="cart-total">
            <h3>Tổng tiền: {total.toLocaleString()}₫</h3>
            <button className="checkout-btn" onClick={() => navigate("/checkout?from=cart")}>
                Thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
