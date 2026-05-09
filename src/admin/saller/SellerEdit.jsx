import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FiUploadCloud, FiShoppingBag, FiMapPin, FiPhone, 
  FiMail, FiClock, FiSave, FiArrowRight, FiInfo, FiGlobe 
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import toast from 'react-hot-toast';
import getVendor from "../../lib/fetchVendor";
import updateSaller from "../../lib/Admin/updateSaller";

const WORK_DAYS = [
  { key: "sat", label: "السبت" }, { key: "sun", label: "الأحد" },
  { key: "mon", label: "الاثنين" }, { key: "tue", label: "الثلاثاء" },
  { key: "wed", label: "الأربعاء" }, { key: "thu", label: "الخميس" },
  { key: "fri", label: "الجمعة" },
];

export default function SellerEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("general");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name_ar: "", name_en: "", short_description: "", owner: "",
    phone: "", whatsapp: "", email: "",
    city: "", area: "", address: "",
    latitude: 30.0444, longitude: 31.2357,
    openTime: "", closeTime: "", is24Hours: false,
    working_days: [],
  });

  const [previews, setPreviews] = useState({ logo: null, cover: null });
  const [files, setFiles] = useState({ logo: null, cover: null });

  // جلب البيانات الحالية (Mock Data - استبدلها بطلب API)
