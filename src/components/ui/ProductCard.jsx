import { Check, Heart, ShoppingCart } from "lucide-react";
import { RatingStars } from "./RatingStars";

export const ProductCard = ({ product, t, handleProductClick, toggleFavorite, onAddToCart, isInCartFeedback }) => {
  const isArabic = t('translation.home') === 'الرئيسية'; // Check language via translation key

  return (
    <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-4 flex flex-col items-center group relative overflow-hidden">

      {/* Favorite Toggle Button */}
      <button
        onClick={() => toggleFavorite(product.id)}
        className={`absolute top-3 ${isArabic ? 'left-3' : 'right-3'} p-2 rounded-full z-10 transition duration-300 ${product.isFavorite ? 'text-red-500 bg-white/80' : 'text-gray-400 hover:text-red-500 bg-white/60'} backdrop-blur-sm`}
        aria-label={t('translation.favorites')}
      >
        <Heart className="w-5 h-5" fill={product.isFavorite ? '#ef4444' : 'none'} />
      </button>

      {/* Product Image & Clickable Area */}
      <div
        className="w-full cursor-pointer"
        onClick={() => handleProductClick(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x300/eee/333?text=Image+Error"; }}
          loading="lazy"
          className="w-full h-48 object-cover rounded-xl mb-3 group-hover:scale-105 transition duration-500 shadow-md"
        />
        <div className="font-semibold text-gray-800 text-center mb-1 group-hover:text-orange-600 transition truncate">{product.name}</div>
      </div>

      {/* Rating */}
      <div className="flex justify-center mb-2">
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} t={t} />
      </div>

      <div className="text-orange-600 font-bold text-xl mb-3">{product.price} ج.م</div>

      {/* Add to Cart Button */}
      <button
        onClick={() => onAddToCart(product)}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full text-white font-medium transition shadow-md hover:shadow-lg text-sm ${isInCartFeedback ? 'bg-green-500' : 'bg-orange-500 hover:bg-orange-600'}`}
        aria-label={t('translation.add_to_cart')}
      >
        {isInCartFeedback ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
        <span className="hidden sm:inline">{isInCartFeedback ? (t('translation.added_to_cart') || (isArabic ? 'تمت الإضافة' : 'Added')) : t("translation.add_to_cart")}</span>
      </button>
    </div>
  );
};