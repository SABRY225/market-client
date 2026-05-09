import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Badge } from "../components/ui/badge";
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  Flame, 
  Clock, 
  Bell, 
  ChevronRight,
  Utensils,
  X,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "../components/ui/button";
import getFavorites from "../lib/client/wishlist/fetchFavorites";
import deleteFavorites from "../lib/client/wishlist/deleteFavorite";
import { CartContext } from "../Context/CartContext";

// دالة تنسيق العملة
const formatCurrency = (amount) => 
  new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount || 0);

export default function FoodWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const { setWishlistCount } = useContext(CartContext);

  // --- 1. جلب البيانات من السيرفر عند تحميل الصفحة ---
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await getFavorites();
      console.log(response);
      
      setWishlist(response);
      setError(null);
    } catch (err) {
      setError("فشل في تحميل قائمة المفضلة، يرجى التحقق من الاتصال.");
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // --- 2. دالة حذف وجبة من المفضلة ---
  const removeItem = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await deleteFavorites(id);
      // تحديث الواجهة فوراً بعد الحذف من السيرفر
      setWishlist(prev => prev.filter(item => item.id !== id));
      setWishlistCount(prev => prev - 1);
      showNotification('remove', "تمت إزالة الوجبة من مفضلتك");
    } catch (err) {
      showNotification('error', "عذراً، تعذر حذف الوجبة حالياً");
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- حالة التحميل (Loading View) ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="font-bold text-gray-600">جاري تحميل أطباقك المفضلة...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20 px-4 pt-10 text-right" dir="rtl">
      
      {/* رأس الصفحة */}
      <div className="max-w-5xl mx-auto flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-2xl">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            </div>
            وجباتي المفضلة
          </h1>
          <p className="text-gray-500 mt-2 font-medium">الوجبات التي تنتظر تذوقها مرة أخرى</p>
        </div>
        <Badge className="bg-white border border-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm shadow-sm">
          {wishlist.length} أصناف
        </Badge>
      </div>

      {/* تنبيه الخطأ */}
      {error && (
        <div className="max-w-5xl mx-auto mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center justify-between border border-red-100">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle size={20} /> {error}
          </div>
          <button onClick={fetchWishlist} className="bg-red-600 text-white px-4 py-1 rounded-lg text-sm">تحديث</button>
        </div>
      )}

      {/* التنبيهات العائمة (Toasts) */}
      {notification && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in zoom-in duration-300 ${notification.type === 'error' ? 'bg-red-600' : 'bg-gray-900'} text-white`}>
          {notification.type === 'remove' ? <Trash2 size={18} /> : <AlertCircle size={18} />}
          <span className="font-bold">{notification.message}</span>
          <button onClick={() => setNotification(null)}><X size={16}/></button>
        </div>
      )}

      {/* القائمة الرئيسية */}
      <div className="max-w-5xl mx-auto">
        {wishlist.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] shadow-sm text-center border border-dashed border-gray-200">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Utensils className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">لا توجد وجبات مفضلة!</h2>
            <p className="text-gray-500 mt-2 max-w-xs mx-auto">ابدأ بإضافة الوجبات التي تحبها لتجدها هنا دائماً.</p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="mt-8 bg-orange-500 hover:bg-orange-600 rounded-2xl px-10 h-14 font-bold shadow-lg shadow-orange-100"
            >
               ابدأ باستكشاف المطاعم
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {wishlist.map((item) => (
              <div 
                key={item.id} 
                className="group bg-white rounded-[2.5rem] p-4 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-transparent hover:border-orange-100"
              >
                {/* قسم الصورة */}
                <div className="relative w-full md:w-56 h-44 rounded-[2rem] overflow-hidden">
                  <img 
                    src={item.menu?.image} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={item.name} 
                  />
                  {!item.menu?.is_available && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white font-bold bg-black/20 px-4 py-2 rounded-xl border border-white/30 text-sm">غير متوفر حالياً</span>
                    </div>
                  )}
                </div>

                {/* قسم التفاصيل */}
                <div className="flex-1 space-y-2 text-center md:text-right">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <h3 className="text-2xl font-black text-gray-900">{item.menu?.name }</h3>
                    <p className="text-orange-600 font-bold flex items-center justify-center md:justify-end gap-1">
                      <Utensils size={14} /> {item.menu?.vendor?.name_ar}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Flame size={14} className="text-orange-400" /> {item.menu?.calories || ""} سعرة
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {item.menu?.deliveryTime || ""} دقيقة
                    </span>
                  </div>

                  {item.menu?.type=="offer" && (
                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-lg text-xs font-bold mt-2">
                      <Bell size={12} className="animate-pulse" /> {(item.menu?.price_before_discount - item.menu?.price  )/ item.menu?.price_before_discount * 100}% خصم
                    </div>
                  )}
                </div>

                {/* قسم الأسعار والإجراءات */}
                <div className="w-full md:w-auto flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-r border-gray-50 pt-4 md:pt-0 md:pr-6">
                  <div className="text-right">
                    <p className="text-3xl font-black text-gray-900">
                      {formatCurrency(item.menu?.price )}
                    </p>
                    {item.menu?.price > item.menu?.price_before_discount && (
                      <p className="text-sm text-gray-400 line-through font-bold">
                        {formatCurrency(item.menu?.price_before_discount)}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {/* <Button 
                      disabled={!item.menu?.is_available}
                      className={`h-14 px-8 rounded-2xl font-black flex items-center gap-3 transition-all ${
                        item.menu?.is_available 
                        ? 'bg-gray-900 hover:bg-orange-600 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      طلب الوجبة
                      <ChevronRight size={18} className="rotate-180" />
                    </Button> */}
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-4 rounded-2xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-gray-100"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}