import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product, WishlistItem, Coupon, Order } from '../types';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface CartContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  orders: Order[];
  appliedCoupon: Coupon | null;
  addToCart: (product: Product, size: number, color?: string, quantity?: number) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
  getCartSubtotal: () => number;
  getCartDiscount: () => number;
  getCartTotal: () => number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const VALID_COUPONS: Coupon[] = [
  { code: 'MENSVIBES10', discountPercentage: 10, minOrderAmount: 2000 },
  { code: 'LEATHER15', discountPercentage: 15, minOrderAmount: 3500 },
  { code: 'WELCOME500', discountPercentage: 20, maxDiscount: 500 },
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mensvibes_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('mensvibes_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('mensvibes_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Save state to LocalStorage
  useEffect(() => {
    localStorage.setItem('mensvibes_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('mensvibes_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('mensvibes_orders', JSON.stringify(orders));
  }, [orders]);

  // Optionally load/sync from Supabase if user logged in
  useEffect(() => {
    if (user && isSupabaseConfigured) {
      async function syncUserData() {
        try {
          const { data: dbOrders } = await supabase
            .from('orders')
            .select('*')
            .or(`user_id.eq.${user.id},guest_email.eq.${user.email}`)
            .order('created_at', { ascending: false });

          if (dbOrders && dbOrders.length > 0) {
            // merge orders
            const mappedOrders: Order[] = dbOrders.map(o => ({
              id: o.id,
              orderNumber: o.order_number,
              userId: o.user_id,
              customerName: o.guest_name || user.fullName,
              customerPhone: o.guest_phone || user.phone || '',
              customerEmail: o.guest_email || user.email,
              shippingAddress: o.shipping_address,
              items: [],
              subtotal: Number(o.total_amount) - Number(o.delivery_fee),
              discountAmount: Number(o.discount_amount || 0),
              deliveryFee: Number(o.delivery_fee || 100),
              totalAmount: Number(o.total_amount),
              paymentMethod: o.payment_method,
              paymentStatus: o.payment_status,
              orderStatus: o.order_status,
              trackingNumber: o.tracking_number || 'TRK-' + o.id.substring(0, 8),
              createdAt: o.created_at,
              updatedAt: o.updated_at,
            }));
            setOrders(mappedOrders);
          }
        } catch (err) {
          console.warn('Supabase sync notice:', err);
        }
      }
      syncUserData();
    }
  }, [user]);

  const addToCart = (product: Product, size: number, color?: string, quantity: number = 1) => {
    const selectedColor = color || product.colors[0] || 'Standard';
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.productId === product.id && item.size === size && item.color === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: product.id,
        product,
        size,
        color: selectedColor,
        quantity,
      };
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.productId === product.id);
      if (exists) {
        return prev.filter(item => item.productId !== product.id);
      } else {
        const newItem: WishlistItem = {
          id: `wish-${Date.now()}`,
          productId: product.id,
          product,
          addedAt: new Date().toISOString(),
        };
        return [...prev, newItem];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.productId === productId);
  };

  const applyCoupon = (code: string) => {
    const coupon = VALID_COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code.' };
    }
    const subtotal = getCartSubtotal();
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return { success: false, message: `Coupon requires minimum order of ৳${coupon.minOrderAmount}` };
    }
    setAppliedCoupon(coupon);
    return { success: true, message: `Coupon ${coupon.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product.discountPrice ?? item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartDiscount = () => {
    const subtotal = getCartSubtotal();
    if (!appliedCoupon) return 0;
    let discount = (subtotal * appliedCoupon.discountPercentage) / 100;
    if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
      discount = appliedCoupon.maxDiscount;
    }
    return discount;
  };

  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    const discount = getCartDiscount();
    const delivery = subtotal > 0 ? 100 : 0; // ৳100 shipping fee
    return Math.max(0, subtotal - discount + delivery);
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);

    // Async push to Supabase if available
    if (isSupabaseConfigured) {
      supabase.from('orders').insert({
        order_number: order.orderNumber,
        user_id: user?.id || null,
        guest_email: order.customerEmail,
        guest_name: order.customerName,
        guest_phone: order.customerPhone,
        shipping_address: order.shippingAddress,
        total_amount: order.totalAmount,
        discount_amount: order.discountAmount,
        delivery_fee: order.deliveryFee,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus,
        order_status: order.orderStatus,
        tracking_number: order.trackingNumber,
      }).then(({ error }) => {
        if (error) console.warn('Supabase insert order error:', error);
      });
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, orderStatus: status, updatedAt: new Date().toISOString() } : o))
    );

    if (isSupabaseConfigured) {
      supabase.from('orders').update({
        order_status: status,
        updated_at: new Date().toISOString(),
      }).eq('id', orderId).then(() => {});
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        orders,
        appliedCoupon,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        addOrder,
        updateOrderStatus,
        getCartSubtotal,
        getCartDiscount,
        getCartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
