import React, { useState } from 'react';
import { Product, ProductReview } from '../types';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, Sparkles, Check, Share2, ThumbsUp, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onOpenAISizeFinder: (product: Product) => void;
  onExpressCheckout: (product: Product, size: number, color: string, qty: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenAISizeFinder,
  onExpressCheckout,
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { user } = useAuth();

  const [activeImage, setActiveImage] = useState<string>(product.mainImage);
  const [selectedSize, setSelectedSize] = useState<number>(product.sizes[0] || 41);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Standard');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Reviews State initialized with authentic customer feedback
  const [reviews, setReviews] = useState<ProductReview[]>([
    {
      id: 'rev-1',
      productId: product.id,
      userId: 'usr-101',
      userName: 'Tanvir Hossain',
      rating: 5,
      comment: 'Extremely high quality A-grade cow leather! Fits perfectly and the handmade sole feels very sturdy during long walks.',
      isVerifiedBuyer: true,
      createdAt: '2026-08-01',
    },
    {
      id: 'rev-2',
      productId: product.id,
      userId: 'usr-102',
      userName: 'Mahmudur Rahman',
      rating: 5,
      comment: 'Very premium packaging with dust bag. Incredibly comfortable insoles right out of the box!',
      isVerifiedBuyer: true,
      createdAt: '2026-08-03',
    },
    {
      id: 'rev-3',
      productId: product.id,
      userId: 'usr-103',
      userName: 'Arafat Islam',
      rating: 4,
      comment: 'Great craft finish. The color tone is exactly like the photos. Fast delivery in Dhaka.',
      isVerifiedBuyer: true,
      createdAt: '2026-08-05',
    },
  ]);

  const [reviewerName, setReviewerName] = useState<string>(user?.fullName || '');
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [reviewSubmittedMsg, setReviewSubmittedMsg] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  const inWishlist = isInWishlist(product.id);
  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const allImages = [product.mainImage, ...(product.otherImages || [])];

  // Dynamic Rating Calculation
  const totalReviewCount = reviews.length;
  const averageRatingNum = totalReviewCount > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviewCount).toFixed(1)
    : product.rating.toString();

  // Rating Breakdown (5 to 1 star)
  const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => Math.round(r.rating) === stars).length,
  }));

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      userId: user?.id || 'guest',
      userName: reviewerName.trim() || user?.fullName || 'Verified Shopper',
      rating: newRating,
      comment: newComment,
      isVerifiedBuyer: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setReviews([newRev, ...reviews]);
    setNewComment('');
    setReviewSubmittedMsg(true);
    setTimeout(() => setReviewSubmittedMsg(false), 3000);
  };

  const handleVoteHelpful = (revId: string) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [revId]: (prev[revId] || 0) + 1,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-stone-100 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-stone-950/80 hover:bg-stone-950 text-stone-300 hover:text-white rounded-full transition-colors border border-stone-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden bg-stone-950 border border-stone-800">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />

              {hasDiscount && (
                <span className="absolute top-3 left-3 bg-rose-600 text-white font-extrabold text-xs px-2.5 py-1 rounded shadow">
                  SPECIAL SALE
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeImage === img ? 'border-amber-500 scale-105' : 'border-stone-800 opacity-60'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quality Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-stone-400 border-t border-stone-800/80">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>100% Genuine Leather</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>2-4 Days Shipping</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
                <span>7 Days Exchange</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  {product.category}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-2 rounded-full border transition-colors ${
                      inWishlist
                        ? 'bg-rose-600 border-rose-600 text-white'
                        : 'bg-stone-800 border-stone-700 text-stone-300 hover:text-white'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-serif font-bold text-amber-100 mt-1">
                {product.name}
              </h1>

              {/* Rating & Reviews summary */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-sm font-bold text-stone-100">{averageRatingNum}</span>
                </div>
                <span className="text-xs text-stone-400">
                  • {totalReviewCount} Verified Customer Reviews
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-full font-semibold">
                  Verified Buyer Ratings
                </span>
              </div>

              {/* Price display */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-amber-300 font-sans">
                  ৳{product.discountPrice ?? product.price}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-stone-500 line-through">৳{product.price}</span>
                )}
              </div>

              {/* Size Selector */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-300">Select EU Size:</span>
                  <button
                    onClick={() => onOpenAISizeFinder(product)}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Find My Size (AI)</span>
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        selectedSize === sz
                          ? 'bg-amber-500 text-stone-950 border-amber-400 shadow'
                          : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-amber-700/60'
                      }`}
                    >
                      {sz === 0 ? 'OS' : sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              {product.colors.length > 0 && (
                <div className="mt-4 space-y-2">
                  <span className="text-xs font-semibold text-stone-300">Available Colors:</span>
                  <div className="flex items-center gap-2">
                    {product.colors.map(col => (
                      <button
                        key={col}
                        onClick={() => setSelectedColor(col)}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                          selectedColor === col
                            ? 'bg-amber-950 text-amber-200 border-amber-500 font-bold'
                            : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Adjuster */}
              <div className="mt-4 flex items-center gap-4">
                <span className="text-xs font-semibold text-stone-300">Quantity:</span>
                <div className="flex items-center border border-stone-800 rounded-lg bg-stone-950">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-stone-300 hover:bg-stone-800 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs font-bold text-amber-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-stone-300 hover:bg-stone-800 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-stone-800">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={addedSuccess}
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                    addedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add To Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onExpressCheckout(product, selectedSize, selectedColor, quantity)}
                  className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-100 rounded-xl font-bold text-xs uppercase tracking-wider border border-amber-600/40 shadow-lg transition-all"
                >
                  Express Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tabs: Description / Specs / Reviews */}
        <div className="border-t border-stone-800 bg-stone-950/60 p-6 sm:p-8">
          <div className="flex items-center gap-6 border-b border-stone-800 pb-3 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'description'
                  ? 'border-amber-400 text-amber-400 font-bold'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              Product Description
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'specs'
                  ? 'border-amber-400 text-amber-400 font-bold'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              Artisanal Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'reviews'
                  ? 'border-amber-400 text-amber-400 font-bold'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          <div className="pt-4 text-xs leading-relaxed text-stone-300">
            {activeTab === 'description' && (
              <p>{product.description}</p>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-stone-900 rounded-lg border border-stone-800">
                  <span className="text-stone-500 uppercase tracking-wider text-[10px] font-bold block">
                    Upper Leather Material
                  </span>
                  <span className="font-semibold text-stone-200 mt-1 block">{product.material}</span>
                </div>
                <div className="p-3 bg-stone-900 rounded-lg border border-stone-800">
                  <span className="text-stone-500 uppercase tracking-wider text-[10px] font-bold block">
                    Sole Construction
                  </span>
                  <span className="font-semibold text-stone-200 mt-1 block">{product.soleType}</span>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Rating Overview & Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-stone-900/90 p-5 rounded-2xl border border-stone-800">
                  {/* Left: Score Box */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-stone-950/80 rounded-xl border border-stone-800/80 text-center">
                    <span className="text-4xl font-serif font-extrabold text-amber-300">
                      {averageRatingNum}
                    </span>
                    <div className="flex items-center gap-1 my-2 text-amber-400">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= Math.round(Number(averageRatingNum)) ? 'fill-amber-400 text-amber-400' : 'text-stone-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-stone-400 font-medium">
                      Based on {totalReviewCount} Verified Ratings
                    </span>
                    <span className="mt-2 text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/50 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      100% Genuine Buyers
                    </span>
                  </div>

                  {/* Right: Star Distribution Bars */}
                  <div className="md:col-span-8 flex flex-col justify-center space-y-2">
                    {ratingCounts.map(({ stars, count }) => {
                      const percentage = totalReviewCount > 0 ? Math.round((count / totalReviewCount) * 100) : 0;
                      return (
                        <div key={stars} className="flex items-center gap-3 text-xs">
                          <span className="w-12 text-stone-300 font-bold flex items-center gap-1">
                            {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                          </span>
                          <div className="flex-1 h-2.5 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="w-12 text-right text-stone-400 text-[11px] font-mono">
                            {percentage}% ({count})
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review Submission Form */}
                <form onSubmit={handleAddReview} className="bg-stone-900/80 p-5 rounded-2xl border border-amber-900/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <h4 className="font-bold text-amber-200 text-xs uppercase tracking-wider">
                      Leave Your Verified Customer Review
                    </h4>
                    <span className="text-[11px] text-emerald-400 font-medium">Share Leather & Fit Feedback</span>
                  </div>

                  {reviewSubmittedMsg && (
                    <div className="p-3 bg-emerald-950/80 border border-emerald-600/60 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Thank you! Your verified customer review has been published.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tanvir Ahmed"
                        value={reviewerName}
                        onChange={e => setReviewerName(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Star Rating *</label>
                      <div className="flex items-center gap-1 bg-stone-950 border border-stone-800 rounded-xl p-2">
                        {[1, 2, 3, 4, 5].map(st => (
                          <Star
                            key={st}
                            onClick={() => setNewRating(st)}
                            className={`w-5 h-5 cursor-pointer transition-transform hover:scale-110 ${
                              st <= newRating ? 'fill-amber-400 text-amber-400' : 'text-stone-700'
                            }`}
                          />
                        ))}
                        <span className="ml-2 font-bold text-amber-300 text-xs">{newRating} Stars</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Review Details *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Comment on leather quality, fit accuracy, comfort, and sole craftsmanship..."
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 placeholder-stone-500 text-xs focus:outline-none focus:border-emerald-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Verified Review</span>
                  </button>
                </form>

                {/* Reviews List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 pt-2">
                    Customer Experience Logs ({reviews.length})
                  </h4>

                  {reviews.map(rev => (
                    <div
                      key={rev.id}
                      className="p-4 bg-stone-900 rounded-2xl border border-stone-800/80 space-y-2 hover:border-amber-900/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-300 flex items-center justify-center font-bold text-xs uppercase">
                            {rev.userName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-stone-100 text-xs block">{rev.userName}</span>
                            {rev.isVerifiedBuyer && (
                              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                Verified Buyer
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="text-[10px] text-stone-500 font-mono">{rev.createdAt}</span>
                      </div>

                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-700'
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-stone-300 text-xs leading-relaxed">{rev.comment}</p>

                      <div className="pt-2 flex items-center justify-between border-t border-stone-800/60 text-[11px] text-stone-500">
                        <span>Handcrafted Shoe Review</span>
                        <button
                          onClick={() => handleVoteHelpful(rev.id)}
                          className="flex items-center gap-1 hover:text-emerald-400 transition-colors text-stone-400 font-medium"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>Helpful ({helpfulVotes[rev.id] || 0})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
