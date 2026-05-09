import React, { useState, useEffect,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShoppingCart, Heart, User, Menu, Search, X, Star, ClipboardList, LogOut,
  Bell
} from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { CartContext } from "../Context/CartContext";

// --- API ENDPOINTS CONFIG ---
const ENDPOINTS = {
  CART: `${import.meta.env.VITE_API_URL}/api/v1/client/cart`,
  WISHLIST: `${import.meta.env.VITE_API_URL}/api/v1/client/favorites`,
  ORDERS: `${import.meta.env.VITE_API_URL}/api/v1client/client/orders`
};

function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar';

  // --- STATES ---
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, wishlistCount } = useContext(CartContext);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      setUser(savedUser);
    }
  }, []);


// 1. أضف useState للبحث في البداية
const [searchQuery, setSearchQuery] = useState("");

// 2. دالة التعامل مع البحث
const handleSearch = (e) => {
  // إذا ضغط المستخدم Enter أو ضغط على الأيقونة
  if (e.key === 'Enter' || e.type === 'click') {
    if (searchQuery.trim()) {
      // ننتقل لصفحة المنتجات مع تمرير كلمة البحث كـ Query Parameter
      navigate(`/categories?s=${encodeURIComponent(searchQuery)}`);
      // اختياري: إغلاق القائمة في الموبايل إذا كان البحث من هناك
      setMobileMenuOpen(false);
    }
  }
};

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="w-full" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Utility Bar (نفس الكود السابق) */}
      <div className="bg-gray-900 text-white py-2 px-4 italic text-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <LanguageSwitcher />
          <div className="hidden sm:flex gap-6 text-xs font-bold opacity-80">

            <button onClick={() => navigate("/about")} className="hover:text-orange-400 transition">{t('translation.about_us')}</button>

            <button onClick={() => navigate("/contact")} className="hover:text-orange-400 transition">{t('translation.contact_us')}</button>

            {/* <button onClick={() => navigate("/support-ticket")} className="hover:text-orange-400 transition">{t('translation.help')}</button> */}

          </div>
        </div>
      </div>

      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">

          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={28} />
            </button>
            <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer group">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200 group-hover:rotate-12 transition-transform">
                <ShoppingCart size={24} />
              </div>
              <span className="text-2xl font-black text-gray-900 italic">Marketly</span>
            </div>
          </div>

     {/* Desktop Search */}
<div className="hidden md:flex flex-1 max-w-md relative group">
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    onKeyDown={handleSearch} // تفعيل البحث عند ضغط Enter
    placeholder={t("translation.search_placeholder")}
    className="w-full h-11 bg-gray-100 border-2 border-transparent rounded-xl px-12 focus:ring-0 focus:border-orange-500 focus:bg-white transition-all outline-none"
  />
  <Search 
    className="absolute left-4 top-3 text-gray-400 group-focus-within:text-orange-500 cursor-pointer" 
    size={18} 
    onClick={handleSearch} // تفعيل البحث عند الضغط على الأيقونة
  />
  {searchQuery && (
    <X 
      className="absolute right-4 top-3 text-gray-400 hover:text-red-500 cursor-pointer" 
      size={18} 
      onClick={() => setSearchQuery("")} // مسح النص
    />
  )}
</div>

          {/* User & Actions Area */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <NavIcon icon={Heart} count={wishlistCount} onClick={() => navigate("/wishlist")} />
              <NavIcon icon={ShoppingCart} count={cartCount} onClick={() => navigate("/cart")} />
            </div>

            <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block" />

            {user ? (
              /* --- تظهر هذه القطعة عندما يكون المستخدم مسجل دخول --- */
              <div className="flex items-center gap-3">
                {/* أيقونة الطلبات السابقة */}
                <button
                  onClick={() => navigate("/orders")}
                  className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition relative group"
                  title={t("translation.my_orders")}
                >
                  <ClipboardList size={24} />
                </button>
                <button
                  onClick={() => navigate("/notification")}
                  className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition relative group"
                  title={t("translation.my_orders")}
                >
                  <Bell size={24} />
                </button>

                {/* الملف الشخصي للمستخدم */}
                <div className="flex items-center gap-3 bg-gray-50 p-1.5 pr-4 rounded-2xl border border-gray-100">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-black text-gray-900 leading-tight">{user.name}</p>
                  </div>
                  <div onClick={() => navigate("/profile")} className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 border border-orange-200">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-xl object-cover" />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition">
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            ) : (
              /* --- تظهر هذه القطعة للمستخدمين غير المسجلين --- */
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-2.5 font-bold text-gray-700 hover:text-orange-600 transition"
                >
                  {t("translation.login")}
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg"
                >
                  {t("translation.register")}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer (معدل ليظهر بيانات المستخدم أيضاً) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div className={`absolute top-0 ${isRtl ? 'right-0' : 'left-0'} h-full w-72 bg-white p-6 shadow-2xl`}>
            {user && (
              <div className="mb-8 p-4 bg-orange-50 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <User className="text-orange-500" />
                </div>
                <div>
                  <p className="font-black text-gray-900">{user.name}</p>
                  <p className="text-xs text-orange-600 font-bold">{user.email}</p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <MobileNavItem label={t('translation.my_orders')} icon={ClipboardList} onClick={() => navigate("/orders")} />
              <MobileNavItem label={t('translation.my_orders')} icon={ClipboardList} onClick={() => navigate("/notification")} />
              <MobileNavItem label={t('translation.favorites')} icon={Heart} onClick={() => navigate("/wishlist")} />
              <MobileNavItem label={t('translation.cart')} icon={ShoppingCart} onClick={() => navigate("/cart")} />
              {!user && (
                <div className="pt-6 space-y-3">
                  <button onClick={() => navigate("/login")} className="w-full py-4 rounded-2xl bg-orange-500 text-white font-bold">{t('translation.login')}</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// المكونات الفرعية (NavIcon, MobileNavItem) تبقى كما هي مع تحديث التنسيق البسيط
const NavIcon = ({ icon: Icon, count, onClick }) => (
  <button onClick={onClick} className="p-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all relative group">
    <Icon size={24} className="group-hover:scale-110 transition-transform" />
    {count > 0 && (
      <span className="absolute top-1 right-1 bg-orange-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
        {count}
      </span>
    )}
  </button>
);

const MobileNavItem = ({ label, icon: Icon, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center gap-4 p-4 hover:bg-orange-50 rounded-2xl transition-colors text-gray-700 font-bold">
    <Icon size={22} className="text-orange-500" />
    <span>{label}</span>
  </button>
);

export default Navbar;