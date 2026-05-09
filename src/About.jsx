// src/pages/About.jsx
import React from "react";
import { Users, Utensils, Award, Heart, ShieldCheck, MapPin } from "lucide-react";

export default function About() {
  return (
    <div className="bg-white min-h-screen text-right" dir="rtl">
      {/* Hero Section */}
      <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          alt="Food background"
        />
        <div className="relative z-10 text-center space-y-4 px-4">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
            نحن لا نقدم الطعام فقط، <br/> <span className="text-orange-500">نحن نصنع السعادة.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            بدأت رحلة Foodie من فكرة بسيطة: ربط عشاق الطعام بأفضل المطابخ المحلية بلمسة زر واحدة.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard number="+١٠٠ ألف" label="وجبة شهرياً" />
          <StatCard number="+٥٠٠" label="مطعم شريك" />
          <StatCard number="١٥ دقيقة" label="متوسط التوصيل" />
          <StatCard number="+٥٠" label="مدينة مغطاة" />
        </div>
      </div>

      {/* Mission & Values */}
      <div className="max-w-6xl mx-auto py-24 px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h2 className="text-3xl font-black text-gray-900 border-r-8 border-orange-500 pr-6">ما الذي يميزنا؟</h2>
          <div className="space-y-6">
            <ValueItem 
              icon={Heart} 
              title="الشغف بالجودة" 
              desc="نختار المطاعم بعناية فائقة لضمان حصولك على تجربة طعام مثالية في كل مرة." 
            />
            <ValueItem 
              icon={ShieldCheck} 
              title="الأمان والثقة" 
              desc="عمليات دفع آمنة ومعايير نظافة عالمية بالتعاون مع شركائنا." 
            />
            <ValueItem 
              icon={Utensils} 
              title="دعم المحليين" 
              desc="نعتز بدعمنا للمطاعم المحلية والمشاريع المنزلية الناشئة." 
            />
          </div>
        </div>
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1526367790999-0150786486a2?w=600" 
            className="rounded-[3rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500" 
            alt="Chef"
          />
          <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-8 rounded-[2rem] hidden md:block">
            <Award size={48} />
            <p className="mt-2 font-black text-lg">أفضل تطبيق طعام ٢٠٢٤</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ number, label }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-center border border-gray-50 transition-transform hover:scale-105">
    <p className="text-3xl font-black text-orange-600">{number}</p>
    <p className="text-sm font-bold text-gray-500 mt-2">{label}</p>
  </div>
);

const ValueItem = ({ icon: Icon, title, desc }) => (
  <div className="flex gap-6">
    <div className="bg-orange-100 p-4 rounded-2xl h-fit text-orange-600">
      <Icon size={28} />
    </div>
    <div className="space-y-1">
      <h4 className="text-xl font-black text-gray-800">{title}</h4>
      <p className="text-gray-500 leading-relaxed font-medium">{desc}</p>
    </div>
  </div>
);