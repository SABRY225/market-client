import React from 'react';
import { useTranslation } from "react-i18next";
import { Clock, Truck, Globe, CheckCircle2, AlertCircle } from "lucide-react";

const ShippingPolicy = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const deliverySteps = [
    { title: "تجهيز الطلب", desc: "يتم تجهيز طلبك خلال 24 ساعة من التأكيد." },
    { title: "خروج الشحنة", desc: "يتم تسليم الأوردر لمندوب التوصيل أو شركة الشحن." },
    { title: "التوصيل للمنزل", desc: "يصلك المندوب ويتواصل معك لتحديد الوقت المناسب." },
  ];

  return (
    <div className={`max-w-5xl mx-auto p-6 ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-800 mb-4">{t("سياسة الشحن والتوصيل")}</h1>
        <div className="h-1.5 w-20 bg-indigo-500 mx-auto rounded-full"></div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100 flex items-start gap-5 transition-transform hover:scale-[1.02]">
          <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-indigo-900 font-bold text-xl mb-2">{t("مدة التوصيل")}</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              {t("تستغرق عملية التوصيل من 3 إلى 5 أيام عمل داخل المدن الرئيسية.")}
            </p>
          </div>
        </div>

        <div className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-start gap-5 transition-transform hover:scale-[1.02]">
          <div className="p-3 bg-white rounded-2xl shadow-sm text-emerald-600">
            <Truck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-emerald-900 font-bold text-xl mb-2">{t("تكلفة الشحن")}</h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              {t("الشحن مجاني للطلبات فوق 200 ريال، وإلا تطبق رسوم شحن ثابتة بقيمة 25 ريال.")}
            </p>
          </div>
        </div>
      </div>

      {/* Delivery Process (Timeline) */}
      <div className="bg-slate-50 rounded-[2.5rem] p-8 mb-12">
        <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-2">
          <Globe className="w-6 h-6 text-indigo-500" />
          {t("كيف تصلك شحنتك؟")}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          {deliverySteps.map((step, index) => (
            <div key={index} className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-indigo-200">
                  {index + 1}
                </div>
                {index !== 2 && (
                  <div className="hidden md:block flex-1 h-[2px] bg-indigo-100 mx-4"></div>
                )}
              </div>
              <h4 className="font-bold text-slate-800 text-lg mb-2">{t(step.title)}</h4>
              <p className="text-slate-500 text-sm">{t(step.desc)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <div className="flex items-start gap-4 p-6 bg-amber-50 rounded-2xl border border-amber-100">
        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-amber-900">{t("ملاحظات هامة")}</h4>
          <ul className="list-disc list-inside text-amber-800 mt-2 space-y-1 text-sm opacity-90">
            <li>{t("يتم احتساب أيام العمل من الأحد إلى الخميس.")}</li>
            <li>{t("قد يتأثر وقت التوصيل خلال فترات العروض والمواسم.")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;