// ✅ الطريقة الصحيحة
useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getVendor(id);
      // تأكد من تحديث الحقول التي قد تكون null في قاعدة البيانات لتجنب مشاكل الـ Controlled Inputs
      setForm({
        ...data,
        working_days: data.working_days || [], // ضمان وجود مصفوفة
      });
    } catch (error) {
      toast.error("فشل في جلب بيانات التاجر");
    }
  };

  fetchData();
}, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(s => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviews(p => ({ ...p, [type]: URL.createObjectURL(file) }));
    setFiles(f => ({ ...f, [type]: file }));
  };

  const toggleDay = (key) => {
    setForm(s => ({
      ...s,
      working_days: s.working_days.includes(key) 
        ? s.working_days.filter(d => d !== key) 
        : [...s.working_days, key]
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
            const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "working_days") {
    // إرسال المصفوفة كـ نص JSON بدلاً من حقول متكررة
    formData.append(key, JSON.stringify(value));
  } else if (Array.isArray(value)) {
          value.forEach(v => formData.append(`${key}[]`, v));
        } else {
          formData.append(key, value);
        }
      });
      if (files.logo) formData.append("logo", files.logo);
      if (files.cover) formData.append("cover", files.cover);

      // Logic إرسال البيانات (FormData)
      await updateSaller(formData,id)
      toast.success("تم تحديث بيانات البروفايل بنجاح ✨");
      navigate(-1);
    } catch (err) {
      toast.error("حدث خطأ أثناء التحديث");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] pb-20" dir="rtl">
      {/* Top Navigation */}
      <div className="bg-white border-b sticky top-0 z-30 px-4 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <FiArrowRight size={22} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">تعديل الملف الشخصي</h1>
          </div>
          <button 
            form="edit-form"
            disabled={submitting}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
          >
            {submitting ? "جاري الحفظ..." : <><FiSave /> حفظ التغييرات</>}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        {/* Images Edit Section */}
        <div className="relative mb-12">
          <div className="h-48 md:h-64 rounded-3xl overflow-hidden bg-gray-200 shadow-inner group relative">
            {previews.cover ? (
                <img src={previews.cover} className="w-full h-full object-cover" alt="" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">صورة الغلاف</div>
            )}
            <label className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30 text-white">
                <FiUploadCloud size={30} />
              </div>
              <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'cover')} />
            </label>
          </div>

          <div className="absolute -bottom-10 right-10">
            <div className="relative group w-32 h-32 md:w-40 md:h-40 bg-white rounded-[2.5rem] shadow-2xl border-4 border-white overflow-hidden">
                {previews.logo ? (
                    <img src={previews.logo} className="w-full h-full object-cover" alt="" />
                ) : (
                    <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-200"><FiShoppingBag size={40}/></div>
                )}
              <label className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-all">
                <FiUploadCloud size={24} />
                <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'logo')} />
              </label>
            </div>
          </div>
        </div>

        {/* Tabs UI */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar border-b mb-8">
          {[
            { id: "general", label: "البيانات الأساسية", icon: <FiInfo /> },
            { id: "location", label: "العنوان والموقع", icon: <FiMapPin /> },
            { id: "contact", label: "التواصل", icon: <FiPhone /> },
            { id: "hours", label: "أوقات العمل", icon: <FiClock /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <form id="edit-form" onSubmit={handleSave} className="space-y-6">
          
          {activeTab === "general" && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600">اسم المنشأة (عربي)</label>
                  <input name="name_ar" value={form.name_ar} onChange={handleChange} className="w-full bg-gray-50 border-gray-100 rounded-2xl p-4 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600">الاسم (English)</label>
                  <input name="name_en" value={form.name_en} onChange={handleChange} className="w-full bg-gray-50 border-gray-100 rounded-2xl p-4 text-left focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-600">وصف قصير</label>
                  <textarea name="short_description" value={form.short_description} onChange={handleChange} rows="4" className="w-full bg-gray-50 border-gray-100 rounded-2xl p-4 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "location" && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-6 animate-in slide-in-from-left duration-500">
              <div className="h-80 rounded-2xl overflow-hidden border">
                <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
                  <GoogleMap
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    center={{ lat: parseFloat(form.latitude), lng: parseFloat(form.longitude) }}
                    zoom={15}
                    onClick={(e) => setForm(s => ({ ...s, latitude: e.latLng.lat(), longitude: e.latLng.lng() }))}
                  >
                    <Marker position={{ lat: parseFloat(form.latitude), lng: parseFloat(form.longitude) }} />
                  </GoogleMap>
                </LoadScript>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="city" value={form.city} onChange={handleChange} placeholder="المدينة" className="bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500" />
                <input name="area" value={form.area} onChange={handleChange} placeholder="الحي" className="bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500" />
                <input name="address" value={form.address} onChange={handleChange} placeholder="العنوان بالتفصيل" className="bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <FiPhone className="absolute top-5 right-4 text-gray-400" />
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="رقم الهاتف" className="w-full bg-gray-50 border-none rounded-2xl pr-12 p-4 outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="relative">
                  <FaWhatsapp className="absolute top-5 right-4 text-green-500" />
                  <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="رقم الواتساب" className="w-full bg-gray-50 border-none rounded-2xl pr-12 p-4 outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="relative md:col-span-2">
                  <FiMail className="absolute top-5 right-4 text-gray-400" />
                  <input name="email" value={form.email} onChange={handleChange} placeholder="البريد الإلكتروني" className="w-full bg-gray-50 border-none rounded-2xl pr-12 p-4 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "hours" && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-6 animate-in fade-in">
              <label className="flex items-center justify-between p-5 bg-orange-50 rounded-2xl cursor-pointer">
                <div className="flex items-center gap-3">
                  <FiClock className="text-orange-600" size={24} />
                  <span className="font-bold text-orange-900">مفتوح على مدار 24 ساعة</span>
                </div>
                <input type="checkbox" name="is24Hours" checked={form.is24Hours} onChange={handleChange} className="w-6 h-6 rounded-lg text-orange-600 focus:ring-orange-500" />
              </label>
              
              {!form.is24Hours && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 mr-2">وقت الفتح</label>
                    <input type="time" name="openTime" value={form.openTime} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 mr-2">وقت الإغلاق</label>
                    <input type="time" name="closeTime" value={form.closeTime} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-600 mb-2">أيام العمل</p>
                <div className="flex flex-wrap gap-2">
                  {WORK_DAYS.map((d) => (
                    <button key={d.key} type="button" onClick={() => toggleDay(d.key)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        form.working_days.includes(d.key) ? "bg-orange-500 text-white shadow-lg shadow-orange-100" : "bg-gray-100 text-gray-400"
                      }`}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}