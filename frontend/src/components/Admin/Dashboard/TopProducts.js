import { useState } from 'react';

const TopProducts = () => {
    const [products] = useState([
        { name: 'Smartphone', price: 'VND 699.000', sold: 120 },
        { name: 'Laptop', price: 'VND 999.000', sold: 85 },
        { name: 'Tai nghe', price: 'VND 199.000', sold: 200 }
    ]);

    return (
        <div className="table-container">
            <div className="table-header">
                <h2 className="table-title">Sản phẩm bán chạy</h2>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Giá</th>
                        <th>Đã bán</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, idx) => (
                        <tr key={idx}>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.sold}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TopProducts;