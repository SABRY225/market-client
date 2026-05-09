import React from 'react';
import { useTranslation } from "react-i18next";
import { RotateCcw, CheckCircle, Ban, HelpCircle } from "lucide-react";

const ReturnPolicy = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className={`max-w-4xl mx-auto p-6 ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Header مع أيقونة دائرية */}
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-red-50 rounded-2xl">
          <RotateCcw className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-3xl font-black text-slate-800">
          {t("سياسة الإرجاع والاستبدال")}
        </h1>
      </div>

      <div className="grid gap-6">
        {/* بطاقة الشروط الأساسية */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:border-indigo-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            {t("شروط الإرجاع")}
          </h2>
          
          <ul className="space-y-6">
            <li className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-sm font-bold">1</span>
              <p className="text-slate-600 leading-relaxed">
                {t("يجب تقديم طلب الإرجاع خلال")} <span className="font-bold text-indigo-600 underline underline-offset-4 tracking-tight">14 {t("يوماً")}</span> {t("من تاريخ الاستلام.")}
              </p>
            </li>
            
            <li className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-sm font-bold">2</span>
              <p className="text-slate-600 leading-relaxed">
                {t("يجب أن يكون المنتج في حالته الأصلية وبتغليفه الأصلي مع كافة الملحقات.")}
              </p>
            </li>
          </ul>
        </div>

        {/* بطاقة الاستثناءات (المنتجات التي لا ترد) */}
        <div className="bg-rose-50 p-8 rounded-[32px] border border-rose-100">
          <h2 className="text-xl font-bold text-rose-800 mb-4 flex items-center gap-2">
            <Ban className="w-5 h-5" />
            {t("منتجات لا يمكن إرجاعها")}
          </h2>
          <p className="text-rose-700/80 mb-4">
            {t("لأسباب تتعلق بالصحة العامة والسلامة، نعتذر عن استلام:")}
          </p>
          <div className="flex flex-wrap gap-2">
            {["العطور", "الملابس الداخلية", "منتجات العناية بالشعر"].map((item, i) => (
              <span key={i} className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl text-rose-700 text-sm font-medium border border-rose-200">
                {t(item)}
              </span>
            ))}
          </div>
        </div>

        {/* قسم المساعدة */}
        <div className="flex items-center justify-between p-6 bg-slate-900 rounded-[2rem] text-white overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="font-bold text-lg mb-1">{t("هل لديك استفسار آخر؟")}</h3>
            <p className="text-slate-400 text-sm">{t("تواصل مع فريق خدمة العملاء على مدار الساعة")}</p>
          </div>
          <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-colors relative z-10">
            {t("مساعدة")}
          </button>
          {/* لمسة فنية خلفية */}
          <HelpCircle className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5" />
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;