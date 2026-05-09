import React from 'react';
import { useTranslation } from "react-i18next";
import { ShieldCheck, Truck, Lock, Eye, MapPin, CreditCard } from "lucide-react"; // مكتبة أيقونات خفيفة

const PrivacyPolicy = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const policies = [
    {
      title: "المعلومات التي نجمعها",
      content: "نقوم بجمع البيانات الشخصية التي تقدمها عند التسجيل أو طلب أوردر، مثل الاسم، رقم الجوال، وعنوان التوصيل لضمان وصول الخدمة إليك.",
      icon: <Eye className="w-6 h-6 text-blue-500" />
    },
    {
      title: "خدمات الموقع الجغرافي",
      content: "نستخدم تقنية GPS لتحديد موقعك بدقة، مما يساعد المناديب في الوصول إليك في أسرع وقت ممكن وتقليل أخطاء العنوان.",
      icon: <MapPin className="w-6 h-6 text-red-500" />
    },
    {
      title: "أمن المدفوعات",
      content: "تتم معالجة جميع عمليات الدفع الإلكتروني عبر بوابات دفع مشفرة ومعتمدة. نحن لا نخزن بيانات بطاقتك الائتمانية على خوادمنا.",
      icon: <CreditCard className="w-6 h-6 text-green-500" />
    },
    {
      title: "مشاركة البيانات",
      content: "يتم مشاركة اسمك ورقم هاتفك وعنوانك فقط مع المتجر ومندوب التوصيل لإتمام عملية الأوردر بنجاح.",
      icon: <Truck className="w-6 h-6 text-orange-500" />
    },
    {
      title: "حماية الخصوصية",
      content: "نلتزم بحماية بياناتك باستخدام أحدث تقنيات التشفير SSL، ونضمن عدم بيع بياناتك لأي جهات تسويقية خارجية.",
      icon: <Lock className="w-6 h-6 text-purple-500" />
    }
  ];
  console.log(policies);
  
  return (
    <div className={`max-w-4xl mx-auto p-6 ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-block p-3 bg-blue-50 rounded-full mb-4">
          <ShieldCheck className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
          {t("سياسة الخصوصية")}
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
          نحن نقدر ثقتك بنا، لذا نلتزم بشفافية كاملة حول كيفية استخدامنا لبياناتك لتوفير أفضل تجربة طلب وتوصيل.
        </p>
      </div>

      {/* Policies List */}
      <div className="space-y-4">
        {policies.map((policy, index) => (
          <div 
            key={index} 
            className=" collapse-arrow bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            
            <div className="collapse-title flex items-center gap-4 text-xl font-bold text-slate-700 p-5">
              <span className="p-2 bg-slate-50 rounded-lg group-hover:bg-white">
                {policy.icon}
              </span>
              {policy.title}
            </div>

            <div className="collapse-content px-5 pb-5 pt-0">
              <div className="h-[1px] bg-slate-100 mb-4 mx-2"></div>
              <p className="text-slate-600 leading-relaxed text-lg px-2">
                {t(policy.content)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Footer */}
      <div className="mt-12 p-8 bg-slate-900 rounded-3xl text-center text-white">
        <h3 className="text-xl font-bold mb-2">لديك استفسار حول خصوصيتك؟</h3>
        <p className="text-slate-400 mb-6">فريق الدعم القانوني متاح دائماً للإجابة على تساؤلاتك.</p>
        <button className="btn btn-primary px-8 rounded-xl capitalize">
          تواصل معنا
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;