import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, ChefHat, Menu, X, ClipboardList, Shield, LogOut, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function Navbar({ onSearch }) {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const userMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setUserMenuOpen(false);
    setMobileOpen(false);
  };

  const handleSearch = (e) => {
    setSearchVal(e.target.value);
    onSearch?.(e.target.value);
  };

  const isHome = location.pathname === '/';

  const openCart = () => {
    if (setIsCartOpen) setIsCartOpen(true);
    else navigate('/cart');
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white border-b border-gray-100'}`}>
      <div className="container">
        <div className="flex items-center gap-4 h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <ChefHat size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              Spice<span className="text-orange-500">Lane</span>
            </span>
          </Link>

          {/* Search bar - only on home */}
          {isHome && (
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search dishes, cuisines..."
                  value={searchVal}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                />
              </div>
            </div>
          )}

          <div className="flex-1" />

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-1">
            {user && (
              <Link to="/orders" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
                <ClipboardList size={16} /> Orders
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                <Shield size={16} /> Admin
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md ml-1"
            >
              <ShoppingCart size={17} />
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User */}
            {user ? (
              <div className="relative ml-1" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center font-bold text-orange-600 text-sm">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name?.split(' ')[0]}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-12 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 w-52 animate-scale-in">
                    <div className="px-4 py-2.5 border-b border-gray-50">
                      <p className="text-xs text-gray-400 mb-0.5">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
                  Sign in
                </Link>
                <Link to="/register" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-full transition-all shadow-sm">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile icons */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={openCart} className="relative p-2 text-gray-700">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-[18px] h-[18px] bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-gray-700">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-5 py-4 space-y-1 animate-fade-in">
          {isHome && (
            <div className="relative mb-3">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchVal}
                onChange={handleSearch}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-orange-400"
              />
            </div>
          )}
          {user ? (
            <>
              <div className="flex items-center gap-3 py-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
              <Link to="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2.5 text-gray-700 font-medium text-sm">
                <ClipboardList size={17} /> My Orders
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2.5 text-purple-600 font-medium text-sm">
                  <Shield size={17} /> Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center gap-2 py-2.5 text-red-500 font-medium text-sm w-full">
                <LogOut size={17} /> Sign out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="py-2.5 text-center text-gray-700 font-medium text-sm border border-gray-200 rounded-xl">
                Sign in
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="py-2.5 text-center bg-orange-500 text-white font-semibold text-sm rounded-xl">
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}