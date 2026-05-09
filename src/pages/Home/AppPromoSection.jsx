import React from 'react';
import { useTranslation } from "react-i18next";
import { ShoppingBag, Star, Zap, Apple, PlayCircle, Bike, ShieldCheck, Heart } from "lucide-react";

export default function AppPromoSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <section className={`relative py-24 overflow-hidden bg-[#fffdfa] ${isRtl ? 'rtl font-almarai' : 'ltr'}`}>
      
      {/* 1. الخلفية الفنية (Artistic Background) */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-50/50 skew-x-12 translate-x-32 -z-10 rounded-[100px]" />
      <div className="absolute top-40 left-10 w-72 h-72 bg-amber-200/20 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-20">
        
        {/* 2. قسم النصوص (Content Section) */}
        <div className="flex-1 space-y-10 text-center lg:text-right">
          <div className="inline-flex items-center gap-3 bg-white border border-orange-100 shadow-sm px-5 py-2.5 rounded-2xl">
            <div className="flex -space-x-2 rtl:space-x-reverse">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-sm font-bold text-slate-700">
              <span className="text-orange-500 font-black">+10k</span> {t("مستخدم سعيد بالخدمة")}
            </p>
          </div>

          <h2 className="text-6xl lg:text-7xl font-[1000] text-slate-900 leading-[1.05] tracking-tight">
            {t("أسرع طريقة")} <br />
            <span className="bg-gradient-to-l from-orange-600 to-amber-500 bg-clip-text text-transparent">
               {t("لطلب طعامك")}
            </span>
          </h2>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
            {t("لقد قمنا بتبسيط عملية الجوع! اختر مطعمك، حدد وجبتك، واترك الباقي لأسطولنا السريع.")}
          </p>

          {/* أزرار التحميل الاحترافية */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-5">
            <button className="group relative bg-slate-900 text-white px-9 py-5 rounded-[22px] flex items-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-200">
              <Apple className="w-8 h-8" />
              <div className="text-left rtl:text-right leading-tight">
                <span className="text-[11px] font-medium opacity-60 block uppercase tracking-wider">Download on</span>
                <span className="text-xl font-black italic">App Store</span>
              </div>
            </button>

            <button className="group relative bg-white border-2 border-slate-100 text-slate-900 px-9 py-5 rounded-[22px] flex items-center gap-4 transition-all hover:scale-105 hover:border-orange-200 active:scale-95 shadow-xl shadow-slate-100">
              <PlayCircle className="w-8 h-8 text-orange-500" />
              <div className="text-left rtl:text-right leading-tight">
                <span className="text-[11px] font-medium opacity-60 block uppercase tracking-wider">Get it on</span>
                <span className="text-xl font-black italic">Google Play</span>
              </div>
            </button>
          </div>
        </div>

        {/* 3. قسم الموبايل التفاعلي (Interactive Device Section) */}
        <div className="relative">
          
          {/* كرت تتبع السائق (Floating Tracker) */}
          <div className="absolute -right-16 top-20 bg-white/80 backdrop-blur-xl p-5 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 z-30 animate-float hidden xl:block">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                  <Bike className="w-8 h-8" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800">{t("كابتن أحمد")}</p>
                <p className="text-[11px] font-bold text-orange-500 uppercase tracking-widest">{t("في الطريق إليك")}</p>
              </div>
            </div>
          </div>

          {/* كرت الثقة (Security Tag) */}
          <div className="absolute -left-10 bottom-24 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl z-30 flex items-center gap-3 animate-float-delayed">
             <ShieldCheck className="text-green-400 w-5 h-5" />
             <span className="text-sm font-bold tracking-tight">{t("دفع آمن 100%")}</span>
          </div>

          {/* هيكل الآيفون (iPhone Mockup) */}
          <div className="relative w-[320px] h-[650px] bg-slate-900 rounded-[3.5rem] p-3 shadow-[0_80px_100px_-30px_rgba(251,146,60,0.4)] border-[10px] border-slate-800">
            {/* الحساسات (Notch) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-3xl z-40 flex items-center justify-center gap-2">
               <div className="w-10 h-1 bg-slate-700 rounded-full" />
               <div className="w-2 h-2 bg-slate-700 rounded-full" />
            </div>

            <div className="w-full h-full bg-slate-50 rounded-[2.8rem] overflow-hidden flex flex-col relative">
              {/* واجهة التطبيق */}
              <div className="bg-white p-6 pt-10 pb-4 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                  <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">{t("اكتشف الأطباق")}</h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                {/* وجبة مميزة */}
                <div className="relative h-44 rounded-[2rem] overflow-hidden group">
                   <img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=500" className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="pizza" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-5 flex flex-col justify-end">
                      <p className="text-white font-black text-lg">بيتزا إيطالية 🍕</p>
                      <p className="text-orange-400 text-xs font-bold">{t("خصم لفترة محدودة")}</p>
                   </div>
                </div>

                {/* قائمة صغيرة */}
                <div className="space-y-3">
                  {[1].map(i => (
                    <div key={i} className="flex items-center gap-4 bg-white p-3 rounded-[20px] shadow-sm">
                       <div className="w-14 h-14 bg-orange-50 rounded-xl overflow-hidden">
                          <img src={`https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100`} className="w-full h-full object-cover" alt="food" />
                       </div>
                       <div className="flex-1">
                          <p className="font-bold text-slate-800 text-sm">{t("بيتزا إيطالية")}</p>
                          <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                             <Star className="w-3 h-3 fill-amber-500" /> 4.9 (1.2k)
                          </div>
                       </div>
                       <p className="font-black text-slate-900 text-sm">$12</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="h-20 bg-white/80 backdrop-blur-md border-t border-slate-100 flex justify-around items-center px-6">
                 <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-100">
                    <ShoppingBag className="w-6 h-6" />
                 </div>
                 <div className="w-10 h-10 bg-slate-50 rounded-xl" />
                 <div className="w-10 h-10 bg-slate-50 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// أضف هذه الأنميشن في ملف CSS الخاص بك
// @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
// .animate-float { animation: float 6s ease-in-out infinite; }
// .animate-float-delayed { animation: float 6s ease-in-out infinite 2s; }