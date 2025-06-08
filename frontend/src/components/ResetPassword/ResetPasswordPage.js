import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { validateResetToken, resetPassword } from '../../services/forgotPasswordService';
import './ResetPassword.css';

export default function ResetPasswordPage() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [validatingToken, setValidatingToken] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    // Kiểm tra token khi component load
    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await validateResetToken(token);
                setTokenValid(true);
                setUserEmail(response.email);
            } catch (err) {
                setError(err.response?.data?.message || 'Liên kết không hợp lệ hoặc đã hết hạn!');
                setTokenValid(false);
            } finally {
                setValidatingToken(false);
            }
        };

        if (token) {
            checkToken();
        } else {
            setError('Liên kết không hợp lệ!');
            setValidatingToken(false);
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!newPassword || !confirmPassword) {
            setError('Vui lòng nhập đầy đủ thông tin!');
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự!');
            setLoading(false);
            return;
        }

        try {
            const response = await resetPassword({
                token: token,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            });

            setSuccess(response.message);

            // Chuyển về trang login sau 3 giây
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi đặt lại mật khẩu!');
        } finally {
            setLoading(false);
        }
    };

    if (validatingToken) {
        return (
            <div className="reset-password-container">
                <div className="reset-password-card">
                    <div className="loading">
                        Đang kiểm tra liên kết...
                    </div>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="reset-password-container">
                <div className="reset-password-card">
                    <h2>Liên kết không hợp lệ</h2>
                    {error && <p className="error-text">{error}</p>}
                    <button
                        className="back-btn"
                        onClick={() => navigate('/forgot-password')}
                    >
                        Yêu cầu liên kết mới
                    </button>
                    <div className="back-link">
                        <button
                            type="button"
                            className="link-btn"
                            onClick={() => navigate('/login')}
                        >
                            ← Quay lại đăng nhập
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                <h2>Đặt lại mật khẩu</h2>

                {userEmail && (
                    <p style={{
                        textAlign: 'center',
                        color: '#666',
                        marginBottom: '20px',
                        fontSize: '0.9rem'
                    }}>
                        Đặt lại mật khẩu cho: <strong>{userEmail}</strong>
                    </p>
                )}

                {success ? (
                    <div>
                        <div className="success-text">
                            ✅ {success}
                        </div>
                        <p style={{
                            textAlign: 'center',
                            color: '#666',
                            marginTop: '15px'
                        }}>
                            Đang chuyển đến trang đăng nhập...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Mật khẩu mới</label>
                            <input
                                type="password"
                                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Xác nhận mật khẩu mới</label>
                            <input
                                type="password"
                                placeholder="Nhập lại mật khẩu mới"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        {error && <p className="error-text">{error}</p>}

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                        </button>
                    </form>
                )}

                <div className="back-link">
                    <button
                        type="button"
                        className="link-btn"
                        onClick={() => navigate('/login')}
                    >
                        ← Quay lại đăng nhập
                    </button>
                </div>
            </div>
        </div>
    );
}