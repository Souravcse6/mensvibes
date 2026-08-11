import React, { useState } from 'react';
import { ShoppingBag, Heart, User, Search, Menu, X, Sparkles, Shield, Compass, ChevronDown, PackageCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  onNavigate: (page: string, params?: any) => void;
  currentPage: string;
  allProducts: Product[];
  onOpenAIStylist: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  currentPage,
  allProducts,
  onOpenAIStylist,
  onOpenAuthModal,
}) => {
  const { cart, wishlist, setIsCartOpen } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Filter products for instant search dropdown
  const searchResults = searchQuery.trim()
    ? allProducts.filter(
        p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.material.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-amber-50 shadow-md border-b border-amber-950/40">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-amber-100 px-4 py-1.5 text-xs text-center font-medium flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-amber-200/80">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>100% Genuine Grade-A Cow Leather • Handstitched Italian Soles</span>
        </div>
        <div className="mx-auto md:mx-0 flex items-center gap-3">
          <span>🔥 FREE Nationwide Delivery on Orders Over ৳3,000 | Use Code: <strong className="text-amber-300">MENSVIBES10</strong></span>
        </div>
        <button
          onClick={onOpenAIStylist}
          className="hidden lg:flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30 transition-all text-[11px]"
        >
          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>AI Shoe Stylist</span>
        </button>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-amber-200 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <BrandLogo onClick={() => onNavigate('home')} variant="horizontal" size="md" />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-amber-300 transition-colors relative py-1 ${
                currentPage === 'home' ? 'text-amber-400 font-semibold' : 'text-stone-300'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('products')}
              className={`hover:text-amber-300 transition-colors relative py-1 ${
                currentPage === 'products' ? 'text-amber-400 font-semibold' : 'text-stone-300'
              }`}
            >
              All Shoes
            </button>
            <button
              onClick={() => onNavigate('products', { category: 'LOAFERS' })}
              className="text-stone-300 hover:text-amber-300 transition-colors"
            >
              Loafers
            </button>
            <button
              onClick={() => onNavigate('products', { category: 'PREMIUM CHELSEA' })}
              className="text-stone-300 hover:text-amber-300 transition-colors"
            >
              Chelsea Boots
            </button>
            <button
              onClick={() => onNavigate('story')}
              className={`hover:text-amber-300 transition-colors ${
                currentPage === 'story' ? 'text-amber-400 font-semibold' : 'text-stone-300'
              }`}
            >
              Craftsmanship
            </button>
            <button
              onClick={() => onNavigate('tracking')}
              className="text-amber-200/90 hover:text-amber-300 transition-colors flex items-center gap-1.5"
            >
              <PackageCheck className="w-4 h-4 text-amber-400" />
              <span>Track Order</span>
            </button>
          </nav>

          {/* Search Bar & Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Search Box */}
            <div className="relative hidden sm:block w-48 md:w-64">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search loafers, boots..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="w-full bg-stone-800 text-stone-100 placeholder-stone-400 text-xs pl-9 pr-3 py-2 rounded-full border border-stone-700 focus:outline-none focus:border-amber-500 transition-all"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                {searchQuery && (
                  <X
                    className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5 cursor-pointer"
                    onClick={() => setSearchQuery('')}
                  />
                )}
              </div>

              {/* Live Search Popup */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="p-2 text-[11px] font-semibold text-amber-400 uppercase tracking-wider bg-stone-800/80 border-b border-stone-700">
                    Search Results
                  </div>
                  {searchResults.map(prod => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        onNavigate('product-detail', { productId: prod.id });
                        setSearchQuery('');
                      }}
                      className="p-2.5 hover:bg-stone-800 flex items-center gap-3 cursor-pointer border-b border-stone-800/50 last:border-0"
                    >
                      <img src={prod.mainImage} alt={prod.name} className="w-10 h-10 object-cover rounded" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-medium text-stone-200 truncate">{prod.name}</p>
                        <p className="text-[11px] text-amber-400 font-semibold">
                          ৳{prod.discountPrice || prod.price}
                          {prod.discountPrice && (
                            <span className="text-stone-500 line-through ml-1.5 text-[10px]">৳{prod.price}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div
                    onClick={() => {
                      onNavigate('products', { searchQuery });
                      setSearchQuery('');
                    }}
                    className="p-2 text-center text-xs text-amber-300 bg-amber-950/40 hover:bg-amber-950/80 cursor-pointer font-medium"
                  >
                    View all matching shoes →
                  </div>
                </div>
              )}
            </div>

            {/* AI Advisor Button */}
            <button
              onClick={onOpenAIStylist}
              className="p-2 text-amber-300 hover:text-amber-200 bg-amber-950/50 border border-amber-800/40 hover:bg-amber-900/40 rounded-full transition-all"
              title="AI Footwear Styling Advisor"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('account', { tab: 'wishlist' })}
              className="relative p-2 text-stone-300 hover:text-amber-300 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-stone-300 hover:text-amber-300 transition-colors"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1 right-1 bg-amber-500 text-stone-950 text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-extrabold shadow">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Dropdown */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-stone-800 text-stone-200 text-xs font-medium transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-amber-800/80 text-amber-200 flex items-center justify-center font-bold text-xs uppercase border border-amber-600/50">
                      {user.fullName.charAt(0)}
                    </div>
                    <span className="hidden lg:inline text-stone-300 max-w-[100px] truncate">{user.fullName}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                  </button>

                  {isUserDropdownOpen && (
                    <div
                      onMouseLeave={() => setIsUserDropdownOpen(false)}
                      className="absolute right-0 mt-2 w-52 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl py-2 z-50 text-xs"
                    >
                      <div className="px-4 py-2 border-b border-stone-800">
                        <p className="font-semibold text-stone-200 truncate">{user.fullName}</p>
                        <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded font-mono">
                            ADMIN PERMISSION
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            onNavigate('admin');
                          }}
                          className="w-full text-left px-4 py-2 text-amber-400 hover:bg-stone-800 flex items-center gap-2 font-semibold"
                        >
                          <Compass className="w-4 h-4 text-amber-400" />
                          <span>Admin Dashboard</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          onNavigate('account', { tab: 'orders' });
                        }}
                        className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-800 flex items-center gap-2"
                      >
                        <PackageCheck className="w-4 h-4 text-stone-400" />
                        <span>My Orders</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          onNavigate('account', { tab: 'profile' });
                        }}
                        className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-800 flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-stone-400" />
                        <span>Account Profile</span>
                      </button>

                      <div className="border-t border-stone-800 my-1"></div>

                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          signOut();
                        }}
                        className="w-full text-left px-4 py-2 text-rose-400 hover:bg-stone-800 font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-md"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-stone-950 border-b border-stone-800 px-4 pt-3 pb-6 space-y-3">
          <div className="relative my-2">
            <input
              type="text"
              placeholder="Search Mensvibes footwear..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-stone-900 text-stone-100 placeholder-stone-400 text-xs pl-9 pr-3 py-2.5 rounded-lg border border-stone-800"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          </div>

          <div className="flex flex-col gap-2.5 text-sm font-medium">
            <button
              onClick={() => {
                onNavigate('home');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 border-b border-stone-900 text-stone-200"
            >
              Home Page
            </button>
            <button
              onClick={() => {
                onNavigate('products');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 border-b border-stone-900 text-stone-200"
            >
              All Shoes Collection
            </button>
            <button
              onClick={() => {
                onNavigate('products', { category: 'LOAFERS' });
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 border-b border-stone-900 text-stone-300"
            >
              Loafers Collection
            </button>
            <button
              onClick={() => {
                onNavigate('products', { category: 'PREMIUM CHELSEA' });
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 border-b border-stone-900 text-stone-300"
            >
              Chelsea Boots
            </button>
            <button
              onClick={() => {
                onNavigate('tracking');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 border-b border-stone-900 text-amber-400 flex items-center gap-2"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Track Order Status</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left py-2 text-amber-400 font-semibold"
              >
                Admin Control Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
