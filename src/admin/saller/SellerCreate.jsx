import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiUploadCloud, FiShoppingBag, FiMapPin, FiPhone, 
  FiMail, FiUser, FiClock, FiSearch 
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import register from "../../lib/register";
import toast from 'react-hot-toast';

// --- استيراد Leaflet ---
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// حل مشكلة أيقونات Leaflet الافتراضية في React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// مكون فرعي للتعامل مع النقر على الخريطة
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}
// -----------------------

const WORK_DAYS = [
  { key: "sat", label: "السبت" }, { key: "sun", label: "الأحد" },
  { key: "mon", label: "الاثنين" }, { key: "tue", label: "الثلاثاء" },
  { key: "wed", label: "الأربعاء" }, { key: "thu", label: "الخميس" },
  { key: "fri", label: "الجمعة" },
];

export default function SellerCreate() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name_ar: "", name_en: "", short_description: "", type: "",
    status: "active", phone: "", whatsapp: "", email: "", role: "vendor",
    owner: "", country: "", city: "", area: "", address: "",
    latitude: 30.0444, longitude: 31.2357, // القاهرة كموقع افتراضي
    pickup: false, openTime: "", closeTime: "", is24Hours: false,
    working_days: WORK_DAYS.map((d) => d.key),
  });

  const [previews, setPreviews] = useState({ logo: null, cover: null });
  const [files, setFiles] = useState({ logo: null, cover: null });

  // تحديث الإحداثيات في الفورم
  const handleMapClick = (pos) => {
    setForm(s => ({ ...s, latitude: pos[0], longitude: pos[1] }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "working_days") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      if (files.logo) formData.append("logo", files.logo);
      if (files.cover) formData.append("cover", files.cover);

      await register(formData);
      toast.success("تم إنشاء حساب التاجر بنجاح ✅");
      navigate(-1);
    } catch (err) {
      toast.error("حدث خطأ أثناء إنشاء الحساب ❌");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8" dir="rtl">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">إنشاء حساب تاجر</h1>
          <p className="text-gray-500 mt-1">أضف تفاصيل مطعمك وابدأ في استقبال الطلبات</p>
        </div>
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-red-500 transition-colors">إلغاء</button>
      </div>

      <form className="max-w-6xl mx-auto space-y-8" onSubmit={handleSubmit}>
        
        {/* صور الهوية */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="relative h-56 bg-gradient-to-r from-gray-100 to-gray-200">
            {previews.cover && <img src={previews.cover} className="w-full h-full object-cover" alt="" />}
            <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-black/10 transition-all text-gray-500">
              {!previews.cover && <><FiUploadCloud size={32} /> <span className="mt-2 font-medium">رفع صورة الغلاف</span></>}
              <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'cover')} />
            </label>
            
            <div className="absolute -bottom-12 right-10">
              <div className="relative group w-32 h-32 bg-white rounded-3xl shadow-xl border-4 border-white overflow-hidden">
                {previews.logo ? <img src={previews.logo} className="w-full h-full object-contain" alt="" /> : <div className="flex items-center justify-center h-full bg-gray-50 text-gray-300"><FiShoppingBag size={40}/></div>}
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-all">
                  <FiUploadCloud size={24} />
                  <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'logo')} />
                </label>
              </div>
            </div>
          </div>
          <div className="h-16"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {/* المعلومات الأساسية */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><FiShoppingBag className="text-purple-500"/> بيانات المطعم</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600">اسم المطعم (عربي)</label>
                  <input name="name_ar" value={form.name_ar} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-purple-500 transition-all" placeholder="مثال: قصر المشويات" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600">اسم صاحب المطعم (المالك)</label>
                  <input name="owner" value={form.owner} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-purple-500" placeholder="اسم المالك المعتمد" required />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-600">وصف قصير</label>
                  <textarea name="short_description" value={form.short_description} onChange={handleChange} rows="3" className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-purple-500" placeholder="تحدث عن تخصص المطعم..." />
                </div>
              </div>
            </section>

            {/* الموقع الجغرافي (Leaflet المحدث) */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><FiMapPin className="text-red-500"/> تحديد الموقع</h3>
              <p className="text-xs text-gray-400 mb-2">انقر على الخريطة لتحديد موقع المطعم بدقة</p>
              
              <div className="mb-6 rounded-2xl overflow-hidden border border-gray-100 h-72 z-0">
                <MapContainer 
                  center={[form.latitude, form.longitude]} 
                  zoom={13} 
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker 
                    position={[form.latitude, form.longitude]} 
                    setPosition={handleMapClick} 
                  />
                </MapContainer>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <input name="city" value={form.city} onChange={handleChange} placeholder="المدينة" className="bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-red-500" />
                <input name="area" value={form.area} onChange={handleChange} placeholder="الحي" className="bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-red-500" />
                <input name="address" value={form.address} onChange={handleChange} placeholder="العنوان التفصيلي" className="bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-red-500" />
              </div>
              
              {/* عرض الإحداثيات للتأكد (اختياري) */}
              <div className="mt-4 flex gap-4 text-[10px] text-gray-400">
                  <span>Lat: {form.latitude.toFixed(4)}</span>
                  <span>Lng: {form.longitude.toFixed(4)}</span>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            {/* التواصل */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><FiPhone className="text-green-500"/> التواصل</h3>
              <div className="space-y-4">
                <div className="relative">
                  <FiPhone className="absolute top-4 right-4 text-gray-300" />
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="رقم الجوال" className="w-full bg-gray-50 border-none rounded-2xl pr-12 p-4 focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="relative">
                  <FaWhatsapp className="absolute top-4 right-4 text-green-500" />
                  <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="رقم الواتساب" className="w-full bg-gray-50 border-none rounded-2xl pr-12 p-4 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div className="relative">
                  <FiMail className="absolute top-4 right-4 text-gray-300" />
                  <input name="email" value={form.email} onChange={handleChange} placeholder="البريد الإلكتروني" className="w-full bg-gray-50 border-none rounded-2xl pr-12 p-4 focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
            </section>

            {/* أوقات العمل */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><FiClock className="text-orange-500"/> أوقات العمل</h3>
              <div className="space-y-6">
                <label className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl cursor-pointer">
                  <span className="font-bold text-orange-800">يعمل 24 ساعة</span>
                  <input type="checkbox" name="is24Hours" checked={form.is24Hours} onChange={handleChange} className="w-6 h-6 rounded-lg text-orange-500" />
                </label>
                {!form.is24Hours && (
                  <div className="grid grid-cols-2 gap-3">
                    <input type="time" name="openTime" value={form.openTime} onChange={handleChange} className="bg-gray-50 border-none rounded-xl p-3" />
                    <input type="time" name="closeTime" value={form.closeTime} onChange={handleChange} className="bg-gray-50 border-none rounded-xl p-3" />
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {WORK_DAYS.map((d) => (
                    <button key={d.key} type="button" onClick={() => toggleDay(d.key)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold ${form.working_days.includes(d.key) ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <button disabled={submitting} type="submit" className={`px-12 py-4 rounded-2xl font-bold shadow-xl transition-all ${submitting ? 'bg-gray-400 text-white' : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105 active:scale-95'}`}>
            {submitting ? 'جارٍ الإنشاء...' : 'اعتماد الحساب ونشره'}
          </button>
        </div>
      </form>
    </div>
  );
}