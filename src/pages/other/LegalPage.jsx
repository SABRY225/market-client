import React from 'react';
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

const LegalPage = ({ title, content = [], lastUpdated }) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className={`max-w-5xl mx-auto px-4 py-8 ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Breadcrumbs / Back navigation (Optional) */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <span className="hover:text-slate-600 cursor-pointer transition-colors">الرئيسية</span>
        {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        <span className="text-slate-800 font-medium">{title}</span>
      </nav>

      <div className="relative">
        {/* Title & Meta */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-slate-400 text-sm">
              تم التحديث في: <span className="text-slate-600 font-medium">{lastUpdated}</span>
            </p>
          )}
        </div>

        {/* Content Card */}
        <div className="bg-white p-6 md:p-12 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-50 leading-loose text-slate-600 relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-1 bg-gradient-to-l from-indigo-500 to-transparent" />
          
          <div className="space-y-6">
            {content.length > 0 ? (
              content.map((paragraph, index) => (
                <p 
                  key={index} 
                  className="text-lg md:text-xl text-slate-700 font-normal leading-relaxed opacity-90 transition-all duration-300 hover:opacity-100"
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <div className="py-20 text-center text-slate-400 italic">
                لا يوجد محتوى متاح حالياً لهذه الصفحة.
              </div>
            )}
          </div>

          {/* Signature/Footer inside the card */}
          <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-slate-400 italic">فريق الالتزام والخصوصية</p>
            <button 
              onClick={() => window.print()} 
              className="text-indigo-600 font-bold hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors"
            >
              تحميل نسخة PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;