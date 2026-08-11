import React from 'react';
import { ArrowRight, ShieldCheck, Award, HeartHandshake, Compass } from 'lucide-react';

interface BrandStoryPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const BrandStoryPage: React.FC<BrandStoryPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-stone-950 text-stone-100 min-h-screen py-12 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner */}
        <div className="text-center space-y-4 border-b border-stone-800 pb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            THE MENSVIBES ATELIER
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-amber-100">
            Footwear Artisans & Heritage Craft
          </h1>
          <p className="text-stone-300 text-sm max-w-xl mx-auto leading-relaxed">
            Founded with a singular focus: bringing authentic Italian shoe-making standards, Grade-A full-grain cow leather, and Goodyear-welted soles to the modern gentleman.
          </p>
        </div>

        {/* Story Section 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <img
            src="https://cit-node.blr1.cdn.digitaloceanspaces.com/feet_plus_image/de205a9f-4d84-4ec5-8b6b-8ae7ddf925ed-HandMade-Black.jpeg"
            alt="Artisanal Leather Shoes"
            className="w-full h-80 object-cover rounded-2xl border border-amber-900/50 shadow-2xl"
          />
          <div className="space-y-3 text-xs leading-relaxed text-stone-300">
            <h3 className="text-xl font-serif font-bold text-amber-200">1. Full Grain Leather Selection</h3>
            <p>
              Unlike mass-produced synthetic footwear, every pair of Mensvibes shoes begins with meticulous leather selection. We only use A-Grade full-grain cow leather sourced from trusted tanneries.
            </p>
            <p>
              Full-grain hide retains the natural strength and pore structure of genuine leather, making it exceptionally breathable, durable, and capable of forming a beautiful custom patina.
            </p>
          </div>
        </div>

        {/* Story Section 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3 text-xs leading-relaxed text-stone-300 order-2 md:order-1">
            <h3 className="text-xl font-serif font-bold text-amber-200">2. Handstitched Italian Soles</h3>
            <p>
              Our signature Alessio Italian Loafers and Chelsea boots feature hand-assembled Goodyear welted soles.
            </p>
            <p>
              This classic cobbler technique ensures that soles can be re-crafted, provides maximum flexibility during long walks, and prevents sole separation.
            </p>
          </div>
          <img
            src="https://cit-node.blr1.cdn.digitaloceanspaces.com/feet_plus_image/06ee4216-a6cb-46c5-a9df-59e338cd2bfc-SOLID CLASSIC BLACK.jpeg"
            alt="Handmade Sole"
            className="w-full h-80 object-cover rounded-2xl border border-amber-900/50 shadow-2xl order-1 md:order-2"
          />
        </div>

        {/* CTA */}
        <div className="p-8 bg-stone-900 border border-stone-800 rounded-3xl text-center space-y-4">
          <h3 className="text-xl font-serif font-bold text-amber-100">Step Into Uncompromising Luxury</h3>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            Experience the distinction of authentic leather craftsmanship delivered nationwide across Bangladesh.
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs rounded-full inline-flex items-center gap-2 shadow-xl"
          >
            <span>Explore Handcrafted Footwear</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
