import React from 'react';
import { useTranslation } from "react-i18next";
import { 
  Mail, Phone, MapPin, Facebook, Twitter, Instagram, 
  Youtube, Linkedin, Apple, PlayCircle, Send, CreditCard 
} from 'lucide-react';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <footer className={`bg-[#0f172a] text-slate-300 mt-20 print:hidden ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* 1. قسم الاشتراك في النشرة الإخبارية (Newsletter) */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-right">
            <h3 className="text-2xl font-black text-white">{t("انضم إلى عائلتنا")}</h3>
            <p className="text-slate-400">{t("احصل على عروض حصرية وخصومات تصل إلى 50%")}</p>
          </div>
          <div className="w-full md:w-auto">
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder={t("بريدك الإلكتروني")} 
                className="bg-slate-800 border-none rounded-2xl px-6 py-4 w-full md:w-80 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-2xl transition-all shadow-lg shadow-orange-500/20">
                <Send size={24} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* العمود الأول: براند الشركة */}
          <div className="space-y-6">
            <h3 className="text-3xl font-black text-white italic tracking-tighter">
              MARKET<span className="text-orange-500">LY</span>
            </h3>
            <p className="text-slate-400 leading-relaxed">
              {t("أسرع خدمة توصيل طعام في منطقتك. نحن نضمن لك الجودة والسرعة في كل أوردر يصل إليك.")}
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
            </div>
          </div>

          {/* العمود الثاني: روابط سريعة */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">{t("خدمة العملاء")}</h4>
            <ul className="space-y-4">
              <FooterLink href="/about" label="من نحن" />
              <FooterLink href="/faq" label="الأسئلة الشائعة" />
              <FooterLink href="/shipping-policy" label="سياسة التوصيل" />
              <FooterLink href="/privacy" label="سياسة الخصوصية" />
              <FooterLink href="/terms" label="الشروط والأحكام" />
            </ul>
          </div>

          {/* العمود الثالث: تواصل معنا */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">{t("تواصل معنا")}</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-orange-500">
                  <Mail size={18} />
                </div>
                <span className="text-sm">support@marketly.com</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-orange-500">
                  <Phone size={18} />
                </div>
                <span className="text-sm">+966 50 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-orange-500">
                  <MapPin size={18} />
                </div>
                <span className="text-sm">{t("الرياض، المملكة العربية السعودية")}</span>
              </li>
            </ul>
          </div>

          {/* العمود الرابع: تحميل التطبيق */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">{t("حمل تطبيقنا")}</h4>
            <div className="space-y-3">
              <AppButton icon={<Apple size={20} />} store="App Store" />
              <AppButton icon={<PlayCircle size={20} />} store="Google Play" />
            </div>
          </div>
        </div>

        {/* القسم السفلي: الحقوق وطرق الدفع */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Marketly. {t("جميع الحقوق محفوظة.")}
          </p>
          
          <div className="flex items-center gap-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
            <CreditCard size={32} />
            <div className="flex gap-2 font-bold italic text-slate-400">
              <span className="border border-slate-700 px-2 rounded">VISA</span>
              <span className="border border-slate-700 px-2 rounded">MADA</span>
              <span className="border border-slate-700 px-2 rounded">APPLE PAY</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// مكونات فرعية (Sub-components) لتقليل تكرار الكود
const FooterLink = ({ href, label }) => (
  <li>
    <a href={href} className="hover:text-orange-500 transition-colors duration-300 block">
      {label}
    </a>
  </li>
);

const SocialIcon = ({ icon }) => (
  <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-orange-500 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300">
    {icon}
  </a>
);

const AppButton = ({ icon, store }) => (
  <button className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 p-3 rounded-2xl flex items-center gap-3 transition-all group">
    <div className="text-orange-500 group-hover:text-white transition-colors">{icon}</div>
    <div className="text-left rtl:text-right leading-none">
      <span className="text-[10px] block opacity-50 uppercase tracking-tighter">Download on</span>
      <span className="text-sm font-bold text-white">{store}</span>
    </div>
  </button>
);

export default Footer;