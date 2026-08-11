import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PaymentMethod, Order } from '../types';
import { ShieldCheck, Truck, CreditCard, ArrowRight, CheckCircle2, Copy, Sparkles, Loader2 } from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const {
    cart,
    clearCart,
    getCartSubtotal,
    getCartDiscount,
    getCartTotal,
    addOrder,
    appliedCoupon,
  } = useCart();

  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [streetAddress, setStreetAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || 'Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [postalCode, setPostalCode] = useState(user?.postalCode || '1213');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [bkashTrxId, setBkashTrxId] = useState('');
  
  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState(user?.fullName || '');

  // SSLCommerz state
  const [sslBank, setSslBank] = useState<'visa_master' | 'nagad' | 'rocket' | 'city_bank'>('visa_master');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const deliveryFee = subtotal >= 3000 ? 0 : 100;
  const total = getCartTotal();

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (paymentMethod === 'bkash' && !bkashTrxId.trim()) {
      alert('Please enter your 10-character bKash Transaction ID (TrxID) to verify payment.');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber || !cardExpiry || !cardCvv) {
        alert('Please complete all Credit/Debit card details.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const orderNumber = 'MV-' + Math.floor(100000 + Math.random() * 900000);
      const trackingNumber = 'TRK-BD-' + Math.floor(10000000 + Math.random() * 90000000);

      const orderItems = cart.map(item => ({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.mainImage,
        size: item.size,
        color: item.color,
        unitPrice: item.product.discountPrice ?? item.product.price,
        quantity: item.quantity,
        subtotal: (item.product.discountPrice ?? item.product.price) * item.quantity,
      }));

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        userId: user?.id,
        customerName: fullName,
        customerPhone: phone,
        customerEmail: email,
        shippingAddress: {
          fullName,
          phone,
          email,
          streetAddress,
          city,
          district,
          postalCode,
        },
        items: orderItems,
        subtotal,
        discountAmount: discount,
        deliveryFee,
        totalAmount: total,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
        orderStatus: 'confirmed',
        trackingNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Call API Endpoint
      await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder, paymentMethod }),
      });

      addOrder(newOrder);
      setPlacedOrder(newOrder);
      clearCart();
    } catch (err) {
      console.error('Order creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="bg-stone-950 text-stone-100 min-h-screen py-12 flex items-center justify-center px-4 font-sans">
        <div className="max-w-xl w-full bg-stone-900 border border-stone-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs uppercase font-bold text-amber-400 tracking-widest block">ORDER CONFIRMED</span>
            <h1 className="text-2xl font-serif font-bold text-amber-100 mt-1">Thank You For Your Order!</h1>
            <p className="text-xs text-stone-400 mt-1">
              Your handcrafted Mensvibes footwear pair is being prepared by our master artisans.
            </p>
          </div>

          {/* Receipt Info */}
          <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 text-left text-xs space-y-2">
            <div className="flex justify-between border-b border-stone-800 pb-2">
              <span className="text-stone-400">Order Number:</span>
              <span className="font-mono font-bold text-amber-300">{placedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between border-b border-stone-800 pb-2">
              <span className="text-stone-400">Tracking Code:</span>
              <span className="font-mono font-bold text-stone-200">{placedOrder.trackingNumber}</span>
            </div>
            <div className="flex justify-between border-b border-stone-800 pb-2">
              <span className="text-stone-400">Customer:</span>
              <span className="font-semibold text-stone-200">{placedOrder.customerName} ({placedOrder.customerPhone})</span>
            </div>
            <div className="flex justify-between border-b border-stone-800 pb-2">
              <span className="text-stone-400">Payment Method:</span>
              <span className="font-semibold text-amber-400 uppercase">{placedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-bold text-amber-200">
              <span>Total Paid:</span>
              <span>৳{placedOrder.totalAmount}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate('tracking', { trackingNumber: placedOrder.trackingNumber })}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Track Order Real-Time
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs rounded-xl transition-all"
            >
              Back To Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-950 text-stone-100 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">SECURE CHECKOUT</span>
          <h1 className="text-3xl font-serif font-bold text-amber-100 mt-1">Express Order & Payment</h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Customer & Delivery details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Address Box */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-serif font-bold text-amber-200 border-b border-stone-800 pb-2">
                1. Delivery Address & Recipient
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="01700-000000"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-300 font-medium mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-300 font-medium mb-1">Street / House / Area Address *</label>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={e => setStreetAddress(e.target.value)}
                    placeholder="House #12, Road #4, Sector 7, Uttara"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">City / Division *</label>
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barisal">Barisal</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-serif font-bold text-amber-200 border-b border-stone-800 pb-2">
                2. Select Payment Option
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* bKash */}
                <div
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'bkash'
                      ? 'bg-amber-950/60 border-amber-500 text-amber-200'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-sm mb-1">
                    <span>bKash Mobile Money</span>
                    <span className="bg-pink-900/80 text-pink-200 text-[10px] px-2 py-0.5 rounded font-mono">bKash</span>
                  </div>
                  <p className="text-[11px] text-stone-400">Send Money / Merchant Payment</p>
                </div>

                {/* SSLCommerz */}
                <div
                  onClick={() => setPaymentMethod('sslcommerz')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'sslcommerz'
                      ? 'bg-amber-950/60 border-amber-500 text-amber-200'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-sm mb-1">
                    <span>SSLCommerz Gateway</span>
                    <span className="bg-blue-900/80 text-blue-200 text-[10px] px-2 py-0.5 rounded font-mono">SSL</span>
                  </div>
                  <p className="text-[11px] text-stone-400">Cards & Mobile Banking</p>
                </div>

                {/* Card */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-amber-950/60 border-amber-500 text-amber-200'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-sm mb-1">
                    <span>Credit / Debit Card</span>
                    <CreditCard className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-[11px] text-stone-400">Visa / Mastercard</p>
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'bg-amber-950/60 border-amber-500 text-amber-200'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-sm mb-1">
                    <span>Cash On Delivery (COD)</span>
                    <Truck className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-[11px] text-stone-400">Pay when shoes arrive at doorstep</p>
                </div>
              </div>

              {/* bKash instructions */}
              {paymentMethod === 'bkash' && (
                <div className="p-4 bg-stone-950 border border-emerald-500/40 rounded-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between text-emerald-300 font-bold">
                    <span>bKash Merchant Account: 01721605677</span>
                    <span className="text-[10px] bg-pink-950 text-pink-300 px-2.5 py-0.5 rounded border border-pink-700/60 font-mono">
                      bKash Payment Active
                    </span>
                  </div>
                  <p className="text-stone-300 text-[11px] leading-relaxed">
                    1. Open your bKash App or dial *247#.<br />
                    2. Select <strong>Make Payment</strong> to Merchant <strong>01721605677</strong>.<br />
                    3. Enter total amount <strong>৳{total}</strong> and Reference 'MENSVIBES'.<br />
                    4. Enter your bKash PIN to confirm transaction.<br />
                    5. Paste the 10-character bKash Transaction ID (TrxID) below:
                  </p>
                  <div>
                    <label className="block text-emerald-300 font-bold mb-1">bKash Transaction ID (TrxID) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9J87A2B4X1"
                      value={bkashTrxId}
                      onChange={e => setBkashTrxId(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-emerald-300 font-mono focus:outline-none focus:border-emerald-500 uppercase font-bold tracking-widest text-sm"
                    />
                  </div>
                </div>
              )}

              {/* SSLCommerz Gateway Options */}
              {paymentMethod === 'sslcommerz' && (
                <div className="p-4 bg-stone-950 border border-blue-500/40 rounded-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between text-blue-300 font-bold">
                    <span>SSLCommerz Multi-Gateway Gateway</span>
                    <span className="text-[10px] bg-blue-950 text-blue-200 px-2 py-0.5 rounded border border-blue-700 font-mono">
                      Secure 256-bit SSL
                    </span>
                  </div>
                  <p className="text-stone-300 text-[11px]">
                    Select your preferred bank or payment portal. You will be seamlessly routed through SSLCommerz:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {[
                      { id: 'visa_master', name: 'VISA / Mastercard', bg: 'bg-blue-950/80 border-blue-600' },
                      { id: 'nagad', name: 'Nagad Wallet', bg: 'bg-orange-950/80 border-orange-600' },
                      { id: 'rocket', name: 'DBBL Rocket', bg: 'bg-purple-950/80 border-purple-600' },
                      { id: 'city_bank', name: 'City Bank Amex', bg: 'bg-cyan-950/80 border-cyan-600' },
                    ].map(bank => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setSslBank(bank.id as any)}
                        className={`p-2.5 rounded-lg border text-center transition-all ${
                          sslBank === bank.id
                            ? `${bank.bg} text-white font-bold ring-1 ring-blue-400`
                            : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        <span className="block text-[11px]">{bank.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Credit / Debit Card Details */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-stone-950 border border-amber-800/60 rounded-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between text-amber-300 font-bold">
                    <span>Cardholder Details</span>
                    <span className="text-[10px] bg-amber-950 px-2 py-0.5 rounded border border-amber-700">
                      Visa / Mastercard / Amex
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-stone-400 text-[11px] mb-0.5">Card Number</label>
                      <input
                        type="text"
                        placeholder="4532 •••• •••• 8892"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-stone-100 font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-stone-400 text-[11px] mb-0.5">Expiry Date (MM/YY)</label>
                        <input
                          type="text"
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-stone-100 font-mono focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 text-[11px] mb-0.5">CVV / CVC</label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="•••"
                          value={cardCvv}
                          onChange={e => setCardCvv(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-stone-100 font-mono focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-400 text-[11px] mb-0.5">Name on Card</label>
                      <input
                        type="text"
                        placeholder="e.g. Tanvir Ahmed"
                        value={cardHolder}
                        onChange={e => setCardHolder(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Cash on delivery instructions */}
              {paymentMethod === 'cash_on_delivery' && (
                <div className="p-4 bg-stone-950 border border-amber-800/60 rounded-xl space-y-1 text-xs">
                  <span className="font-bold text-amber-300 block">Cash On Delivery (Doorstep Payment)</span>
                  <p className="text-stone-400 text-[11px] leading-relaxed">
                    Pay the exact amount <strong>৳{total}</strong> in cash to the courier representative when your Mensvibes package arrives. You may inspect shoe craftsmanship upon receipt.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-serif font-bold text-amber-200 border-b border-stone-800 pb-2">
                Order Summary ({cart.length} Items)
              </h3>

              <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3 text-xs pb-3 border-b border-stone-800/60 last:border-0">
                    <img src={item.product.mainImage} alt={item.product.name} className="w-14 h-14 object-cover rounded-lg bg-stone-950" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-stone-200 line-clamp-1">{item.product.name}</h4>
                      <p className="text-[11px] text-stone-400">
                        Size: EU {item.size === 0 ? 'OS' : item.size} • Qty: {item.quantity}
                      </p>
                      <p className="font-bold text-amber-400 mt-0.5">
                        ৳{(item.product.discountPrice ?? item.product.price) * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 pt-2 border-t border-stone-800 text-xs text-stone-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>৳{subtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-৳{discount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Nationwide Express Delivery</span>
                  <span>{deliveryFee === 0 ? <span className="text-emerald-400">FREE</span> : '৳100'}</span>
                </div>

                <div className="flex justify-between text-base font-bold text-amber-200 pt-2 border-t border-stone-800">
                  <span>Total Payable Amount</span>
                  <span className="text-amber-300 font-serif">৳{total}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
