import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { paymentAPI, orderAPI } from '../../services/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { X, ShoppingCart, Plus, Minus, Trash2, ChevronRight } from 'lucide-react';

export default function CartSidebar() {
  const { items, totalItems, subtotal, deliveryCharge, platformFee, gst, total, updateQuantity, removeItem, isCartOpen, setIsCartOpen, clearCart } = useCart();
  const { user } = useAuth();
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to checkout');
      navigate('/login');
      setIsCartOpen(false);
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    try {
      setCheckingOut(true);
      await paymentAPI.createPaymentIntent({ amount: total });
      await orderAPI.createOrder({
        items,
        totalAmount: subtotal,
        deliveryCharge,
        platformFee,
        gst,
        grandTotal: total,
      });
      clearCart();
      toast.success('Payment successful!');
      setIsCartOpen(false);
      navigate('/order-success');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
      setCheckingOut(false);
    }
  };

  const freeDeliveryThreshold = 500;
  const remaining = freeDeliveryThreshold - subtotal;

  return (
    <>
      <div
        className={`cart-overlay ${isCartOpen ? 'visible' : ''}`}
        onClick={() => setIsCartOpen(false)}
      />

      <aside className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-orange-500" />
            <h2 className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
              My Cart
              {totalItems > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-400">({totalItems} items)</span>
              )}
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-8 py-16 text-center">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart size={32} className="text-orange-300" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Your cart is empty</h3>
              <p className="text-sm text-gray-400 mb-5">Add items from the menu to get started</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-full hover:bg-orange-600 transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-3">

              {/* Free delivery progress */}
              {remaining > 0 && (
                <div className="bg-orange-50 rounded-xl p-3 mb-1">
                  <p className="text-xs text-orange-700 font-medium mb-2">
                    Add ₹{remaining.toFixed(0)} more for <strong>FREE delivery</strong>
                  </p>
                  <div className="h-1.5 bg-orange-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Items */}
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate mb-0.5">{item.name}</p>
                    <p className="text-xs text-gray-400 mb-2">₹{parseFloat(item.price).toFixed(0)} each</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 bg-white rounded-lg p-0.5 border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded text-gray-500 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                        >
                          {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                        </button>
                        <span className="text-sm font-bold w-5 text-center text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded text-white bg-orange-500 hover:bg-orange-600 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="font-bold text-sm text-gray-800">
                        ₹{(parseFloat(item.price) * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-5">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery</span>
                <span className={`font-medium ${deliveryCharge === 0 ? 'text-green-600' : ''}`}>
                  {deliveryCharge === 0 ? 'FREE 🎉' : `₹${deliveryCharge}`}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Platform fee</span>
                <span className="font-medium">₹{platformFee}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>GST (5%)</span>
                <span className="font-medium">₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-dashed border-gray-200">
                <span>Total</span>
                <span className="text-orange-500">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full flex items-center justify-between px-5 py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg"
            >
              <span>{checkingOut ? 'Processing...' : 'Proceed to Pay'}</span>
              {checkingOut ? (
                <span className="spinner" />
              ) : (
                <div className="flex items-center gap-1">
                  <span>₹{total.toFixed(2)}</span>
                  <ChevronRight size={17} />
                </div>
              )}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
