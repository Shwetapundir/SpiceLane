import { Plus, Star, Clock, Minus, Flame } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const DISH_IMAGE_MAP = {
  'paneer butter masala':  'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop&auto=format',
  'dal makhani':           'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop&auto=format',
  'chicken tikka masala':  'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop&auto=format',
  'palak paneer':          'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop&auto=format',
  'butter chicken':        'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop&auto=format',
  'veg biryani':           'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=600&h=400&fit=crop&auto=format',
  'chicken biryani':       'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=400&fit=crop&auto=format',
  'masala dosa':           'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop&auto=format',
  'chole bhature':         'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop&auto=format',
  'pav bhaji':             'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&h=400&fit=crop&auto=format',
  'butter naan':           'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&h=400&fit=crop&auto=format',
  'gulab jamun':           'https://images.unsplash.com/photo-1601303516534-bf4ccd4b07f1?w=600&h=400&fit=crop&auto=format',
  'mango lassi':           'https://images.unsplash.com/photo-1571805529673-0f56b922b359?w=600&h=400&fit=crop&auto=format',
  'tandoori chicken':      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=400&fit=crop&auto=format',
  'aloo tikki':            'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&h=400&fit=crop&auto=format',
  'samosa':                'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop&auto=format',
  'fried rice':            'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop&auto=format',
  'gulab':                 'https://images.unsplash.com/photo-1601303516534-bf4ccd4b07f1?w=600&h=400&fit=crop&auto=format',
  'ice cream':             'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&h=400&fit=crop&auto=format',
  'chai':                  'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=600&h=400&fit=crop&auto=format',
  'coffee':                'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop&auto=format',
  'paneer':                'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop&auto=format',
  'biryani':               'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=600&h=400&fit=crop&auto=format',
  'chicken':               'https://images.unsplash.com/photo-1598103442097-8b74394b95c7?w=600&h=400&fit=crop&auto=format',
  'dosa':                  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop&auto=format',
  'idli':                  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop&auto=format',
  'naan':                  'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&h=400&fit=crop&auto=format',
  'roti':                  'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&h=400&fit=crop&auto=format',
  'dal':                   'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop&auto=format',
  'chole':                 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop&auto=format',
  'lassi':                 'https://images.unsplash.com/photo-1571805529673-0f56b922b359?w=600&h=400&fit=crop&auto=format',
  'tikki':                 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&h=400&fit=crop&auto=format',
  'chaat':                 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&h=400&fit=crop&auto=format',
  'soup':                  'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop&auto=format',
  'pizza':                 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop&auto=format',
  'burger':                'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&auto=format',
};

const CATEGORY_IMAGE_MAP = {
  'Veg Starters':     'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&h=400&fit=crop&auto=format',
  'Non-Veg Starters': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=400&fit=crop&auto=format',
  'Momos & Chinese':  'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&h=400&fit=crop&auto=format',
  'Pizza':            'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop&auto=format',
  'Burgers & Wraps':  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&auto=format',
  'Main Course':      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop&auto=format',
  'Rice & Biryani':   'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=400&fit=crop&auto=format',
  'Pasta':            'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=400&fit=crop&auto=format',
  'Desserts':         'https://images.unsplash.com/photo-1601303516534-bf4ccd4b07f1?w=600&h=400&fit=crop&auto=format',
  'Beverages':        'https://images.unsplash.com/photo-1571805529673-0f56b922b359?w=600&h=400&fit=crop&auto=format',
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&auto=format';

// Use DB imageUrl directly — all images are correctly seeded
const getSmartImage = (dish) => {
  if (dish.imageUrl && dish.imageUrl.startsWith('http')) return dish.imageUrl;
  return FALLBACK_IMAGE;
};

const CATEGORY_STYLES = {
  'Veg Starters':     { bg: 'bg-green-100',  text: 'text-green-700',  icon: '🥗' },
  'Non-Veg Starters': { bg: 'bg-red-100',    text: 'text-red-700',    icon: '🍗' },
  'Momos & Chinese':  { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '🥟' },
  'Pizza':            { bg: 'bg-orange-100', text: 'text-orange-700', icon: '🍕' },
  'Burgers & Wraps':  { bg: 'bg-amber-100',  text: 'text-amber-700',  icon: '🍔' },
  'Main Course':      { bg: 'bg-rose-100',   text: 'text-rose-700',   icon: '🍛' },
  'Rice & Biryani':   { bg: 'bg-lime-100',   text: 'text-lime-700',   icon: '🍚' },
  'Pasta':            { bg: 'bg-pink-100',   text: 'text-pink-700',   icon: '🍝' },
  'Desserts':         { bg: 'bg-purple-100', text: 'text-purple-700', icon: '🍮' },
  'Beverages':        { bg: 'bg-blue-100',   text: 'text-blue-700',   icon: '🥤' },
};

const getCategoryStyle = (category) =>
  CATEGORY_STYLES[category] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: '🍴' };

