import { Star } from "lucide-react";
import { useId } from "react";

export const RatingStars = ({ rating, reviewCount, t }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const gradientId = useId();

  // Helper component for star icon rendering (replaces FaStar, FaStarHalf, FaRegStar)
  const StarIcon = ({ type }) => {
    if (type === 'full') return <Star fill="#fbbf24" stroke="#fbbf24" className="w-4 h-4" />;
    if (type === 'half') return (
      <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`half-gradient-${gradientId}`}>
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#d1d5db" />
          </linearGradient>
        </defs>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 18l-6.18 3.02L7 14.14l-5-4.87 6.91-1.01L12 2z" fill={`url(#half-gradient-${gradientId})`} stroke="#fbbf24" strokeWidth="0.5" />
      </svg>
    );
    return <Star fill="#d1d5db" stroke="#d1d5db" className="w-4 h-4" />;
  };

  return (
    <div className="flex items-center text-sm">
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon key={`full-${i}`} type="full" />
      ))}
      {hasHalfStar && <StarIcon key="half" type="half" />}
      {[...Array(emptyStars)].map((_, i) => (
        <StarIcon key={`empty-${i}`} type="empty" />
      ))}
      {reviewCount ? (<span className="text-xs text-gray-500 mr-1">( {reviewCount} {t('translation.reviews')} )</span>):""}
    </div>
  );
};