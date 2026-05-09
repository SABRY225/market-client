import React from 'react';
import { useTranslation } from "react-i18next";
import { ShieldCheck, UserCheck, EyeOff, MapPin, Lock, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const lastUpdated = "8 يناير 2026";

  const sections = [
    {
      title: "المعلومات التي نجمعها",
      content: "نجمع المعلومات التي تقدمها لنا مباشرة عند طلب أوردر، بما في ذلك الاسم، رقم الهاتف، وعنوان التوصيل لضمان دقة التنفيذ.",
      icon: <UserCheck className="w-6 h-6 text-blue-600" />
    },
    {
      title: "كيف نستخدم معلوماتك",
      content: "نستخدم بياناتك لمعالجة الطلبات، إرسال تحديثات حالة الأوردر عبر الرسائل، وتحسين جودة الخدمة المقدمة لك.",
      icon: <ShieldCheck className="w-6 h-6 text-green-600" />
    },
    {
      title: "مشاركة البيانات",
      content: "نشارك فقط العنوان ورقم الهاتف مع المناديب لضمان وصول الأوردر. نحن نلتزم بعدم بيع بياناتك لأي جهة إعلانية طرف ثالث.",
      icon: <EyeOff className="w-6 h-6 text-orange-600" />
    },
    {
      title: "خدمات الموقع (GPS)",
      content: "نطلب الوصول إلى موقعك الجغرافي لتحديد نقطة التوصيل بدقة، مما يساعد في تسريع عملية الشحن وتفادي أخطاء العناوين.",
      icon: <MapPin className="w-6 h-6 text-red-600" />
    },
    {
      title: "أمن وحماية البيانات",
      content: "نطبق بروتوكولات أمان متقدمة (SSL) لحماية معلوماتك من الوصول غير المصرح به، ونقوم بتشفير بيانات الدفع الحساسة.",
      icon: <Lock className="w-6 h-6 text-purple-600" />
    }
  ];

  return (
    <div className={`max-w-4xl mx-auto p-6 ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Header Section */}
      <header className="text-center mb-16 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 to-transparent h-64 rounded-3xl" />
        <h1 className="text-4xl font-black text-slate-800 mb-4">{t("سياسة الخصوصية")}</h1>
        <div className="flex items-center justify-center gap-2 text-slate-500 font-medium">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          {t("آخر تحديث")}: {lastUpdated}
        </div>
      </header>

      {/* Intro Box */}
      <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm mb-12 leading-relaxed">
        <p className="text-xl text-slate-700 font-medium">
          {t("مرحباً بك في تطبيقنا. نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيف نتعامل مع معلوماتك عند استخدامك لخدمة طلب الأوردرات الخاصة بنا.")}
        </p>
      </div>

      {/* Main Sections Grid */}
      <div className="grid gap-6">
        {sections.map((section, index) => (
          <div 
            key={index} 
            className="group bg-white p-6 rounded-[24px] border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start gap-5">
              <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                {section.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-3 leading-none">
                  {t(section.title)}
                </h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {t(section.content)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Help Footer */}
      <footer className="mt-16 bg-slate-900 rounded-[32px] p-10 text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-4">{t("هل لديك استفسار حول بياناتك؟")}</h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            {t("فريق حماية البيانات لدينا جاهز للرد على كافة تساؤلاتك المتعلقة بالخصوصية.")}
          </p>
          <a 
            href="mailto:support@example.com" 
            className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-blue-50 transition-colors"
          >
            <Mail className="w-5 h-5" />
            support@example.com
          </a>
        </div>
        {/* Background Decorative Circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full -ml-12 -mb-12" />
      </footer>
    </div>
  );
};

export default PrivacyPolicy;