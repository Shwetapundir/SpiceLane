import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { paymentAPI } from '../services/api';

const OrderSuccessPage = () => {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setError('No session found.');
      setLoading(false);
      return;
    }

    // Payment already went through on Stripe — clear cart immediately
    clearCart();

    paymentAPI.verifySession(sessionId)
      .then((res) => setOrder(res.data.order))
      .catch(() => setError('Could not verify your payment. Please contact support.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4" style={{ width: 40, height: 40, margin: '0 auto 16px' }} />
          <p className="text-gray-500">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="success-page">
        <div className="success-card animate-fade-up">
          <div className="success-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>✕</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>
            Payment Verification Failed
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>{error}</p>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="success-card animate-fade-up">
        <div className="success-icon">✓</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>
          Order Confirmed! 🎉
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Your delicious food is being prepared and will be at your doorstep soon!
        </p>

        {order && (
          <div style={{ background: '#f9fafb', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '20px', textAlign: 'left', fontSize: '0.875rem' }}>
            <p style={{ fontWeight: 600, marginBottom: '8px', color: '#374151' }}>Order #{order.id.slice(-8).toUpperCase()}</p>
            {order.items?.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', marginBottom: '4px' }}>
                <span>{item.name} × {item.quantity}</span>
                <span>₹{(parseFloat(item.price) * item.quantity).toFixed(0)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px dashed #e5e7eb', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#111827' }}>
              <span>Total Paid</span>
              <span style={{ color: 'var(--primary)' }}>₹{parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>
        )}

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
