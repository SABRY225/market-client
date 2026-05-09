import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FiShoppingBag, FiMapPin, FiPhone, FiMail, 
  FiClock, FiEdit3, FiArrowRight, FiCheckCircle, FiInfo 
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import toast, { Toaster } from 'react-hot-toast';
import getSallerInfo from "../lib/saller/fetchSallerInfo";

const WORK_DAYS = [
  { key: "sat", label: "السبت" }, { key: "sun", label: "الأحد" },
  { key: "mon", label: "الاثنين" }, { key: "tue", label: "الثلاثاء" },
  { key: "wed", label: "الأربعاء" }, { key: "thu", label: "الخميس" },
  { key: "fri", label: "الجمعة" },
];

export default function VendorStoreSettings() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getSallerInfo();
        setSeller(data);
      } catch (err) {
        toast.error("فشل في تحميل بيانات البروفايل");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600 border-opacity-20 border-t-purple-600"></div>
        <p className="text-gray-500 font-bold animate-pulse">جاري تحميل بيانات المتجر...</p>
      </div>
    </div>
  );

  // حالة في حال لم يتم العثور على بائع
  if (!seller) return <div className="text-center py-20 font-bold text-gray-500">لم يتم العثور على بيانات المتجر</div>;

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-12" dir="rtl">
      <Toaster />
      
      {/* 1. Cover Photo & Actions */}
      <div className="relative h-64 md:h-96 bg-gray-200 overflow-hidden group">
        <img 
          src={seller.cover || "https://via.placeholder.com/1200x400?text=Store+Cover"} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          alt="Cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* زر التعديل السريع على الغلاف (اختياري) */}
        {/* <button className="absolute bottom-6 left-6 bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white hover:text-gray-900 transition-all">
          <FiEdit3 /> تحديث الغلاف
        </button> */}
      </div>

      {/* 2. Profile Header Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 md:-mt-24 mb-10 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
          <div className="flex items-end gap-6 w-full">
            <div className="relative">
              <div className="w-32 h-32 md:w-44 md:h-44 bg-white rounded-[2.5rem] shadow-2xl border-8 border-white overflow-hidden shrink-0 flex items-center justify-center">
                <img src={seller?.image_url} className="w-full h-full object-contain p-2" alt="Logo" />
              </div>
              {/* <button className="absolute bottom-2 right-2 p-2 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 border-2 border-white transition-all">
                <FiEdit3 size={16} />
              </button> */}
            </div>
            
            <div className="mb-4 space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900">{seller?.name_ar}</h1>
                <div className="bg-blue-100 text-blue-600 p-1 rounded-full"><FiCheckCircle size={20} fill="currentColor" className="text-white" /></div>
              </div>
              <p className="text-gray-500 text-lg font-bold">{seller?.name_en} • <span className="text-purple-600">{seller?.category || "مطاعم"}</span></p>
            </div>
          </div>
{/* 
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={() => navigate(`/seller/settings/edit`)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-purple-200 hover:bg-purple-700 hover:translate-y-[-2px] transition-all"
            >
              <FiEdit3 /> تعديل البيانات
            </button>
          </div> */}
        </div>

        {/* 3. Detailed Stats (تحسين جديد للمظهر) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* العمود الأيمن: الوصف والموقع */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                <FiInfo className="text-purple-500" /> عن المتجر
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {seller?.short_description || "لا يوجد وصف حالياً."}
              </p>
              
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-gray-50">
                <div className="space-y-1">
                  <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">المالك المسؤول</span>
                  <p className="font-black text-gray-800">{seller?.owner}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">حالة المتجر</span>
                  <p className="flex items-center gap-2 font-black text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> نشط حالياً
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">تاريخ الانضمام</span>
                  <p className="font-black text-gray-800">يناير 2024</p>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-black flex items-center gap-3"><FiMapPin className="text-red-500"/> العنوان والموقع</h3>
                 <button className="text-blue-600 font-bold text-sm hover:underline">تعديل الإحداثيات</button>
              </div>
              
              <div className="mb-6 rounded-3xl overflow-hidden h-72 border border-gray-100 relative shadow-inner">
                <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
                  <GoogleMap
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    center={{ lat: parseFloat(seller?.latitude) || 30.0444, lng: parseFloat(seller?.longitude) || 31.2357 }}
                    zoom={15}
                    options={{ 
                      disableDefaultUI: false,
                      styles: mapStyle // يمكنك إضافة ستايل مخصص للخريطة هنا
                    }}
                  >
                    <Marker position={{ lat: parseFloat(seller?.latitude), lng: parseFloat(seller?.longitude) }} />
                  </GoogleMap>
                </LoadScript>
              </div>

              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl">
                <div className="p-4 bg-white shadow-sm rounded-xl text-red-500"><FiMapPin size={24} /></div>
                <div>
                  <p className="font-black text-gray-900 text-lg">{seller?.city} - {seller?.area}</p>
                  <p className="text-gray-500 font-medium">{seller?.address}</p>
                </div>
              </div>
            </section>
          </div>

          {/* العمود الأيسر: التواصل وأوقات العمل */}
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h3 className="text-xl font-black mb-6 text-gray-900 border-r-4 border-purple-500 pr-3">قنوات التواصل</h3>
              <div className="space-y-3">
                <ContactLink icon={<FiPhone />} label={seller?.phone} href={`tel:${seller?.phone}`} color="blue" />
                <ContactLink icon={<FaWhatsapp />} label="واتساب الأعمال" href={`https://wa.me/${seller?.whatsapp}`} color="green" />
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent transition-all">
                  <div className="text-gray-400"><FiMail size={20} /></div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-400 font-bold uppercase">البريد الإلكتروني</p>
                    <p className="font-bold text-gray-700 truncate">{seller?.email}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-24 h-24 bg-orange-500/5 rounded-full -translate-x-10 -translate-y-10"></div>
              <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-900">
                <FiClock className="text-orange-500"/> مواعيد الاستلام
              </h3>
              
              <div className="space-y-4">
                {seller?.is24Hours ? (
                  <div className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl font-black text-center shadow-lg shadow-orange-100">
                    <p className="text-2xl">مفتوح 24 ساعة</p>
                    <p className="text-xs opacity-80 mt-1 font-medium">نحن نستقبل الطلبات طوال اليوم</p>
                  </div>
                ) : (
                  <div className="flex justify-around items-center p-5 bg-orange-50 rounded-2xl border border-orange-100 shadow-inner">
                    <div className="text-center">
                      <span className="block text-xs font-bold text-orange-400 uppercase">من</span>
                      <span className="text-xl font-black text-orange-700">{seller?.openTime}</span>
                    </div>
                    <div className="w-[1px] h-8 bg-orange-200"></div>
                    <div className="text-center">
                      <span className="block text-xs font-bold text-orange-400 uppercase">إلى</span>
                      <span className="text-xl font-black text-orange-700">{seller?.closeTime}</span>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-4 gap-2 pt-4">
                  {WORK_DAYS.map((d) => (
                    <div key={d?.key} 
                      className={`py-2 rounded-xl text-center text-[10px] font-black transition-all ${seller?.working_days?.includes(d?.key) ? "bg-purple-100 text-purple-700 border border-purple-200" : "bg-gray-50 text-gray-300 border border-gray-100 opacity-60"}`}>
                      {d?.label}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}

// مكون فرعي لروابط التواصل لتقليل التكرار
function ContactLink({ icon, label, href, color }) {
  const colors = {
    blue: "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200",
    green: "hover:bg-green-50 hover:text-green-600 hover:border-green-200"
  };
  
  return (
    <a href={href} className={`flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent transition-all group ${colors[color]}`}>
      <div className="text-gray-400 group-hover:scale-110 transition-transform">{icon}</div>
      <span className="font-black text-gray-700">{label}</span>
    </a>
  );
}

const mapStyle = [/* يمكنك إضافة Json ستايل الخريطة هنا لتكون بلون مخصص */];