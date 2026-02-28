import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from './adminAPI';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const { data } = await getAllOrders();
      setOrders(data);
    } catch {
      setError('Failed to load orders');
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      fetchOrders();
    } catch {
      setError('Failed to update status');
    }
  };

  return (
    <div>
      <h2>Manage Orders</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            Order #{order.id} — {order.status}
            <select value={order.status}
              onChange={(e) => handleStatus(order.id, e.target.value)}>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageOrders;