import React from 'react';
import { CATEGORIES_LIST } from '../data/mockProducts';
import { ArrowRight } from 'lucide-react';

interface CategoryGridProps {
  onCategorySelect: (categoryName: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect }) => {
  return (
    <section className="py-12 bg-stone-900 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-stone-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              EXPLORE MORE
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 mt-1">
              Feature Categories
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-2 md:mt-0 max-w-md">
            Handcrafted leather footwear organized by style, cut, and occasion.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES_LIST.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => onCategorySelect(cat.name)}
              className="group cursor-pointer bg-stone-950 border border-stone-800 hover:border-amber-700/60 rounded-xl p-3 text-center transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col items-center justify-between"
            >
              <div className="w-full h-28 rounded-lg overflow-hidden mb-3 bg-stone-900 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 text-base">{cat.icon}</span>
              </div>

              <div className="w-full">
                <h3 className="text-xs font-bold text-stone-200 group-hover:text-amber-300 transition-colors uppercase tracking-wider truncate">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-stone-500 mt-0.5">{cat.count}+ Models</p>
              </div>

              <div className="mt-2 text-[10px] text-amber-400 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
