import React from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { CategoryGrid } from '../components/CategoryGrid';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { Sparkles, ArrowRight, Star, ShieldCheck, Flame, HeartHandshake } from 'lucide-react';

interface HomePageProps {
  allProducts: Product[];
  onNavigate: (page: string, params?: any) => void;
  onSelectProduct: (product: Product) => void;
  onOpenAIStylist: () => void;
  onOpenAISizeFinder: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  allProducts,
  onNavigate,
  onSelectProduct,
  onOpenAIStylist,
  onOpenAISizeFinder,
}) => {
  const popularProducts = allProducts.filter(p => p.isFeatured || p.isNewArrival).slice(0, 8);

  return (
    <div className="bg-stone-950 text-stone-100 min-h-screen font-sans">
      {/* Hero Banner */}
      <HeroBanner
        onExploreClick={() => onNavigate('products')}
        onOpenAIStylist={onOpenAIStylist}
        onCategorySelect={cat => onNavigate('products', { category: cat })}
      />

      {/* Feature Category Grid */}
      <CategoryGrid onCategorySelect={cat => onNavigate('products', { category: cat })} />

      {/* Popular Products Showcase */}
      <section className="py-14 bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-stone-800">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-400">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>POPULAR SELECTIONS</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100 mt-1">
                Handcrafted Footwear Classics
              </h2>
            </div>

            <button
              onClick={() => onNavigate('products')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 mt-3 md:mt-0 transition-colors"
            >
              <span>View Full 30+ Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onOpenAISizeFinder={onOpenAISizeFinder}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Craftsmanship Spotlight */}
      <section className="py-16 bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border-y border-amber-950/60 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              OUR HERITAGE & QUALITY
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
              Grade-A Cow Leather & Italian Soles
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              Every Mensvibes pair is individually hand-cut and hand-finished by seasoned shoe artisans in our atelier. We source only full-grain, Grade-A cow leather that develops a rich patina over time, paired with Goodyear-welted handmade soles.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800">
                <span className="font-bold text-amber-300 block text-sm">Full Grain Hide</span>
                <span className="text-stone-400">Naturally breathable & soft</span>
              </div>
              <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800">
                <span className="font-bold text-amber-300 block text-sm">Goodyear Welted</span>
                <span className="text-stone-400">Handstitched longevity</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('story')}
              className="mt-4 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-full inline-flex items-center gap-2 shadow-lg transition-all"
            >
              <span>Read Our Craftsmanship Story</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <img
              src="https://cit-node.blr1.cdn.digitaloceanspaces.com/feet_plus_image/06ee4216-a6cb-46c5-a9df-59e338cd2bfc-SOLID CLASSIC BLACK.jpeg"
              alt="Chelsea Boot Craftsmanship"
              className="w-full h-64 object-cover rounded-2xl border border-amber-900/40 shadow-xl"
            />
            <img
              src="https://cit-node.blr1.cdn.digitaloceanspaces.com/feet_plus_image/d3b7b2cc-21ef-4678-91bf-591810ff159f-HandMade-Merun.jpeg"
              alt="Handmade Sole Loafer"
              className="w-full h-64 object-cover rounded-2xl border border-amber-900/40 shadow-xl mt-6"
            />
          </div>
        </div>
      </section>

      {/* AI Styling Assistant Callout Section */}
      <section className="py-14 bg-stone-950 text-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-stone-900 border border-amber-800/50 rounded-2xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-3 max-w-xl z-10">
              <div className="inline-flex items-center gap-2 bg-amber-950 border border-amber-700/60 px-3 py-1 rounded-full text-xs text-amber-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>INTELLIGENT FOOTWEAR ADVISOR</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
                Unsure which shoes complement your suit or outfit?
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Consult Gemini AI for instant personalized footwear pairing based on your event, outfit colors, and fitting preferences.
              </p>
            </div>

            <button
              onClick={onOpenAIStylist}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm rounded-full shadow-2xl transition-all shrink-0 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>Ask AI Stylist Now</span>
            </button>
          </div>
        </div>
      </section>

      {/* Customer Reviews & Testimonials */}
      <section className="py-14 bg-stone-900 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              VERIFIED REVIEWS
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 mt-1">
              Loved by Gentlemen Across Bangladesh
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-stone-950 rounded-2xl border border-stone-800 space-y-3 shadow-lg">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-stone-300 italic leading-relaxed">
                "The Alessio Italian Loafer in Black is exceptional. The cow leather is soft yet structured, and the handmade sole gets compliments everywhere I go."
              </p>
              <div className="pt-2 border-t border-stone-900">
                <span className="font-bold text-stone-200 text-xs block">Syed Rafiqul Islam</span>
                <span className="text-[10px] text-stone-500">Dhaka Executive • Verified Buyer</span>
              </div>
            </div>

            <div className="p-6 bg-stone-950 rounded-2xl border border-stone-800 space-y-3 shadow-lg">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-stone-300 italic leading-relaxed">
                "Bought the Solid Classic Chelsea Boot in Mustard Tan. The AI size recommendation suggested EU 42 and it fits like a glove!"
              </p>
              <div className="pt-2 border-t border-stone-900">
                <span className="font-bold text-stone-200 text-xs block">Asif Chowdhury</span>
                <span className="text-[10px] text-stone-500">Chittagong • Verified Buyer</span>
              </div>
            </div>

            <div className="p-6 bg-stone-950 rounded-2xl border border-stone-800 space-y-3 shadow-lg">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-stone-300 italic leading-relaxed">
                "Fast bKash checkout and delivery within 2 days. The Mens Premium Leather Wallet is top-notch quality."
              </p>
              <div className="pt-2 border-t border-stone-900">
                <span className="font-bold text-stone-200 text-xs block">Shahriar Hassan</span>
                <span className="text-[10px] text-stone-500">Sylhet • Verified Buyer</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
