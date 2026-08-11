import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Truck, ShieldCheck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onNavigateToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigateToCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    getCartSubtotal,
    getCartDiscount,
    getCartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);

  if (!isCartOpen) return null;

  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const total = getCartTotal();
  const freeShippingThreshold = 3000;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    const res = applyCoupon(couponCode);
    setCouponMsg({ success: res.success, text: res.message });
    if (res.success) setCouponCode('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-stone-900 text-stone-100 h-full flex flex-col justify-between shadow-2xl border-l border-stone-800">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif font-bold text-base text-amber-100 uppercase tracking-wider">
              Shopping Bag ({cart.reduce((s, i) => sum => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="bg-stone-950/80 px-4 py-2.5 border-b border-stone-800/80 text-xs">
          <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
            <span className="flex items-center gap-1.5 text-stone-300">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              {subtotal >= freeShippingThreshold ? (
                <span className="text-emerald-400 font-bold">You unlocked FREE Nationwide Delivery!</span>
              ) : (
                <span>
                  Add ৳{freeShippingThreshold - subtotal} more for <strong className="text-amber-300">Free Shipping</strong>
                </span>
              )}
            </span>
            <span className="text-amber-400">{Math.round(freeShippingProgress)}%</span>
          </div>

          <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-600 to-amber-400 h-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-stone-400">
              <div className="w-16 h-16 rounded-full bg-stone-950 border border-stone-800 flex items-center justify-center text-amber-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-stone-200">Your shopping bag is empty</h3>
              <p className="text-xs text-stone-400 max-w-xs">
                Explore our Italian Loafers, Chelsea Boots, and Leather Wallets collection.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-6 py-2.5 bg-amber-500 text-stone-950 font-bold text-xs rounded-full hover:bg-amber-400 transition-colors"
              >
                Browse Collections
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.id}
                className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex gap-3 relative group"
              >
                <img
                  src={item.product.mainImage}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg bg-stone-900"
                />

                <div className="flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-semibold text-stone-100 line-clamp-1 pr-6">{item.product.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-500 hover:text-rose-400 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-[11px] text-stone-400 mt-0.5 space-x-2">
                      <span>Size: <strong className="text-amber-300">{item.size === 0 ? 'OS' : item.size}</strong></span>
                      <span>•</span>
                      <span>Color: <strong className="text-stone-300">{item.color}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-900">
                    <div className="flex items-center border border-stone-800 rounded bg-stone-900">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-stone-400 hover:text-white font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 font-bold text-amber-300 text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-stone-400 hover:text-white font-bold"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-bold text-amber-300">
                      ৳{(item.product.discountPrice ?? item.product.price) * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Summary */}
        {cart.length > 0 && (
          <div className="p-4 bg-stone-950 border-t border-stone-800 space-y-3 text-xs">
            {/* Coupon Promo Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 bg-amber-950/60 border border-amber-800/80 rounded-lg text-amber-300">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon '{appliedCoupon.code}' Active</span>
                  </span>
                  <button onClick={removeCoupon} className="text-xs text-rose-400 underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code (e.g. MENSVIBES10)"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="flex-1 bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 text-xs focus:outline-none focus:border-amber-500 uppercase"
                  />
                  <button
                    type="submit"
                    className="bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold px-3 py-2 rounded-lg"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponMsg && (
                <span
                  className={`text-[10px] mt-1 block font-medium ${
                    couponMsg.success ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {couponMsg.text}
                </span>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 pt-2 border-t border-stone-800/80 text-stone-300">
              <div className="flex justify-between">
                <span>Bag Subtotal</span>
                <span className="font-semibold">৳{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo Discount</span>
                  <span className="font-semibold">-৳{discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Nationwide Express Delivery</span>
                <span className="font-semibold">
                  {subtotal >= freeShippingThreshold ? <span className="text-emerald-400">FREE</span> : '৳100'}
                </span>
              </div>

              <div className="flex justify-between text-sm font-bold text-amber-200 pt-2 border-t border-stone-800">
                <span>Estimated Total</span>
                <span className="text-amber-300 text-base font-serif">৳{total}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                onNavigateToCheckout();
              }}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all"
            >
              <span>Proceed To Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
