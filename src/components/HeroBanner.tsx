import React from 'react';
import { ArrowRight, Sparkles, Shield, Award, Flame } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick: () => void;
  onOpenAIStylist: () => void;
  onCategorySelect: (category: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreClick,
  onOpenAIStylist,
  onCategorySelect,
}) => {
  return (
    <div className="relative bg-stone-950 text-amber-50 overflow-hidden border-b border-amber-950/50">
      {/* Background Decorative Lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-800/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-950/80 border border-amber-800/60 text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-inner">
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>NEW CAMPING COLLECTION 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-amber-100 tracking-tight leading-[1.1]">
              Handcrafted Footwear for the Modern Gentleman
            </h1>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-sans">
              Discover Italian penny loafers, double monk cut Chelsea boots, and chunky platform footwear crafted from 100% Grade-A cow leather with artisanal hand-stitched soles.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-7 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-amber-500/20 flex items-center gap-2 group"
              >
                <span>Shop All Footwear</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenAIStylist}
                className="bg-stone-900 hover:bg-stone-800 text-amber-200 border border-amber-700/50 px-6 py-3.5 rounded-full font-semibold text-sm transition-all flex items-center gap-2.5 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span>AI Styling Advisor</span>
              </button>
            </div>

            {/* Feature Highlights Bar */}
            <div className="pt-6 border-t border-stone-800/80 grid grid-cols-3 gap-4 text-left">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-stone-200">Full Grain Leather</h4>
                  <p className="text-[11px] text-stone-400">100% Authentic Cowhide</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-stone-200">Handmade Soles</h4>
                  <p className="text-[11px] text-stone-400">Goodyear Welt Quality</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-stone-200">AI Size Finder</h4>
                  <p className="text-[11px] text-stone-400">Perfect Fit Guarantee</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Right Visual showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Shoe Card Image */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-amber-900/60 shadow-2xl bg-stone-900 group">
                <img
                  src="https://cit-node.blr1.cdn.digitaloceanspaces.com/feet_plus_image/de205a9f-4d84-4ec5-8b6b-8ae7ddf925ed-HandMade-Black.jpeg"
                  alt="Alessio Italian Loafer Black"
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent"></div>

                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-stone-900/90 backdrop-blur border border-amber-900/50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">BESTSELLER</span>
                    <h3 className="text-sm font-semibold text-stone-100 font-serif">Alessio Italian Loafer Black</h3>
                    <p className="text-xs text-amber-300 font-bold mt-0.5">
                      ৳2,250 <span className="text-stone-500 line-through text-[11px] font-normal">৳4,150</span>
                    </p>
                  </div>

                  <button
                    onClick={() => onCategorySelect('LOAFERS')}
                    className="bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0"
                  >
                    View Pair
                  </button>
                </div>
              </div>

              {/* Floating Secondary Badge */}
              <div className="absolute -top-4 -right-4 bg-amber-950 border border-amber-700/80 text-amber-200 px-3 py-2 rounded-xl text-xs shadow-xl backdrop-blur hidden sm:flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="font-semibold text-[11px]">300+ Pairs In Stock</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
