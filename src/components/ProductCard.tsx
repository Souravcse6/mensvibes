import React, { useState } from 'react';
import { Product } from '../types';
import { Heart, ShoppingBag, Star, Sparkles, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onOpenAISizeFinder?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onOpenAISizeFinder,
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedSize, setSelectedSize] = useState<number>(product.sizes[0] || 41);
  const [isHovered, setIsHovered] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, product.colors[0], 1);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1500);
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-stone-900 border border-stone-800 hover:border-amber-700/60 rounded-xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
    >
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 pointer-events-none">
        {hasDiscount && (
          <span className="bg-rose-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow uppercase tracking-wider">
            {discountPercent}% OFF
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-amber-500 text-stone-950 font-bold text-[10px] px-2 py-0.5 rounded shadow uppercase tracking-wider">
            NEW CAMPING
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={e => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur transition-all ${
          inWishlist
            ? 'bg-rose-600 text-white'
            : 'bg-stone-950/70 text-stone-300 hover:text-white hover:bg-stone-950'
        }`}
        title="Add to Wishlist"
      >
        <Heart className="w-4 h-4 fill-current" />
      </button>

      {/* Image Container */}
      <div className="relative w-full h-56 sm:h-64 bg-stone-950 overflow-hidden">
        <img
          src={product.mainImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
        />

        {/* Hover Quick Size Selector Bar */}
        {product.sizes.length > 1 && (
          <div
            className={`absolute bottom-0 left-0 right-0 bg-stone-950/90 backdrop-blur p-2 transition-all duration-300 border-t border-stone-800 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between text-[11px] mb-1 text-stone-300">
              <span>Select Size:</span>
              {onOpenAISizeFinder && (
                <button
                  onClick={() => onOpenAISizeFinder(product)}
                  className="text-amber-400 hover:underline flex items-center gap-1 text-[10px] font-semibold"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Size Finder</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {product.sizes.map(sz => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`w-7 h-6 text-[10px] font-bold rounded transition-colors ${
                    selectedSize === sz
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  {sz === 0 ? 'OS' : sz}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
            <span className="uppercase tracking-wider font-semibold text-amber-400/90">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="font-bold text-stone-200">{product.rating}</span>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-stone-100 group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          <p className="text-[11px] text-stone-400 mt-1 line-clamp-1">{product.material}</p>
        </div>

        {/* Pricing and Action Button */}
        <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between">
          <div>
            <div className="text-base font-bold text-amber-300 font-sans">
              ৳{product.discountPrice ?? product.price}
            </div>
            {hasDiscount && (
              <div className="text-xs text-stone-500 line-through -mt-0.5">৳{product.price}</div>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={addedSuccess}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow ${
              addedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
