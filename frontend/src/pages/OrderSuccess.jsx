import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const OrderSuccessPage = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart(); // clear cart on success
  }, []);

  return (
    <div className="success-page">
      <div className="success-card animate-fade-up">
        <div className="success-icon">✓</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>
          Order Confirmed! 🎉
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>
          Your delicious food is being prepared and will be at your doorstep soon!
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/orders" className="btn btn-outline">View Orders</Link>
          <Link to="/" className="btn btn-primary">Order More Food</Link>
        </div>

        <div style={{ marginTop: '24px', padding: '14px', background: '#fff3e9', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--primary)' }}>
          🕐 Estimated delivery: <strong>30-45 minutes</strong>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
