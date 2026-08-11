import React from 'react';
import { Order } from '../types';
import { X, Printer, Download, CheckCircle2, MapPin, Phone, Mail, ShieldCheck, FileDown } from 'lucide-react';
import { generateInvoicePDF } from '../utils/generateInvoicePDF';
import { BrandLogo } from './BrandLogo';

interface InvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    generateInvoicePDF(order);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      {/* Container - printable section */}
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-8 print:border-none print:shadow-none print:bg-white print:text-black print:p-0">
        
        {/* Action Header bar (hidden in print) */}
        <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between text-stone-100 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-serif font-bold text-sm text-amber-200">Official Mensvibes Tax Invoice</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all"
            >
              <FileDown className="w-4 h-4" />
              <span>Download PDF Invoice</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div id="printable-invoice" className="p-6 sm:p-10 bg-stone-900 text-stone-100 print:bg-white print:text-stone-900 font-sans">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 print:border-stone-300 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <BrandLogo variant="horizontal" size="md" theme="dark" />
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/60 print:bg-emerald-100 print:text-emerald-800 px-2.5 py-0.5 rounded-full font-bold shrink-0">
                  Verified Invoice
                </span>
              </div>
              <p className="text-xs text-stone-400 print:text-stone-600 mt-1 max-w-sm">
                Shop no-33/34/35/36, Level -5, Fortune shopping mall, Mouchk, Malibag, Dhaka, Bangladesh
              </p>
              <p className="text-[11px] text-stone-400 print:text-stone-600 mt-0.5">
                Email: admin.mensvibes@gmail.com | Hotline: +8801721605677
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 print:text-emerald-700 tracking-widest block">
                INVOICE NUMBER
              </span>
              <h2 className="text-xl font-mono font-bold text-stone-100 print:text-stone-900">
                INV-{order.orderNumber}
              </h2>
              <p className="text-xs text-stone-400 print:text-stone-600">
                Date: {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 text-xs">
            <div className="p-4 bg-stone-950/80 print:bg-stone-100 rounded-xl border border-stone-800 print:border-stone-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-amber-400 print:text-emerald-700 tracking-wider block">
                BILLED TO (CUSTOMER)
              </span>
              <p className="font-bold text-stone-200 print:text-stone-900 text-sm">{order.customerName}</p>
              <p className="text-stone-400 print:text-stone-700">{order.customerPhone}</p>
              <p className="text-stone-400 print:text-stone-700">{order.customerEmail}</p>
            </div>

            <div className="p-4 bg-stone-950/80 print:bg-stone-100 rounded-xl border border-stone-800 print:border-stone-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-amber-400 print:text-emerald-700 tracking-wider block">
                DELIVERY DESTINATION
              </span>
              <p className="text-stone-300 print:text-stone-800 font-semibold">{order.shippingAddress.streetAddress}</p>
              <p className="text-stone-400 print:text-stone-700">
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p className="text-stone-400 print:text-stone-700">Bangladesh</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto my-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-950 print:bg-stone-200 text-stone-400 print:text-stone-800 font-bold uppercase text-[10px] border-b border-stone-800 print:border-stone-300">
                  <th className="p-3">Item Description</th>
                  <th className="p-3 text-center">Size</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 print:divide-stone-200">
                {order.items.map(item => (
                  <tr key={item.id} className="text-stone-300 print:text-stone-900">
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-10 h-10 object-cover rounded bg-stone-950 print:hidden"
                      />
                      <div>
                        <span className="font-semibold block">{item.productName}</span>
                        <span className="text-[10px] text-stone-500 print:text-stone-600">A-Grade Cow Leather</span>
                      </div>
                    </td>
                    <td className="p-3 text-center font-mono">EU {item.size}</td>
                    <td className="p-3 text-center font-bold">{item.quantity}</td>
                    <td className="p-3 text-right">৳{item.unitPrice}</td>
                    <td className="p-3 text-right font-bold text-amber-300 print:text-stone-900">
                      ৳{item.subtotal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment & Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start pt-4 border-t border-stone-800 print:border-stone-300 gap-6 text-xs">
            <div className="space-y-1.5 bg-stone-950/60 print:bg-stone-50 p-4 rounded-xl border border-stone-800 print:border-stone-200 max-w-sm w-full">
              <span className="text-[10px] font-bold text-amber-400 print:text-emerald-700 uppercase tracking-wider block">
                PAYMENT STATUS
              </span>
              <p className="text-stone-300 print:text-stone-800">
                Method: <strong className="uppercase font-bold">{order.paymentMethod}</strong>
              </p>
              {order.paymentMethod === 'bkash' && (
                <p className="text-emerald-400 print:text-emerald-800 font-mono text-[11px]">
                  Verified bKash Merchant TrxID: 01721605677
                </p>
              )}
              <div className="inline-block mt-2 px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-700/60 print:bg-emerald-100 print:text-emerald-800 rounded-lg text-[11px] font-bold uppercase">
                Status: {order.orderStatus}
              </div>
            </div>

            <div className="space-y-2 w-full sm:w-64 text-stone-300 print:text-stone-900">
              <div className="flex justify-between text-stone-400 print:text-stone-600">
                <span>Subtotal:</span>
                <span>৳{order.totalAmount}</span>
              </div>
              <div className="flex justify-between text-stone-400 print:text-stone-600">
                <span>Express Courier Shipping:</span>
                <span className="text-emerald-400 print:text-emerald-700 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-amber-200 print:text-stone-950 pt-2 border-t border-stone-800 print:border-stone-300">
                <span>Total Amount Paid:</span>
                <span className="font-serif text-base text-emerald-400 print:text-stone-950">৳{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-4 border-t border-stone-800 print:border-stone-300 text-center text-[10px] text-stone-500 print:text-stone-600 space-y-1">
            <p>Thank you for choosing Mensvibes Handcrafted Footwear. Guaranteed 100% Genuine Leather.</p>
            <p>For support or returns, contact admin.mensvibes@gmail.com or WhatsApp +8801721605677.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
