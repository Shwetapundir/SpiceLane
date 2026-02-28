import { useState } from 'react';
import ManageMenu from './ManageMenu';
import ManageOrders from './ManageOrders';
import ManageUsers from './ManageUsers';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('menu');

  return (
    <div>
      <h1>Admin Panel</h1>
      <nav>
        <button onClick={() => setActiveTab('menu')}>Menu</button>
        <button onClick={() => setActiveTab('orders')}>Orders</button>
        <button onClick={() => setActiveTab('users')}>Users</button>
      </nav>

      {activeTab === 'menu' && <ManageMenu />}
      {activeTab === 'orders' && <ManageOrders />}
      {activeTab === 'users' && <ManageUsers />}
    </div>
  );
};

export default AdminPanel;