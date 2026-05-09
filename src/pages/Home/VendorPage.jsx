import { ArrowRight, Star, Store, Users } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
function VendorPage({vendors}) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar' ? true : false; // Check language via translation key
  // Featured Vendors & Customer Reviews (mock data)
  // const vendors = [
  //   {
  //     id: 1,
  //     name: isArabic ? 'برجر هاوس' : 'Burger House',
  //     logo: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop',
  //     category: isArabic ? 'وجبات سريعة' : 'Fast Food',
  //     rating: 4.8,
  //     products: 45,
  //     followers: 15200
  //   },
  //   {
  //     id: 2,
  //     name: isArabic ? 'بيتزا إيطاليانو' : 'Pizza Italiano',
  //     logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop',
  //     category: isArabic ? 'مأكولات إيطالية' : 'Italian Food',
  //     rating: 4.7,
  //     products: 38,
  //     followers: 12400
  //   },
  //   {
  //     id: 3,
  //     name: isArabic ? 'سوشي ماستر' : 'Sushi Master',
  //     logo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&h=200&fit=crop',
  //     category: isArabic ? 'مأكولات آسيوية' : 'Asian Food',
  //     rating: 4.9,
  //     products: 62,
  //     followers: 8900
  //   },
  //   {
  //     id: 4,
  //     name: isArabic ? 'ذا كوفي شوب' : 'The Coffee Shop',
  //     logo: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop',
  //     category: isArabic ? 'مشروبات وحلويات' : 'Drinks & Desserts',
  //     rating: 4.6,
  //     products: 55,
  //     followers: 21000
  //   },
  // ];
  const checkAuthAndNavigate = (targetPath) => {
    const usertoken = localStorage.getItem('token'); // أو أي وسيلة تستخدمها للتأكد من التسجيل

    if (!usertoken) {
      // toast.error(isArabic ? 'يرجى تسجيل الدخول أولاً للوصول إلى هذا المحتوى' : 'Please login first to access this content');
      // توجيه المستخدم لصفحة تسجيل الدخول مع حفظ المسار الذي كان يحاول الذهاب إليه
      navigate('/login', { state: { from: targetPath } });
      return false;
    }

    navigate(targetPath);
    return true;
  };
  
  return (
    <section className="max-w-7xl mx-auto px-4 pb-6" id="restaurants-section">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Store className="w-5 h-5 text-orange-600" />
            {isArabic ? 'مطاعم مميزة' : 'Featured Vendors'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {isArabic ? 'اكتشف أفضل المطاعم لدينا' : 'Discover top-performing stores'}
          </p>
        </div>
        {vendors == 4 ? <button className="hidden md:inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700">
          {isArabic ? 'عرض الكل' : 'View all'} <ArrowRight className="w-4 h-4" />
        </button>:"" }
        
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vendors.map(v => (
          <div key={v.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <img src={v.image_url} alt={v.name_en} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <div className="font-semibold text-gray-800">{v.name_en}</div>
                <div className="text-xs text-gray-500">{v.category}</div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 text-sm">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4" />
                <span className="font-medium text-gray-700">{v.avgRating}</span>
              </div>
              <div className="text-gray-500">{v.menusCount} {isArabic ? 'منتج' : 'products'}</div>
              <div className="flex items-center gap-1 text-gray-500">
                <Users className="w-4 h-4" />
                <span>{v.buyersCount}</span>
              </div>
            </div>
            {/* داخل خريطة vendors.map */}
            <button
              className="mt-4 w-full px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition"
              onClick={() => checkAuthAndNavigate(`/restaurant-details/${v.id}`)} // استخدام دالة التحقق هنا
            >
              {isArabic ? 'زيارة المتجر' : 'Visit Store'}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default VendorPage