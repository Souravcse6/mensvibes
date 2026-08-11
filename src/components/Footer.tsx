import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones, Mail, Phone, MapPin, ExternalLink, Instagram, Facebook, Youtube } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-amber-950/40 font-sans">
      {/* Brand Value Pillars */}
      <div className="border-b border-stone-800/80 bg-stone-900/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center p-2">
            <div className="w-12 h-12 rounded-full bg-amber-950/80 border border-amber-800/50 flex items-center justify-center text-amber-400 mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-stone-100">100% Genuine Leather</h4>
            <p className="text-xs text-stone-400 mt-1">A-Grade Full-Grain Cow Leather</p>
          </div>

          <div className="flex flex-col items-center p-2">
            <div className="w-12 h-12 rounded-full bg-amber-950/80 border border-amber-800/50 flex items-center justify-center text-amber-400 mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-stone-100">Nationwide Express</h4>
            <p className="text-xs text-stone-400 mt-1">Fast 2-4 Days Delivery Across BD</p>
          </div>

          <div className="flex flex-col items-center p-2">
            <div className="w-12 h-12 rounded-full bg-amber-950/80 border border-amber-800/50 flex items-center justify-center text-amber-400 mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-stone-100">Easy Exchange & Return</h4>
            <p className="text-xs text-stone-400 mt-1">7 Days Hassle-Free Size Swap</p>
          </div>

          <div className="flex flex-col items-center p-2">
            <div className="w-12 h-12 rounded-full bg-amber-950/80 border border-amber-800/50 flex items-center justify-center text-amber-400 mb-3">
              <Headphones className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-stone-100">Dedicated VIP Support</h4>
            <p className="text-xs text-stone-400 mt-1">01721605677 • 10am-10pm</p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs">
        {/* Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <BrandLogo onClick={() => onNavigate('home')} variant="horizontal" size="lg" />
          <p className="text-stone-400 leading-relaxed text-xs max-w-sm">
            Mensvibes is a premier handcrafted footwear label dedicated to combining Italian shoe-making heritage with modern silhouette aesthetics. Every pair is crafted with Grade-A cow leather and artisan soles.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <a
              href="https://wa.me/8801721605677?text=Hello%20Mensvibes"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/50 transition-colors flex items-center gap-1.5 font-bold text-[11px]"
            >
              <span>WhatsApp Us: 01721605677</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-amber-200 uppercase tracking-wider">Shop Collections</h5>
          <ul className="space-y-2 text-stone-400">
            <li>
              <button onClick={() => onNavigate('products', { category: 'LOAFERS' })} className="hover:text-amber-300 transition-colors">
                Italian Loafers
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('products', { category: 'PREMIUM CHELSEA' })} className="hover:text-amber-300 transition-colors">
                Premium Chelsea Boots
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('products', { category: 'CHANKY SHOES' })} className="hover:text-amber-300 transition-colors">
                Chunky Platform Shoes
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('products', { category: "Men's Wallet" })} className="hover:text-amber-300 transition-colors">
                Leather Wallets
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('products', { isNewArrival: true })} className="hover:text-amber-300 transition-colors text-amber-400 font-medium">
                New Camping Arrivals ⚡
              </button>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-amber-200 uppercase tracking-wider">Customer Service</h5>
          <ul className="space-y-2 text-stone-400">
            <li>
              <button onClick={() => onNavigate('tracking')} className="hover:text-amber-300 transition-colors flex items-center gap-1">
                <span>Order Tracking</span>
                <ExternalLink className="w-3 h-3 text-stone-500" />
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('account')} className="hover:text-amber-300 transition-colors">
                My Account Profile
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('story')} className="hover:text-amber-300 transition-colors">
                Brand Craftsmanship Story
              </button>
            </li>
            <li>
              <span className="text-stone-500 cursor-not-allowed">Size Guide & Fit Chart</span>
            </li>
            <li>
              <span className="text-stone-500 cursor-not-allowed">Privacy & Terms Policy</span>
            </li>
          </ul>
        </div>

        {/* Store Location & Contact */}
        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-amber-200 uppercase tracking-wider">Contact & Flagship</h5>
          <div className="space-y-2 text-stone-400 leading-relaxed">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Shop no-33/34/35/36, Level -5, Fortune shopping mall, Mouchk, Malibag , Dhaka, Bangladesh</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>01721605677 (+8801721605677)</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>admin.mensvibes@gmail.com</span>
            </p>
          </div>
        </div>
      </div>

      {/* Payment Badges & Copyright */}
      <div className="border-t border-stone-800 bg-stone-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Mensvibes Footwear Ltd. All rights reserved.</p>

          {/* Payment Gateways */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-stone-400 font-medium">Accepted Payments:</span>
            <div className="flex items-center gap-2">
              <span className="bg-pink-900/60 text-pink-200 border border-pink-700/50 px-2 py-0.5 rounded font-mono font-bold text-[10px]">bKash</span>
              <span className="bg-orange-900/60 text-orange-200 border border-orange-700/50 px-2 py-0.5 rounded font-mono font-bold text-[10px]">Nagad</span>
              <span className="bg-blue-900/60 text-blue-200 border border-blue-700/50 px-2 py-0.5 rounded font-mono font-bold text-[10px]">SSLCommerz</span>
              <span className="bg-amber-900/60 text-amber-200 border border-amber-700/50 px-2 py-0.5 rounded font-mono font-bold text-[10px]">COD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