export function DishCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-gray-200 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 rounded-full w-full" />
        <div className="h-3 bg-gray-100 rounded-full w-2/3" />
        <div className="flex justify-between items-center mt-2">
          <div className="h-6 bg-gray-200 rounded-full w-16" />
          <div className="h-9 bg-gray-200 rounded-xl w-20" />
        </div>
      </div>
    </div>
  );
}

export default function DishCard({ dish, style }) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find(i => i.id === dish.id);
  const qty = cartItem?.quantity || 0;

  const imageUrl = getSmartImage(dish);
  const catStyle = getCategoryStyle(dish.category);
  const rating = parseFloat(dish.rating || 4.0);
  const isHighRated = rating >= 4.5;

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
      style={{ ...style, transform: 'translateY(0)', transition: 'all 0.3s ease' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div className="relative overflow-hidden h-48 flex-shrink-0">
        <img
          src={imageUrl}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <div className={`absolute top-3 left-3 w-5 h-5 border-2 flex items-center justify-center rounded-sm bg-white shadow-md ${dish.isVeg ? 'border-green-600' : 'border-red-600'}`}>
          <div className={`w-2.5 h-2.5 rounded-full ${dish.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
        </div>
        <div className={`absolute top-3 right-3 flex items-center gap-1 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-bold shadow-md ${isHighRated ? 'bg-green-500 text-white' : 'bg-white/90 text-gray-800'}`}>
          <Star size={10} className={isHighRated ? 'text-white fill-white' : 'text-yellow-400 fill-yellow-400'} />
          <span>{rating.toFixed(1)}</span>
        </div>
        {isHighRated && (
          <div className="absolute top-3 left-10 flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
            <Flame size={9} />
            BESTSELLER
          </div>
        )}
        <div className={`absolute bottom-3 left-3 flex items-center gap-1 ${catStyle.bg} ${catStyle.text} text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm`}>
          <span>{catStyle.icon}</span>
          <span>{dish.category}</span>
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full">
          <Clock size={10} />
          <span>{dish.deliveryTime || 30}m</span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3
          className="font-bold text-gray-900 text-[15px] leading-snug mb-1.5 line-clamp-1 group-hover:text-orange-600 transition-colors"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {dish.name}
        </h3>
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 flex-1 mb-3">
          {dish.description}
        </p>
        <div className="border-t border-dashed border-gray-100 mb-3" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mb-0.5">Price</p>
            <p className="text-lg font-extrabold text-gray-900">
              ₹<span>{parseFloat(dish.price).toFixed(0)}</span>
            </p>
          </div>
          {qty === 0 ? (
            <button
              onClick={() => addItem(dish)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-bold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
            >
              <Plus size={15} strokeWidth={2.5} />
              ADD
            </button>
          ) : (
            <div className="flex items-center gap-0 bg-orange-500 rounded-xl overflow-hidden shadow-md">
              <button
                onClick={() => updateQuantity(dish.id, qty - 1)}
                className="w-8 h-9 flex items-center justify-center text-white hover:bg-orange-600 transition-colors"
              >
                <Minus size={13} strokeWidth={2.5} />
              </button>
              <span className="text-white font-bold text-sm w-7 text-center bg-orange-600">{qty}</span>
              <button
                onClick={() => updateQuantity(dish.id, qty + 1)}
                className="w-8 h-9 flex items-center justify-center text-white hover:bg-orange-600 transition-colors"
              >
                <Plus size={13} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
