import { useState, useEffect } from 'react';
import api from '../services/api';
import DishCard from '../components/food/DishCard';
import SkeletonCard from '../components/food/SkeletonCard';
import { Clock, Star } from 'lucide-react';

const CATEGORIES = [
  { label: 'All', emoji: '🍽️' },
  { label: 'Veg Starters', emoji: '🥗' },
  { label: 'Non-Veg Starters', emoji: '🍗' },
  { label: 'Momos & Chinese', emoji: '🥟' },
  { label: 'Pizza', emoji: '🍕' },
  { label: 'Burgers & Wraps', emoji: '🍔' },
  { label: 'Main Course', emoji: '🍛' },
  { label: 'Rice & Biryani', emoji: '🍚' },
  { label: 'Pasta', emoji: '🍝' },
  { label: 'Desserts', emoji: '🍮' },
  { label: 'Beverages', emoji: '🥤' },
];

const Hero = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50 py-12 md:py-16">
    {/* Decorative blobs */}
    <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

    <div className="container relative">
      <div className="max-w-2xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
          Free delivery on orders above ₹500
        </div>

        <h1
          className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-[1.1]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Craving something <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
            delicious?
          </span>
        </h1>

        <p className="text-gray-500 text-lg mb-8 max-w-lg">
          Authentic Indian flavors, freshly prepared and delivered to your door in 30 minutes.
        </p>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Star size={15} className="text-yellow-400 fill-yellow-400" />
            <span className="font-semibold">4.8</span>
            <span className="text-gray-400">rating</span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5 text-gray-600">
            <Clock size={15} className="text-orange-400" />
            <span className="font-semibold">30 min</span>
            <span className="text-gray-400">avg delivery</span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5 text-gray-600">
            <span className="font-semibold text-orange-500">100+</span>
            <span className="text-gray-400">dishes</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const EmptyState = ({ hasFilters, onReset }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
    <div className="text-6xl mb-4">🍽️</div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">No dishes found</h3>
    <p className="text-gray-400 mb-6 max-w-xs">
      {hasFilters ? 'Try adjusting your filters or search term.' : 'Check back soon for new dishes!'}
    </p>
    {hasFilters && (
      <button
        onClick={onReset}
        className="px-5 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-full hover:bg-orange-600 transition-colors"
      >
        Clear Filters
      </button>
    )}
  </div>
);

export default function HomePage({ searchQuery = '' }) {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [vegFilter, setVegFilter] = useState(null);

  useEffect(() => {
    fetchDishes();
  }, [activeCategory, vegFilter, searchQuery]);

  const fetchDishes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeCategory !== 'All') params.category = activeCategory;
      if (vegFilter !== null) params.isVeg = vegFilter;
      if (searchQuery) params.search = searchQuery;
      const res = await api.get('/dishes', { params });
      setDishes(res.data?.data?.dishes || res.data?.dishes || res.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setActiveCategory('All');
    setVegFilter(null);
  };

  const hasFilters = activeCategory !== 'All' || vegFilter !== null || searchQuery;

  return (
    <>
      <Hero />

      <main className="py-8 pb-20">
        <div className="container">

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-5">
            {CATEGORIES.map(({ label, emoji }) => (
              <button
                key={label}
                onClick={() => setActiveCategory(label)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  activeCategory === label
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-500'
                }`}
              >
                <span className="text-base">{emoji}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Veg / Non-veg filters */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setVegFilter(vegFilter === true ? null : true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                vegFilter === true
                  ? 'bg-green-500 text-white border-green-500 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600'
              }`}
            >
              <span className={`w-3.5 h-3.5 border-2 rounded-sm flex items-center justify-center ${vegFilter === true ? 'border-white' : 'border-green-600'}`}>
                <span className={`w-2 h-2 rounded-full ${vegFilter === true ? 'bg-white' : 'bg-green-600'}`} />
              </span>
              Pure Veg
            </button>

            <button
              onClick={() => setVegFilter(vegFilter === false ? null : false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                vegFilter === false
                  ? 'bg-red-500 text-white border-red-500 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-red-400 hover:text-red-600'
              }`}
            >
              <span className={`w-3.5 h-3.5 border-2 rounded-sm flex items-center justify-center ${vegFilter === false ? 'border-white' : 'border-red-600'}`}>
                <span className={`w-2 h-2 rounded-full ${vegFilter === false ? 'bg-white' : 'bg-red-600'}`} />
              </span>
              Non-Veg
            </button>

            {hasFilters && (
              <button
                onClick={resetFilters}
                className="ml-auto text-xs text-gray-400 hover:text-orange-500 font-medium transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Results header */}
          {!loading && dishes.length > 0 && (
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'var(--font-display)' }}>
                {activeCategory === 'All' ? 'All Dishes' : activeCategory}
                <span className="ml-2 text-sm font-normal text-gray-400">({dishes.length})</span>
              </h2>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="food-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : dishes.length === 0 ? (
            <EmptyState hasFilters={hasFilters} onReset={resetFilters} />
          ) : (
            <div className="food-grid">
              {dishes.map((dish, i) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  style={{ animationDelay: `${i * 40}ms` }}
                />
              ))}
            </div>
          )}

        </div>
      </main>
    </>
  );
}