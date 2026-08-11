import React, { useState } from 'react';
import { Product, Order, ShoeCategory } from '../types';
import { useCart } from '../context/CartContext';
import { Plus, Database, Edit, Trash2, CheckCircle2, TrendingUp, Package, Users, DollarSign, X } from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (prod: Product) => void;
  onUpdateProduct: (prod: Product) => void;
  onDeleteProduct: (prodId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const { orders, updateOrderStatus } = useCart();
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'sql'>('analytics');

  // New Product Modal state
  const [isAddModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ShoeCategory>('LOAFERS');
  const [newProdPrice, setNewProdPrice] = useState('3899');
  const [newProdDiscount, setNewProdDiscount] = useState('1999');
  const [newProdImage, setNewProdImage] = useState('https://cit-node.blr1.cdn.digitaloceanspaces.com/feet_plus_image/de205a9f-4d84-4ec5-8b6b-8ae7ddf925ed-HandMade-Black.jpeg');
  const [newProdMaterial, setNewProdMaterial] = useState('A-Grade Cow Leather');
  const [newProdDescription, setNewProdDescription] = useState('Handcrafted luxury footwear with Goodyear welted handmade sole.');

  // Edit Product Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleUpdateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct(editingProduct);
      setEditingProduct(null);
    }
  };
  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = orders.length;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      slug: newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newProdCategory,
      categorySlug: newProdCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: Number(newProdPrice),
      discountPrice: newProdDiscount ? Number(newProdDiscount) : undefined,
      mainImage: newProdImage,
      sizes: [39, 40, 41, 42, 43, 44],
      colors: ['Black', 'Choco'],
      material: newProdMaterial,
      soleType: 'Handmade Sole',
      description: newProdDescription,
      isFeatured: true,
      stockQuantity: 50,
      rating: 5.0,
      totalReviews: 1,
    };

    onAddProduct(created);
    setIsAddProductModalOpen(false);
    setNewProdName('');
  };

  return (
    <div className="bg-stone-950 text-stone-100 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">ADMINISTRATION PANEL</span>
            <h1 className="text-3xl font-serif font-bold text-amber-100 mt-1">Mensvibes Store Console</h1>
          </div>

          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Footwear Pair</span>
          </button>
        </div>

        {/* Console Nav Tabs */}
        <div className="flex border-b border-stone-800 mb-8 text-xs font-bold">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 px-5 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Sales Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-5 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'products'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-5 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Live Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-3 px-5 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'sql'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase DDL Schema</span>
          </button>
        </div>

        {/* Tab 1: Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-stone-900 border border-stone-800 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between text-stone-400 mb-2 text-xs">
                  <span>Total Sales Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-amber-200 font-serif">৳{totalRevenue.toLocaleString()}</div>
                <p className="text-[11px] text-emerald-400 mt-1">Live Supabase / Express metrics</p>
              </div>

              <div className="p-6 bg-stone-900 border border-stone-800 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between text-stone-400 mb-2 text-xs">
                  <span>Total Orders Processed</span>
                  <Package className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-stone-100 font-serif">{totalOrdersCount}</div>
                <p className="text-[11px] text-stone-500 mt-1">Active customer orders</p>
              </div>

              <div className="p-6 bg-stone-900 border border-stone-800 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between text-stone-400 mb-2 text-xs">
                  <span>Catalog Product Models</span>
                  <Package className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-extrabold text-stone-100 font-serif">{products.length}</div>
                <p className="text-[11px] text-stone-500 mt-1">Footwear & Wallets</p>
              </div>

              <div className="p-6 bg-stone-900 border border-stone-800 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between text-stone-400 mb-2 text-xs">
                  <span>System Status</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xl font-bold text-emerald-400 font-mono mt-1">ONLINE 100%</div>
                <p className="text-[11px] text-stone-500 mt-1">Supabase & Gemini Engine</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products Inventory */}
        {activeTab === 'products' && (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950 text-stone-400 uppercase tracking-wider border-b border-stone-800 text-[10px]">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Material</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {products.map(prod => (
                    <tr key={prod.id} className="hover:bg-stone-800/50">
                      <td className="p-4 flex items-center gap-3">
                        <img src={prod.mainImage} alt={prod.name} className="w-10 h-10 object-cover rounded bg-stone-950" />
                        <span className="font-semibold text-stone-200 max-w-xs truncate">{prod.name}</span>
                      </td>
                      <td className="p-4 text-amber-400 font-bold">{prod.category}</td>
                      <td className="p-4 font-bold text-stone-200">৳{prod.discountPrice || prod.price}</td>
                      <td className="p-4 text-stone-400">{prod.material}</td>
                      <td className="p-4 font-bold text-emerald-400">{prod.stockQuantity} Pairs</td>
                      <td className="p-4 text-right flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingProduct({ ...prod })}
                          className="p-1.5 text-stone-400 hover:text-amber-300 transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(prod.id)}
                          className="p-1.5 text-stone-500 hover:text-rose-400 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Orders List */}
        {activeTab === 'orders' && (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950 text-stone-400 uppercase tracking-wider border-b border-stone-800 text-[10px]">
                  <tr>
                    <th className="p-4">Order #</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-stone-800/50">
                      <td className="p-4 font-mono font-bold text-amber-300">{o.orderNumber}</td>
                      <td className="p-4">
                        <p className="font-bold text-stone-200">{o.customerName}</p>
                        <p className="text-[10px] text-stone-500">{o.customerPhone}</p>
                      </td>
                      <td className="p-4 uppercase font-bold text-amber-400">{o.paymentMethod}</td>
                      <td className="p-4 font-bold text-stone-200">৳{o.totalAmount}</td>
                      <td className="p-4">
                        <select
                          value={o.orderStatus}
                          onChange={e => updateOrderStatus(o.id, e.target.value as any)}
                          className="bg-stone-950 border border-stone-800 text-amber-300 rounded px-2 py-1 text-xs font-bold"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: SQL Schema Export */}
        {activeTab === 'sql' && (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-serif font-bold text-amber-200 text-base">Supabase PostgreSQL Database Schema</h3>
            <p className="text-xs text-stone-400">
              Run this SQL script in your Supabase SQL Editor (`https://qvsowbbtycnrapxctnuh.supabase.co`) to setup all required relational tables.
            </p>
            <pre className="p-4 bg-stone-950 border border-stone-800 rounded-xl font-mono text-[11px] text-stone-300 overflow-x-auto max-h-96">
{`-- MENSVIBES SUPABASE DDL
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer'
);

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL NOT NULL,
  discount_price DECIMAL,
  main_image TEXT NOT NULL,
  category TEXT NOT NULL
);

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  total_amount DECIMAL NOT NULL,
  payment_method TEXT NOT NULL,
  order_status TEXT DEFAULT 'pending'
);`}
            </pre>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl text-stone-100 text-xs space-y-4">
            <button
              onClick={() => setIsAddProductModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-stone-950 text-stone-400 hover:text-white rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-serif font-bold text-amber-200">Add New Footwear Pair</h3>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Shoe Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Italian Double Monk Loafer"
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Category *</label>
                  <select
                    value={newProdCategory}
                    onChange={e => setNewProdCategory(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100"
                  >
                    <option value="LOAFERS">LOAFERS</option>
                    <option value="PREMIUM CHELSEA">PREMIUM CHELSEA</option>
                    <option value="CHELSEA BOOT">CHELSEA BOOT</option>
                    <option value="PREMIUM SHOES">PREMIUM SHOES</option>
                    <option value="CHANKY SHOES">CHANKY SHOES</option>
                    <option value="Men's Wallet">Men's Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Regular Price (৳) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={e => setNewProdPrice(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Discount Offer Price (৳)</label>
                <input
                  type="number"
                  value={newProdDiscount}
                  onChange={e => setNewProdDiscount(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Image CDN URL *</label>
                <input
                  type="text"
                  required
                  value={newProdImage}
                  onChange={e => setNewProdImage(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow"
              >
                Save & Publish Item
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl text-stone-100 text-xs space-y-4">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 p-2 bg-stone-950 text-stone-400 hover:text-white rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-serif font-bold text-amber-200">Edit Footwear Pair Details</h3>

            <form onSubmit={handleUpdateProductSubmit} className="space-y-3">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Shoe Title / Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Category *</label>
                  <select
                    value={editingProduct.category}
                    onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100"
                  >
                    <option value="LOAFERS">LOAFERS</option>
                    <option value="PREMIUM CHELSEA">PREMIUM CHELSEA</option>
                    <option value="CHELSEA BOOT">CHELSEA BOOT</option>
                    <option value="PREMIUM SHOES">PREMIUM SHOES</option>
                    <option value="CHANKY SHOES">CHANKY SHOES</option>
                    <option value="Men's Wallet">Men's Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Regular Price (৳) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Discount Offer Price (৳)</label>
                  <input
                    type="number"
                    value={editingProduct.discountPrice || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, discountPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">In Stock Quantity</label>
                  <input
                    type="number"
                    value={editingProduct.stockQuantity}
                    onChange={e => setEditingProduct({ ...editingProduct, stockQuantity: Number(e.target.value) })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Image CDN URL *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.mainImage}
                  onChange={e => setEditingProduct({ ...editingProduct, mainImage: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Leather Material Grade</label>
                <input
                  type="text"
                  value={editingProduct.material}
                  onChange={e => setEditingProduct({ ...editingProduct, material: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl shadow"
              >
                Update & Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
