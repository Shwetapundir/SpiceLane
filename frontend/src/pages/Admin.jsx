import { useState, useEffect } from 'react';
import { dishAPI } from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Main Course', 'Rice', 'South Indian', 'North Indian', 'Street Food', 'Starters', 'Breads', 'Desserts', 'Beverages'];

const emptyForm = {
  name: '', description: '', price: '', imageUrl: '',
  category: 'Main Course', rating: '4.5', deliveryTime: '30', isVeg: true, isAvailable: true,
};

const DishModal = ({ dish, onClose, onSaved }) => {
  const [form, setForm] = useState(dish ? { ...dish, price: dish.price.toString(), rating: dish.rating.toString(), deliveryTime: dish.deliveryTime.toString() } : emptyForm);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = { ...form, price: parseFloat(form.price), rating: parseFloat(form.rating), deliveryTime: parseInt(form.deliveryTime) };
      if (dish) {
        await dishAPI.update(dish.id, data);
        toast.success('Dish updated!');
      } else {
        await dishAPI.create(data);
        toast.success('Dish created!');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save dish');
    } finally {
      setLoading(false);
    }
  };

  const f = (key) => ({ value: form[key], onChange: (e) => setForm({ ...form, [key]: e.target.value }) });

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{dish ? '✏️ Edit Dish' : '➕ Add New Dish'}</h2>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Dish Name *</label>
            <input className="form-input" placeholder="e.g. Paneer Butter Masala" required {...f('name')} />
          </div>
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-input"
              style={{ height: '80px', resize: 'vertical', paddingTop: '12px' }}
              placeholder="Describe the dish..."
              required
              {...f('description')}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input className="form-input" type="number" min="0" step="0.01" required {...f('price')} />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Image URL *</label>
            <input className="form-input" type="url" placeholder="https://images.unsplash.com/..." required {...f('imageUrl')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Rating (0–5)</label>
              <input className="form-input" type="number" min="0" max="5" step="0.1" {...f('rating')} />
            </div>
            <div className="form-group">
              <label className="form-label">Delivery Time (min)</label>
              <input className="form-input" type="number" min="1" {...f('deliveryTime')} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500 }}>
              <input type="checkbox" checked={form.isVeg} onChange={(e) => setForm({ ...form, isVeg: e.target.checked })} />
              🌿 Is Vegetarian
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500 }}>
              <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} />
              ✅ Is Available
            </label>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" /> Saving...</> : (dish ? 'Update Dish' : 'Create Dish')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminPage = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | dish object
  const [deleting, setDeleting] = useState(null);

  const fetchDishes = async () => {
    try {
      setLoading(true);
      const res = await dishAPI.getAll({ limit: 100 });
      setDishes(res.data.data.dishes);
    } catch (err) {
      toast.error('Failed to load dishes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDishes(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this dish?')) return;
    try {
      setDeleting(id);
      await dishAPI.delete(id);
      toast.success('Dish deleted!');
      fetchDishes();
    } catch (err) {
      toast.error('Failed to delete dish');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="section-title">🍽️ Dish Management</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{dishes.length} dishes in total</p>
          </div>
          <button className="btn btn-primary" onClick={() => setModal('create')}>
            + Add New Dish
          </button>
        </div>

        {loading ? (
          <div className="page-loader"><div className="spinner spinner-dark" /></div>
        ) : (
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Dish</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dishes.map((dish) => (
                  <tr key={dish.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img className="dish-thumb" src={dish.imageUrl} alt={dish.name} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{dish.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {dish.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{dish.category}</td>
                    <td style={{ fontWeight: 600 }}>₹{dish.price}</td>
                    <td>⭐ {dish.rating}</td>
                    <td>
                      <span style={{ color: dish.isVeg ? 'var(--veg)' : 'var(--nonveg)', fontWeight: 600, fontSize: '0.85rem' }}>
                        {dish.isVeg ? '🌿 Veg' : '🍖 Non-Veg'}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700,
                        background: dish.isAvailable ? '#e6f9f0' : '#ffe6e6',
                        color: dish.isAvailable ? 'var(--success)' : 'var(--danger)',
                      }}>
                        {dish.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal(dish)}>✏️ Edit</button>
                        <button
                          className="btn btn-sm"
                          style={{ background: '#ffe6e6', color: 'var(--danger)' }}
                          onClick={() => handleDelete(dish.id)}
                          disabled={deleting === dish.id}
                        >
                          {deleting === dish.id ? '...' : '🗑 Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <DishModal
          dish={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={fetchDishes}
        />
      )}
    </div>
  );
};

export default AdminPage;
