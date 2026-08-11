import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Product, Order } from '../types';
import { ProductCard } from '../components/ProductCard';
import { User, PackageCheck, Heart, MapPin, LogOut, Check, FileText, Download } from 'lucide-react';
import { InvoiceModal } from '../components/InvoiceModal';
import { generateInvoicePDF } from '../utils/generateInvoicePDF';

interface UserAccountPageProps {
  initialTab?: 'orders' | 'profile' | 'wishlist';
  onNavigate: (page: string, params?: any) => void;
  onSelectProduct: (product: Product) => void;
  onOpenAISizeFinder: (product: Product) => void;
}

export const UserAccountPage: React.FC<UserAccountPageProps> = ({
  initialTab = 'orders',
  onNavigate,
  onSelectProduct,
  onOpenAISizeFinder,
}) => {
  const { user, signOut, updateProfile } = useAuth();
  const { orders, wishlist } = useCart();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'wishlist'>(initialTab);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);

  // Profile Form state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ fullName, phone, address, city });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="bg-stone-950 text-stone-100 min-h-screen py-10 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-800/80 text-amber-200 flex items-center justify-center font-serif font-bold text-2xl border border-amber-600">
              {user?.fullName.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-amber-100">{user?.fullName || 'Customer Profile'}</h1>
              <p className="text-xs text-stone-400">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={signOut}
            className="px-4 py-2 bg-stone-950 hover:bg-rose-950 text-rose-400 border border-stone-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-800 mb-8 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'wishlist'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Wishlist ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Address & Details</span>
          </button>
        </div>

        {/* Tab 1: Orders History */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-stone-900 rounded-2xl border border-stone-800 space-y-3">
                <p className="text-sm font-bold text-stone-300">You haven't placed any orders yet.</p>
                <button
                  onClick={() => onNavigate('products')}
                  className="px-5 py-2.5 bg-amber-500 text-stone-950 font-bold text-xs rounded-full"
                >
                  Explore Footwear Catalog
                </button>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="p-6 bg-stone-900 border border-stone-800 rounded-2xl space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-800 text-xs gap-2">
                    <div>
                      <span className="font-bold text-amber-300 text-sm">Order #{order.orderNumber}</span>
                      <span className="text-stone-500 ml-3">Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded-full font-bold uppercase text-[10px]">
                        {order.orderStatus}
                      </span>
                      <button
                        onClick={() => generateInvoicePDF(order)}
                        className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-full font-extrabold text-[11px] flex items-center gap-1 transition-all shadow"
                        title="Download PDF Invoice with jsPDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF Invoice</span>
                      </button>
                      <button
                        onClick={() => setActiveInvoiceOrder(order)}
                        className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700/80 rounded-full font-bold text-[11px] flex items-center gap-1 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-300" />
                        <span>View Invoice</span>
                      </button>
                      <button
                        onClick={() => onNavigate('tracking', { trackingNumber: order.trackingNumber })}
                        className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-full font-bold text-[11px]"
                      >
                        Track Status
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center gap-3 text-xs">
                        <img src={item.productImage} alt={item.productName} className="w-12 h-12 object-cover rounded bg-stone-950" />
                        <div className="flex-1">
                          <p className="font-semibold text-stone-200">{item.productName}</p>
                          <p className="text-[11px] text-stone-500">Size: EU {item.size} • Qty: {item.quantity}</p>
                        </div>
                        <span className="font-bold text-amber-400">৳{item.subtotal}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                    <span className="text-stone-400">Total Paid: <strong className="text-amber-200 font-serif text-sm">৳{order.totalAmount}</strong></span>
                    <span className="text-stone-400 uppercase">Payment: {order.paymentMethod}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlist.length === 0 ? (
              <div className="text-center py-12 bg-stone-900 rounded-2xl border border-stone-800 space-y-3">
                <p className="text-sm font-bold text-stone-300">Your wishlist is empty.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlist.map(item => (
                  <ProductCard
                    key={item.id}
                    product={item.product}
                    onSelectProduct={onSelectProduct}
                    onOpenAISizeFinder={onOpenAISizeFinder}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Profile Form */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4 max-w-2xl text-xs">
            <h3 className="text-base font-serif font-bold text-amber-200 border-b border-stone-800 pb-2">
              Shipping Address & Personal Info
            </h3>

            <div>
              <label className="block text-stone-300 font-medium mb-1">Full Name:</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">Phone Number:</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">Default Delivery Address:</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-medium mb-1">City:</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl flex items-center gap-2 transition-all shadow"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Profile Saved!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </form>
        )}

        {/* Invoice Modal */}
        {activeInvoiceOrder && (
          <InvoiceModal
            order={activeInvoiceOrder}
            onClose={() => setActiveInvoiceOrder(null)}
          />
        )}
      </div>
    </div>
  );
};
