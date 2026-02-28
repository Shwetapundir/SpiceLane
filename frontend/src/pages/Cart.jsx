import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { paymentAPI } from '../services/api';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShoppingCart, Plus, Minus, Trash2, ChevronRight, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { items, subtotal, deliveryCharge, platformFee, gst, total, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to checkout');
      navigate('/login');
      return;
    }
    try {
      setCheckingOut(true);
      console.log('Sending amount:', total); // 👈 debug
      const res = await paymentAPI.createPaymentIntent({ amount: total });
      console.log('Payment response:', res.data); // 👈 debug

      if (res.data?.success) {
        toast.success('Payment successful!');
        navigate('/order-success');
      } else {
        toast.error('Could not initiate checkout');
        setCheckingOut(false);
      }
    } catch (err) {
      console.error('Payment error:', err.response?.data); // 👈 debug
      toast.error(err.response?.data?.message || 'Checkout failed');
      setCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart size={40} className="text-orange-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Your cart is empty
        </h2>
        <p className="text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/" className="btn btn-primary">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] py-8 pb-24">
      <div className="container max-w-5xl">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)' }}>
          Your Cart{' '}
          <span className="text-gray-400 font-normal text-xl">({items.length} items)</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Items */}
          <div className="flex-1 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop'; }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-0.5 border border-gray-200">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <span className="font-bold text-gray-800">
                      ₹{(parseFloat(item.price) * item.quantity).toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bill Summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-20">
              <h2 className="font-bold text-lg mb-5" style={{ fontFamily: 'var(--font-display)' }}>
                Bill Summary
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className={deliveryCharge === 0 ? 'text-green-600 font-medium' : ''}>
                    {deliveryCharge === 0 ? 'FREE 🎉' : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Platform fee</span>
                  <span>₹{platformFee}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (5%)</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base pt-3 border-t border-dashed">
                  <span>Total</span>
                  <span className="text-orange-500">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full flex items-center justify-between mt-6 px-5 py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 shadow-md"
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
          </div>

        </div>
      </div>
    </div>
  );
}
