import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '8801721605677';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    'Hello Mensvibes! I am interested in your handcrafted leather shoes and would like to ask a question.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
      {/* Popover Bubble */}
      {isOpen && (
        <div className="mb-3 w-72 bg-stone-900 border border-emerald-500/40 rounded-2xl shadow-2xl p-4 text-stone-100 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
              <span className="font-bold text-emerald-400">Mensvibes Direct Support</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-stone-800 rounded-full text-stone-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="mt-2 text-stone-300 leading-relaxed">
            Need size advice, custom order details, or fast delivery updates? Chat with our team instantly on WhatsApp.
          </p>
          <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-between">
            <span className="text-[11px] font-mono text-stone-400">+8801721605677</span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold px-3 py-1.5 rounded-lg text-[11px] transition-colors flex items-center gap-1 shadow"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Start Chat</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="flex items-center gap-2">
        {!isOpen && (
          <span className="hidden sm:inline-block bg-stone-900/90 text-stone-200 border border-emerald-500/30 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md">
            Chat on WhatsApp
          </span>
        )}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setIsOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 p-3.5 rounded-full shadow-2xl border-2 border-emerald-300/50 flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 group"
          title="Direct WhatsApp Support: +8801721605677"
        >
          <MessageCircle className="w-6 h-6 fill-stone-950 text-emerald-500 group-hover:scale-110 transition-transform" />
        </a>
      </div>
    </div>
  );
};
