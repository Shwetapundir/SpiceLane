import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const DELIVERY_CHARGE = 29;
const PLATFORM_FEE = 5;
const GST_RATE = 0.05;

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (dish) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === dish.id);
      if (exists) return prev.map(i => i.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...dish, quantity: 1 }];
    });
  };

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) { removeItem(id); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const getItemQuantity = (id) => items.find(i => i.id === id)?.quantity || 0;

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
  const gst = subtotal * GST_RATE;
  const effectiveDelivery = subtotal >= 500 ? 0 : DELIVERY_CHARGE;
  const total = subtotal + effectiveDelivery + PLATFORM_FEE + gst;
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart, getItemQuantity,
      subtotal, deliveryCharge: effectiveDelivery, platformFee: PLATFORM_FEE,
      gst, total, totalItems,
      isCartOpen, setIsCartOpen,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};