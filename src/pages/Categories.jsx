import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Star, Heart, ShoppingBag, Flame, Clock, Utensils, Loader2
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { CartContext } from "../Context/CartContext";
import { toast } from "react-hot-toast"; // تأكد من تثبيتها واستيرادها
import addToFavorite from '../lib/client/wishlist/addToFavorite';
import addToCart from '../lib/client/cart/addToCart';

const Categories = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';
  
  const { setCartCount, setWishlistCount } = useContext(CartContext);
  
  const [cartFeedback, setCartFeedback] = useState(null);
  const [searchParams] = useSearchParams();
  const categoryQuery = searchParams.get("c");
  const searchQuery = searchParams.get("s");

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- جلب البيانات ---
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/menu/search`, {
          params: {
            categoryName: categoryQuery,
            search: searchQuery
          }
        });
        setFoods(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(isArabic ? "حدث خطأ أثناء تحميل البيانات" : "Error loading data");
        setLoading(false);
      }
    };
    fetchFoods();
  }, [categoryQuery, searchQuery]);

  // --- دالة المفضلة ---
  const toggleFavorite = async (e, id) => {
    e.stopPropagation(); // منع الانتقال لصفحة التفاصيل عند الضغط على القلب
    try {
      await addToFavorite(id);
      setWishlistCount(prev => prev + 1);
      toast.success(isArabic ? "أضيفت للمفضلة" : "Added to favorites");
    } catch (err) {
      console.log(err);
      
      toast.error(isArabic ? err.message: "Process failed");
    }
  };

  // --- دالة السلة ---
  const handleAddToCart = async (e, product) => {
    e.stopPropagation(); // منع الانتقال لصفحة التفاصيل عند الضغط على الزر
    try {
      setCartFeedback(product.id);
      await addToCart({ product_id: product.id, quantity: 1 });
      setCartCount(prev => prev + 1);
      toast.success(isArabic ? "تمت الإضافة للسلة" : "Added to cart");
    } catch (error) {
      toast.error(isArabic ? "فشلت الإضافة" : "Failed to add");
    } finally {
      setTimeout(() => setCartFeedback(null), 1200);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20 font-sans" dir={isArabic ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 px-4 py-4 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className={isArabic ? "text-right" : "text-left"}>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
              {categoryQuery ? `${t('translation.category')}: ${t('translation.' + categoryQuery)}` : t('translation.explore')} ✨
            </h1>
            <p className="text-zinc-400 text-sm font-medium">{t('translation.best_dishes')}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-10 mt-8">
        <main>
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-orange-500" size={48} />
              <p className="mt-4 text-zinc-500 font-bold">{isArabic ? "جاري التحضير..." : "Preparing..."}</p>
            </div>
          )}

          {!loading && error && <div className="text-center py-20 text-red-500 font-bold">{error}</div>}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {foods.map((food) => (
                <Card 
                  key={food.id} 
                  
                  className="group relative bg-white rounded-[2.5rem] border-none shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(249,115,22,0.1)] transition-all duration-500 overflow-hidden cursor-pointer"
                >
                  {/* قسم الصورة */}
                  <div className="relative h-56 m-3 overflow-hidden rounded-[2rem]" onClick={() => navigate(`/product-details?id=${food.id}`)}>
                    <img
                      src={food.image_url || food.image} // استخدام الحقل القادم من الباك اند
                      alt={food.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-2xl shadow-xl">
                      <span className="font-black text-lg text-zinc-900">{food.price} <small className="text-[10px] text-zinc-500">ج.م</small></span>
                    </div>

                    <div className="absolute top-4 flex justify-between w-full px-4">
                      <button 
                        onClick={(e) => toggleFavorite(e, food.id)}
                        className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-zinc-400 hover:text-red-500 hover:scale-110 transition-all shadow-lg"
                      >
                        <Heart size={20} className={food.isFavorite ? "fill-red-500 text-red-500" : ""} />
                      </button>
                      {food.is_spicy && (
                        <div className="bg-red-500 text-white p-2 rounded-xl shadow-lg animate-pulse">
                          <Flame size={18} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* تفاصيل الوجبة */}
                  <CardContent className="pt-2 pb-6 px-6 text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                        {food.category?.name}
                      </span>
                      <div className="flex items-center text-amber-500 text-xs font-bold mr-auto">
                        <Star size={14} fill="currentColor" className="ml-1" /> {parseFloat(food.average_rating || 0).toFixed(1)}
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-zinc-900 mb-4 group-hover:text-orange-600 transition-colors tracking-tight">
                      {food.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-zinc-400 text-xs font-medium bg-zinc-50 px-2 py-1 rounded-lg">
                        <Clock size={14} />
                        {food.delivery_time}
                      </div>

                      <Button 
                        disabled={cartFeedback === food.id}
                        onClick={(e) => handleAddToCart(e, food)}
                        className={`${cartFeedback === food.id ? 'bg-green-500' : 'bg-zinc-900'} hover:bg-orange-600 text-white rounded-2xl h-11 px-6 transition-all duration-300`}
                      >
                        <ShoppingBag size={18} className={isArabic ? "ml-2" : "mr-2"} />
                        <span className="text-xs font-black uppercase">
                          {cartFeedback === food.id ? (isArabic ? "تم!" : "Added!") : (isArabic ? "أضف للسلة" : "Add to cart")}
                        </span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && foods.length === 0 && (
            <div className="text-center py-32 bg-zinc-50 rounded-[3rem] border-2 border-dashed border-zinc-100 m-4">
              <Utensils size={48} className="mx-auto text-zinc-200 mb-4" />
              <h3 className="text-2xl font-black text-zinc-400">{isArabic ? "لم نجد نتائج" : "No results found"}</h3>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Categories;