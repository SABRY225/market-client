// src/components/LanguageSwitcher.jsx
import { Globe } from "lucide-react"; // استبدلنا FontAwesome بـ Lucide لتوحيد الأيقونات
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'ar';

  const toggleLanguage = () => {
    const newLang = currentLang === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    // نقوم بتغيير اتجاه الصفحة بناءً على اللغة
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="ghost" // جعلناه شفافاً ليتناسب مع الهيدر
      aria-label={currentLang === 'ar' ? 'Change language' : 'تغيير اللغة'}
      className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-100 shadow-sm hover:bg-orange-50 hover:text-orange-600 transition-all group"
    >
      <Globe 
        size={18} 
        className={`transition-transform duration-500 group-hover:rotate-12 ${currentLang === 'ar' ? 'text-orange-500' : 'text-blue-500'}`} 
      />
      
      <div className="flex flex-col items-start leading-none">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
          {currentLang === "ar" ? "English" : "عربي"}
        </span>
        <span className="text-sm font-black text-gray-900">
          {currentLang === "ar" ? "EN" : "AR"}
        </span>
      </div>
    </Button>
  );
};

export default LanguageSwitcher;