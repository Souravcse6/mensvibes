import React, { useState, useMemo } from 'react';
import { Product, FilterState } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface ProductsPageProps {
  allProducts: Product[];
  initialCategory?: string;
  initialSearch?: string;
  onSelectProduct: (product: Product) => void;
  onOpenAISizeFinder: (product: Product) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  allProducts,
  initialCategory,
  initialSearch,
  onSelectProduct,
  onOpenAISizeFinder,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory || 'ALL',
    searchQuery: initialSearch || '',
    minPrice: 0,
    maxPrice: 6000,
    selectedSize: null,
    selectedColor: null,
    sortBy: 'featured',
  });

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter(p => {
        // Category check
        if (
          filters.category !== 'ALL' &&
          p.category.toUpperCase() !== filters.category.toUpperCase() &&
          p.categorySlug.toUpperCase() !== filters.category.toUpperCase()
        ) {
          return false;
        }

        // Search query
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchMat = p.material.toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchMat) return false;
        }

        // Price range
        const effectivePrice = p.discountPrice ?? p.price;
        if (effectivePrice < filters.minPrice || effectivePrice > filters.maxPrice) {
          return false;
        }

        // Size check
        if (filters.selectedSize && !p.sizes.includes(filters.selectedSize)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice ?? a.price;
        const priceB = b.discountPrice ?? b.price;

        if (filters.sortBy === 'price-low') return priceA - priceB;
        if (filters.sortBy === 'price-high') return priceB - priceA;
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured
      });
  }, [allProducts, filters]);

  const resetFilters = () => {
    setFilters({
      category: 'ALL',
      searchQuery: '',
      minPrice: 0,
      maxPrice: 6000,
      selectedSize: null,
      selectedColor: null,
      sortBy: 'featured',
    });
  };

  const categoriesNav = [
    { name: 'All Shoes', val: 'ALL' },
    { name: 'Loafers', val: 'LOAFERS' },
    { name: 'Premium Chelsea', val: 'PREMIUM CHELSEA' },
    { name: 'Chelsea Boots', val: 'CHELSEA BOOT' },
    { name: 'Premium Shoes', val: 'PREMIUM SHOES' },
    { name: 'Chunky Shoes', val: 'CHANKY SHOES' },
    { name: "Men's Wallets", val: "Men's Wallet" },
  ];

  return (
    <div className="bg-stone-950 text-stone-100 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            HANDCRAFTED CATALOG
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100 mt-1">
            Mensvibes Footwear Collection
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Showing {filteredProducts.length} handcrafted pairs with Grade-A cow leather and artisanal soles.
          </p>
        </div>

        {/* Top Control Bar: Categories & Search */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
              {categoriesNav.map(cat => (
                <button
                  key={cat.val}
                  onClick={() => setFilters({ ...filters, category: cat.val })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                    filters.category.toUpperCase() === cat.val.toUpperCase()
                      ? 'bg-amber-500 text-stone-950 shadow'
                      : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search Input & Sort Selector */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <input
                  type="text"
                  placeholder="Filter by name, leather..."
                  value={filters.searchQuery}
                  onChange={e => setFilters({ ...filters, searchQuery: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-full pl-9 pr-3 py-2 text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:border-amber-500"
                />
                <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
              </div>

              {/* Sort By */}
              <select
                value={filters.sortBy}
                onChange={e => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="bg-stone-950 border border-stone-800 text-stone-200 text-xs rounded-full px-3 py-2 focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating: Highest Rated</option>
              </select>

              <button
                onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                className="lg:hidden p-2 bg-stone-950 border border-stone-800 text-amber-400 rounded-full"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Size Filter Pills */}
          <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-stone-400 font-medium text-[11px]">Filter Size:</span>
              {[39, 40, 41, 42, 43, 44].map(sz => (
                <button
                  key={sz}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      selectedSize: filters.selectedSize === sz ? null : sz,
                    })
                  }
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    filters.selectedSize === sz
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-200'
                  }`}
                >
                  EU {sz}
                </button>
              ))}

              {(filters.selectedSize || filters.searchQuery || filters.category !== 'ALL') && (
                <button
                  onClick={resetFilters}
                  className="text-rose-400 hover:underline flex items-center gap-1 text-[11px] font-semibold ml-2"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-stone-900 rounded-2xl border border-stone-800 space-y-3">
            <p className="text-base font-bold text-stone-300">No footwear items found matching your filter criteria.</p>
            <p className="text-xs text-stone-500">Try adjusting your size selection or search query.</p>
            <button
              onClick={resetFilters}
              className="mt-2 px-5 py-2.5 bg-amber-500 text-stone-950 text-xs font-bold rounded-full"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onOpenAISizeFinder={onOpenAISizeFinder}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
