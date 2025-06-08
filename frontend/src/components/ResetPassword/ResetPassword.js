import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendResetRequest } from '../../services/forgotPasswordService';
import './ResetPassword.css';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!email) {
            setError('Vui lòng nhập email');
            setLoading(false);
            return;
        }

        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Email không đúng định dạng');
            setLoading(false);
            return;
        }

        try {
            const response = await sendResetRequest(email);
            setSuccess(response.message);

            // Hiển thị thông tin email đã gửi
            if (response.emailSent) {
                console.log('Email đã gửi đến:', response.emailSent);
            }

            setEmail(''); // Clear form

        } catch (err) {
            console.error('Lỗi gửi email:', err);
            const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi gửi email';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                <h2>Quên mật khẩu</h2>
                <p style={{
                    textAlign: 'center',
                    color: '#666',
                    marginBottom: '30px',
                    fontSize: '0.95rem'
                }}>
                    Nhập email tài khoản của bạn, chúng tôi sẽ gửi link đặt lại mật khẩu
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email tài khoản</label>
                        <input
                            type="email"
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    {error && <p className="error-text">{error}</p>}
                    {success && (
                        <div className="success-text">
                            <div style={{ marginBottom: '10px' }}>✅ {success}</div>
                            <div style={{ fontSize: '0.85rem', color: '#4caf50' }}>
                                Vui lòng kiểm tra email (bao gồm cả thư mục spam)
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
                    </button>
                </form>

                <div className="back-link">
                    <button
                        type="button"
                        className="link-btn"
                        onClick={() => navigate('/login')}
                    >
                        ← Quay lại đăng nhập
                    </button>
                </div>

                {success && (
                    <div style={{
                        marginTop: '20px',
                        padding: '15px',
                        backgroundColor: '#f0f8ff',
                        border: '1px solid #e6f3ff',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        color: '#333'
                    }}>
                        <strong>Không nhận được email?</strong>
                        <ul style={{ margin: '10px 0 0 20px', lineHeight: '1.5' }}>
                            <li>Kiểm tra thư mục spam/junk mail</li>
                            <li>Đảm bảo email đã nhập chính xác</li>
                            <li>Thử lại sau vài phút</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}