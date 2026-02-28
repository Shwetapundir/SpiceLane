import { useEffect, useState } from 'react';
import { getMenuItems, addMenuItem, deleteMenuItem } from './adminAPI';

const ManageMenu = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', category: '' });
  const [error, setError] = useState('');

  const fetchItems = async () => {
    try {
      const { data } = await getMenuItems();
      setItems(data);
    } catch {
      setError('Failed to load menu items');
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async () => {
    try {
      await addMenuItem(form);
      setForm({ name: '', price: '', category: '' });
      fetchItems();
    } catch {
      setError('Failed to add item');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMenuItem(id);
      fetchItems();
    } catch {
      setError('Failed to delete item');
    }
  };

  return (
    <div>
      <h2>Manage Menu</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <input placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Price" value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input placeholder="Category" value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <button onClick={handleAdd}>Add Item</button>
      </div>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} — ₹{item.price} ({item.category})
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageMenu;