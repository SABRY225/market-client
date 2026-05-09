import React, { useMemo, useRef, useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Heart, ShoppingCart, Star, Truck, ShieldCheck, Leaf, 
  Minus, Plus, ShoppingBag, UtensilsCrossed, Info, 
  Flame, MessageCircle, User, Calendar, CheckCircle, Clock 
} from "lucide-react";

import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { CartContext } from "../Context/CartContext"; // تأكد من المسار الصحيح
import { toast } from "react-hot-toast";
import addToFavorite from '../lib/client/wishlist/addToFavorite';
import addToCart from '../lib/client/cart/addToCart';

const ProductDetails = () => {
  const [searchParams] = useSearchParams();
  const id  = searchParams.get("id");
   const { setCartCount, setWishlistCount } = useContext(CartContext);
  
  const [cartFeedback, setCartFeedback] = useState(null);
 
  // --- States ---
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  
  // Review States
  const [reviewSort, setReviewSort] = useState("recent");
  const [reviewFilter, setReviewFilter] = useState(0);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
const isArabic = true; // أو اجعلها ديناميكية حسب i18n
  // --- Fetch Data from API ---
  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/menu/${id}`);
        // افترضنا أن الـ API يرجع كائن يحتوي على بيانات الوجبة وتقييماتها
        console.log(response);
        
        setProduct(response.data.data);
        setReviews(response.data.data.reviews || []);
      } catch (error) {
        console.error("Error:", error);
        toast.error("فشل في تحميل بيانات الوجبة");
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);


  const handleAddReview = async () => {
    if (!newReviewText.trim()) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("يجب تسجيل الدخول للتقييم");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/review`,
        { menu_id: id, rating: newReviewRating, comment: newReviewText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReviews([res.data.data, ...reviews]);
      setNewReviewText("");
      setNewReviewRating(5);
      toast.success("تم إضافة تقييمك بنجاح");
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء التقييم");
    }
  };

  // --- Logic for Reviews ---
  const displayedReviews = useMemo(() => {
    let list = [...reviews];
    if (reviewFilter > 0) list = list.filter(r => r.rating === reviewFilter);
    list.sort((a, b) => {
      if (reviewSort === "recent") return new Date(b.created_at) - new Date(a.created_at);
      if (reviewSort === "highest") return b.rating - a.rating;
      return a.rating - b.rating;
    });
    return list;
  }, [reviews, reviewFilter, reviewSort]);

  
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
        await addToCart({ product_id: product.id, quantity: quantity });
        setCartCount(prev => prev + 1);
        toast.success(isArabic ? "تمت الإضافة للسلة" : "Added to cart");
      } catch (error) {
        toast.error(isArabic ? "فشلت الإضافة" : "Failed to add");
      } finally {
        setTimeout(() => setCartFeedback(null), 1200);
      }
    };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-orange-600">جاري جلب الوجبة اللذيذة...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">الوجبة غير موجودة</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen" dir="rtl">
      
      {/* 1. قسم الصورة والبيانات الأساسية */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 bg-white p-6 rounded-2xl shadow-sm border border-orange-50">
        
        {/* الصور */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden rounded-3xl border-none shadow-inner bg-gray-50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[500px] object-cover transition-transform duration-700 hover:scale-105"
            />
          </Card>
          {/* لو كان هناك مصفوفة صور إضافية */}
          {product.images?.length > 0 && (
            <div className="flex gap-4 mt-6 justify-center">
              {product.images.map((img, i) => (
                <img
                  key={i} src={img} alt="preview"
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-2xl object-cover cursor-pointer border-4 ${selectedImage === i ? "border-orange-500" : "border-transparent opacity-70"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* تفاصيل الطلب */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <Badge className="mb-2 bg-orange-100 text-orange-700 border-none">{product.category?.name}</Badge>
            <h1 className="text-4xl font-black text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-yellow-500">
                <Star size={18} fill="currentColor" />
                <span className="text-gray-900 font-bold mr-1">{parseFloat(product.average_rating) || "0.0"}</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500 text-sm">{product.reviews_count || 0} تقييم</span>
            </div>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-5xl font-black text-orange-600">{product.price} <span className="text-xl">ج.م</span></span>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed italic border-r-4 border-orange-500 pr-4">
            {product.description}
          </p>

          <div className="space-y-4 pt-6">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
              <span className="font-bold text-gray-700">الكمية</span>
              <div className="flex items-center gap-6 bg-white rounded-xl border p-1">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={20}/></Button>
                <span className="text-xl font-black">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}><Plus size={20}/></Button>
              </div>
            </div>

            <div className="flex gap-4">
  {/* زر أضف للحقيبة */}
  <Button 
    disabled={cartFeedback === product.id}
    onClick={(e) => handleAddToCart(e, product)} 
    className={`flex-[4] h-16 text-white text-xl font-black rounded-2xl shadow-lg transition-all active:scale-95 ${
      cartFeedback === product.id ? "bg-green-600 shadow-green-200" : "bg-orange-500 hover:bg-orange-600 shadow-orange-200"
    }`}
  >
    <ShoppingBag className="ml-2 w-6 h-6" /> 
    {cartFeedback === product.id ? "تمت الإضافة!" : "أضف للحقيبة"}
  </Button>

  {/* زر المفضلة */}
  <Button 
    variant="outline" 
    onClick={(e) => toggleFavorite(e, id)}
    className="flex-1 h-16 rounded-2xl border-2 hover:text-red-500 transition-colors group"
  >
    <Heart className={`w-7 h-7 transition-colors ${product.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 group-hover:text-red-500"}`} />
  </Button>
</div>
          </div>

          {/* أيقونات الثقة */}
          <div className="grid grid-cols-3 gap-2 py-4 bg-orange-50/50 rounded-2xl border border-orange-100">
            <div className="text-center">
              <Truck className="w-5 h-5 mx-auto mb-1 text-orange-600" />
              <p className="text-[10px] font-bold">توصيل سريع</p>
            </div>
            <div className="text-center border-x border-orange-200">
              <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-orange-600" />
              <p className="text-[10px] font-bold">أعلى جودة</p>
            </div>
            <div className="text-center">
              <Leaf className="w-5 h-5 mx-auto mb-1 text-orange-600" />
              <p className="text-[10px] font-bold">طازج دائماً</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. قسم التقييمات والمراجعات */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* معلومات إضافية */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <div className="bg-gray-900 p-4 text-white font-bold flex items-center gap-2">
              <Info size={20} /> تفاصيل الوجبة
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">السعرات</span>
                <span className="font-bold">{product.calories || "غير محدد"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">وقت التحضير</span>
                <span className="font-bold">{product.deliveryTime+ ' '+'دقيقة' || "غير محدد"}</span>
              </div>
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle size={16} /> خاضع لمعايير الصحة العالمية
              </div>
            </CardContent>
          </Card>
        </div>

        {/* التعليقات */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black flex items-center gap-2">
                <MessageCircle className="text-orange-500" /> آراء الأكيلة
              </h3>
              <div className="flex gap-2">
                <select onChange={(e) => setReviewSort(e.target.value)} className="text-sm border-none bg-gray-50 rounded-lg p-2">
                  <option value="recent">الأحدث</option>
                  <option value="highest">الأعلى تقييماً</option>
                </select>
              </div>
            </div>

            {/* أضف تقييمك */}
            <div className="bg-orange-50 p-4 rounded-xl mb-8">
              <div className="flex items-center gap-2 mb-3">
                {[1,2,3,4,5].map(star => (
                  <Star 
                    key={star} 
                    size={24} 
                    onClick={() => setNewReviewRating(star)}
                    className={`cursor-pointer ${star <= newReviewRating ? "fill-orange-500 text-orange-500" : "text-gray-300"}`} 
                  />
                ))}
              </div>
              <Textarea 
                placeholder="اكتب رأيك بصراحة عن الطعم..." 
                className="bg-white border-none mb-3"
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
              />
              <Button onClick={handleAddReview} className="bg-gray-900 text-white w-full">نشر التقييم</Button>
            </div>

            {/* قائمة التعليقات */}
            <div className="space-y-6">
              {displayedReviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                        {review.user?.name?.[0] || <User size={18}/>}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{review.user?.name || "عميل مجهول"}</p>
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />)}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={12} /> {new Date(review.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed pr-13">{review.comment}</p>
                </div>
              ))}
              {displayedReviews.length === 0 && <p className="text-center text-gray-400 py-10">لا يوجد تقييمات بعد. كن أول من يقيم!</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;