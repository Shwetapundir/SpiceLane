import { useState, useEffect } from 'react';
import api from '../services/api';

const STATUS_LABELS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed ✓',
  PREPARING: 'Preparing',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

const formatDate = (d) =>
  new Date(d).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data?.data?.orders || res.data?.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner spinner-dark" />
        <span className="page-loader-text">Loading your orders...</span>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: '8px' }}>
          My Orders 📦
        </h1>
        <p className="section-sub">
          Track and view all your past orders
        </p>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>
              No orders yet
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Start exploring our menu and place your first order!
            </p>
            <a href="/" className="btn btn-primary">
              Browse Menu
            </a>
          </div>
        ) : (
          <div>
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <div className="order-id">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </div>
                    <div className="order-date">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <span className={`order-status status-${order.status}`}>
                    {STATUS_LABELS[order.status] || order.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="order-items-list">
                  {order.items?.map((item) => (
                    <div key={item.id} className="order-dish-item">
                      <div className="order-dish-img">
                        <img
                          src={item.dish?.imageUrl}
                          alt={item.dish?.name || item.name}
                          style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=96&h=96&fit=crop'; }}
                        />
                      </div>
                      <div className="order-dish-name">
                        {item.dish?.name || item.name}
                      </div>
                      <div className="order-dish-qty">
                        ×{item.quantity}
                      </div>
                      <div className="order-dish-price">
                        ₹{(parseFloat(item.price) * item.quantity).toFixed(0)}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '24px',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span>
                      Subtotal: ₹{parseFloat(order.subtotal || 0).toFixed(0)}
                    </span>
                    {parseFloat(order.deliveryCharge) > 0 && (
                      <span>Delivery: ₹{parseFloat(order.deliveryCharge).toFixed(0)}</span>
                    )}
                    <span>GST: ₹{parseFloat(order.gst || 0).toFixed(2)}</span>
                  </div>
                  <div className="order-total">
                    <span className="order-total-label">Total: &nbsp;</span>
                    <span className="order-total-amount">
                      ₹{parseFloat(order.total || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
