import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Search, PackageCheck, CheckCircle, Clock, Truck, Home, MapPin, FileText, Download } from 'lucide-react';
import { InvoiceModal } from '../components/InvoiceModal';
import { Order } from '../types';
import { generateInvoicePDF } from '../utils/generateInvoicePDF';

interface OrderTrackingPageProps {
  initialTrackingNumber?: string;
  onNavigate: (page: string, params?: any) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialTrackingNumber,
  onNavigate,
}) => {
  const { orders } = useCart();
  const [searchQuery, setSearchQuery] = useState(initialTrackingNumber || '');
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);

  // Find order by tracking number or order number
  const matchedOrder = orders.find(
    o =>
      o.trackingNumber.toUpperCase() === searchQuery.trim().toUpperCase() ||
      o.orderNumber.toUpperCase() === searchQuery.trim().toUpperCase()
  ) || orders[0];

  const steps = [
    { title: 'Order Placed', status: 'confirmed', date: matchedOrder?.createdAt ? new Date(matchedOrder.createdAt).toLocaleDateString() : 'Today' },
    { title: 'Leather Quality Inspection', status: 'processing', date: 'In Progress' },
    { title: 'Handmade Sole Assembly', status: 'shipped', date: 'Expected Tomorrow' },
    { title: 'Out For Express Delivery', status: 'shipped', date: 'Courier En Route' },
    { title: 'Delivered', status: 'delivered', date: 'Expected 2-3 Days' },
  ];

  return (
    <div className="bg-stone-950 text-stone-100 min-h-screen py-10 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">EXPRESS LOGISTICS</span>
          <h1 className="text-3xl font-serif font-bold text-amber-100 mt-1">Live Order Status Tracker</h1>
          <p className="text-xs text-stone-400 mt-1">
            Track your Mensvibes footwear shipment from our Fortune Mall, Malibag atelier to your door.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Order # (e.g. MV-123456) or Tracking Code..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-3 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
              <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3.5" />
            </div>
          </div>
        </div>

        {matchedOrder ? (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">ACTIVE SHIPMENT</span>
                <h2 className="text-xl font-serif font-bold text-amber-100">Order #{matchedOrder.orderNumber}</h2>
                <p className="text-xs text-stone-400 mt-0.5">Tracking ID: <strong className="text-stone-200 font-mono">{matchedOrder.trackingNumber}</strong></p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => generateInvoicePDF(matchedOrder)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Order Invoice PDF</span>
                </button>

                <button
                  onClick={() => setActiveInvoiceOrder(matchedOrder)}
                  className="bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-800 px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Preview Invoice</span>
                </button>

                <div className="bg-stone-950 px-4 py-2 rounded-xl border border-stone-800 text-right">
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">Estimated Arrival</span>
                  <span className="text-xs font-bold text-emerald-400">2-3 Business Days</span>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="py-4">
              <h3 className="text-xs font-bold text-amber-200 uppercase tracking-wider mb-6">Delivery Progress Timeline</h3>
              <div className="relative space-y-6 before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-800">
                {steps.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-400 flex items-center justify-center text-xs font-bold z-10 shrink-0">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-100">{step.title}</h4>
                      <p className="text-[11px] text-stone-400">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recipient details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-800 text-xs">
              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Recipient Info</span>
                <p className="font-bold text-stone-200">{matchedOrder.customerName}</p>
                <p className="text-stone-400">{matchedOrder.customerPhone}</p>
                <p className="text-stone-400">{matchedOrder.customerEmail}</p>
              </div>

              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>Destination Address</span>
                </span>
                <p className="text-stone-300">{matchedOrder.shippingAddress.streetAddress}</p>
                <p className="text-stone-400">{matchedOrder.shippingAddress.city}, {matchedOrder.shippingAddress.postalCode}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-stone-900 rounded-2xl border border-stone-800">
            <p className="text-sm font-bold text-stone-300">No order matches search term.</p>
          </div>
        )}

        {/* Invoice PDF Modal */}
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
