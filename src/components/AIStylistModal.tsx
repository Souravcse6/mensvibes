import React, { useState } from 'react';
import { Product, AIStylingRecommendation } from '../types';
import { X, Sparkles, Loader2, ArrowRight, Check, Palette } from 'lucide-react';

interface AIStylistModalProps {
  allProducts: Product[];
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const AIStylistModal: React.FC<AIStylistModalProps> = ({
  allProducts,
  onClose,
  onSelectProduct,
}) => {
  const [occasion, setOccasion] = useState<string>('Business Executive & Client Meetings');
  const [outfit, setOutfit] = useState<string>('Dark navy tailored suit with white dress shirt');
  const [colorPreference, setColorPreference] = useState<string>('Black or Dark Brown');
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<AIStylingRecommendation | null>(null);

  const handleConsultAI = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion,
          outfit,
          colorPreference,
          userPrompt,
          availableProducts: allProducts,
        }),
      });

      const data = await res.json();
      setRecommendation({
        shoeIds: data.recommendedShoeIds || data.shoeIds || ['prod-001', 'prod-005'],
        styleTitle: data.styleTitle || 'Mensvibes Tailored Look',
        stylingAdvice: data.stylingAdvice || 'A classic black Italian loafer elevates any tailored suit.',
        recommendedOutfit: data.recommendedOutfit || 'Navy or charcoal trousers with matching belt.',
        careTips: data.careTips || 'Condition leather monthly.',
      });
    } catch (err) {
      console.error('Stylist AI Error:', err);
      setRecommendation({
        shoeIds: ['prod-001', 'prod-005', 'prod-002'],
        styleTitle: 'Mensvibes Heritage Recommendation',
        stylingAdvice: 'For formal and executive wear, full-grain Italian loafers with Goodyear soles offer an unmatched polished look.',
        recommendedOutfit: 'Tailored trousers, blazer, and leather belt.',
        careTips: 'Use cedar shoe trees after wear.',
      });
    } finally {
      setLoading(false);
    }
  };

  const recommendedShoes = recommendation
    ? allProducts.filter(p => recommendation.shoeIds.includes(p.id))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-stone-100 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-white rounded-full transition-colors border border-stone-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-950/80 text-amber-400 border border-amber-800/60 rounded-xl">
            <Sparkles className="w-6 h-6 animate-pulse text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-amber-100">AI Personal Shoe Stylist</h2>
            <p className="text-xs text-stone-400">
              Tell Gemini AI your occasion or outfit to receive bespoke footwear pairings.
            </p>
          </div>
        </div>

        {!recommendation ? (
          <form onSubmit={handleConsultAI} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Occasion / Event:</label>
              <select
                value={occasion}
                onChange={e => setOccasion(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-stone-100 focus:outline-none focus:border-amber-500"
              >
                <option value="Business Executive & Client Meetings">Business Executive & Client Meetings</option>
                <option value="Wedding / Formal Black Tie Evening">Wedding / Formal Black Tie Evening</option>
                <option value="Casual Weekend / Smart Casual Outing">Casual Weekend / Smart Casual Outing</option>
                <option value="Streetwear / Urban Night Out">Streetwear / Urban Night Out</option>
                <option value="Travel / Camping & Long Walks">Travel / Camping & Long Walks</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1">
                Describe What You Are Wearing:
              </label>
              <input
                type="text"
                value={outfit}
                onChange={e => setOutfit(e.target.value)}
                placeholder="e.g. Linen shirt with chinos or navy blue blazer"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-stone-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Preferred Color Tone:</label>
                <select
                  value={colorPreference}
                  onChange={e => setColorPreference(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Black or Dark Brown">Black / Deep Choco</option>
                  <option value="Tan / Mustard Camel">Tan / Mustard</option>
                  <option value="Olive / Blue / Wine">Olive / Blue / Red Wine</option>
                  <option value="Surprise Me">Stylist Choice</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Special Preferences:</label>
                <input
                  type="text"
                  value={userPrompt}
                  onChange={e => setUserPrompt(e.target.value)}
                  placeholder="e.g. Need handmade leather sole"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg text-sm mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Consulting Gemini AI Stylist...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Style Recommendation</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-5 text-xs">
            {/* Style Title */}
            <div className="p-4 bg-amber-950/50 border border-amber-800/60 rounded-xl">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block">
                AI STYLIST VERDICT
              </span>
              <h3 className="text-lg font-serif font-bold text-amber-200 mt-1">
                {recommendation.styleTitle}
              </h3>
              <p className="text-stone-300 mt-2 leading-relaxed">{recommendation.stylingAdvice}</p>
            </div>

            {/* Recommended Shoes Cards */}
            <div>
              <h4 className="font-bold text-amber-300 mb-2 uppercase tracking-wider text-[11px]">
                Recommended Pairs ({recommendedShoes.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recommendedShoes.map(prod => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      onSelectProduct(prod);
                      onClose();
                    }}
                    className="p-3 bg-stone-950 border border-stone-800 hover:border-amber-500 rounded-xl flex items-center gap-3 cursor-pointer group transition-all"
                  >
                    <img src={prod.mainImage} alt={prod.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <h5 className="font-semibold text-stone-100 group-hover:text-amber-300 line-clamp-1">
                        {prod.name}
                      </h5>
                      <span className="text-amber-400 font-bold block mt-0.5">
                        ৳{prod.discountPrice || prod.price}
                      </span>
                      <span className="text-[10px] text-stone-500 block">{prod.material}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outfit & Care Advice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
                <span className="font-bold text-stone-200 block text-xs">Recommended Ensemble:</span>
                <p className="text-stone-400 mt-1">{recommendation.recommendedOutfit}</p>
              </div>

              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
                <span className="font-bold text-stone-200 block text-xs">Care & Maintenance:</span>
                <p className="text-stone-400 mt-1">{recommendation.careTips}</p>
              </div>
            </div>

            <button
              onClick={() => setRecommendation(null)}
              className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-xl"
            >
              Ask Another Style Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
