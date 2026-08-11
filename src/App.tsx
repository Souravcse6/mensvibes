import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { INITIAL_PRODUCTS } from './data/mockProducts';
import { Product } from './types';

// Components & Pages
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AISizeFinderModal } from './components/AISizeFinderModal';
import { AIStylistModal } from './components/AIStylistModal';
import { AuthModal } from './components/AuthModal';
import { WhatsAppButton } from './components/WhatsAppButton';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { UserAccountPage } from './pages/UserAccountPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { BrandStoryPage } from './pages/BrandStoryPage';

export function AppContent() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<any>({});

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sizeFinderProduct, setSizeFinderProduct] = useState<Product | null>(null);
  const [isSizeFinderOpen, setIsSizeFinderOpen] = useState(false);
  const [isAIStylistOpen, setIsAIStylistOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const navigateTo = (page: string, params: any = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddProduct = (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

  const handleDeleteProduct = (prodId: string) => {
    setProducts(prev => prev.filter(p => p.id !== prodId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950">
      <Navbar
        onNavigate={navigateTo}
        currentPage={currentPage}
        allProducts={products}
        onOpenAIStylist={() => setIsAIStylistOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      <main className="flex-grow">
        {currentPage === 'home' && (
          <HomePage
            allProducts={products}
            onNavigate={navigateTo}
            onSelectProduct={prod => setSelectedProduct(prod)}
            onOpenAIStylist={() => setIsAIStylistOpen(true)}
            onOpenAISizeFinder={prod => {
              setSizeFinderProduct(prod);
              setIsSizeFinderOpen(true);
            }}
          />
        )}

        {currentPage === 'products' && (
          <ProductsPage
            allProducts={products}
            initialCategory={pageParams.category}
            initialSearch={pageParams.searchQuery}
            onSelectProduct={prod => setSelectedProduct(prod)}
            onOpenAISizeFinder={prod => {
              setSizeFinderProduct(prod);
              setIsSizeFinderOpen(true);
            }}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage onNavigate={navigateTo} />
        )}

        {currentPage === 'tracking' && (
          <OrderTrackingPage
            initialTrackingNumber={pageParams.trackingNumber}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'account' && (
          <UserAccountPage
            initialTab={pageParams.tab || 'orders'}
            onNavigate={navigateTo}
            onSelectProduct={prod => setSelectedProduct(prod)}
            onOpenAISizeFinder={prod => {
              setSizeFinderProduct(prod);
              setIsSizeFinderOpen(true);
            }}
          />
        )}

        {currentPage === 'admin' && (
          <AdminDashboard
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {currentPage === 'story' && (
          <BrandStoryPage onNavigate={navigateTo} />
        )}
      </main>

      <Footer onNavigate={navigateTo} />

      {/* Cart Slide-Over Drawer */}
      <CartDrawer onNavigateToCheckout={() => navigateTo('checkout')} />

      {/* Product Quick View & Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOpenAISizeFinder={prod => {
            setSizeFinderProduct(prod);
            setIsSizeFinderOpen(true);
          }}
          onExpressCheckout={(prod, size, color, qty) => {
            setSelectedProduct(null);
            navigateTo('checkout');
          }}
        />
      )}

      {/* AI Size Finder Modal */}
      {isSizeFinderOpen && (
        <AISizeFinderModal
          product={sizeFinderProduct || undefined}
          onClose={() => setIsSizeFinderOpen(false)}
        />
      )}

      {/* AI Personal Shoe Stylist Modal */}
      {isAIStylistOpen && (
        <AIStylistModal
          allProducts={products}
          onClose={() => setIsAIStylistOpen(false)}
          onSelectProduct={prod => setSelectedProduct(prod)}
        />
      )}

      {/* User Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}

      {/* Floating Direct WhatsApp Connect Button */}
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
