import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FiShoppingBag, FiMapPin, FiPhone, FiMail, 
  FiClock, FiEdit3, FiArrowRight, FiCheckCircle 
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

// استيراد مكونات Leaflet بدلاً من Google Maps
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import toast from 'react-hot-toast';
import getVendor from "../../lib/fetchVendor";

// حل مشكلة أيقونة Marker التي لا تظهر أحياناً في Leaflet مع React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const WORK_DAYS = [
  { key: "sat", label: "السبت" }, { key: "sun", label: "الأحد" },
  { key: "mon", label: "الاثنين" }, { key: "tue", label: "الثلاثاء" },
  { key: "wed", label: "الأربعاء" }, { key: "thu", label: "الخميس" },
  { key: "fri", label: "الجمعة" },
];

export default function SellerProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getVendor(id);
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );

  // تحويل الإحداثيات إلى أرقام
  const position = [parseFloat(seller.latitude), parseFloat(seller.longitude)];

  return (
    <div className="min-h-screen bg-gray-50/50" dir="rtl">
      {/* Cover Photo */}
      <div className="relative h-64 md:h-80 bg-gray-200 overflow-hidden">
        <img src={seller.cover} className="w-full h-full object-cover" alt="Cover" />
        <div className="absolute inset-0 bg-black/20"></div>
        <button onClick={() => navigate(-1)} className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all">
          <FiArrowRight size={20} />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Profile Header */}
        <div className="relative -mt-16 mb-8 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
          <div className="flex items-end gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl shadow-xl border-4 border-white overflow-hidden shrink-0">
              <img src={seller.image_url} className="w-full h-full object-contain" alt="Logo" />
            </div>
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-extrabold text-gray-900">{seller.name_ar}</h1>
                <FiCheckCircle className="text-blue-500" title="موثق" />
              </div>
              <p className="text-gray-500 font-medium">{seller.name_en}</p>
            </div>
          </div>
          
          <button onClick={() => navigate(`/admin/users/seller/edit/${id}`)} className="flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-2xl font-bold shadow-sm hover:bg-gray-50 transition-all text-gray-700">
            <FiEdit3 /> تعديل البروفايل
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-4">عن المطعم</h3>
              <p className="text-gray-600 leading-relaxed text-lg">{seller.short_description}</p>
            </section>

            {/* الخريطة المجانية باستخدام Leaflet */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><FiMapPin className="text-red-500"/> الموقع الجغرافي</h3>
              <div className="mb-6 rounded-2xl overflow-hidden h-64 border border-gray-50 z-0">
                <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={position}>
                    <Popup>{seller.name_ar}</Popup>
                  </Marker>
                </MapContainer>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-3 bg-red-50 rounded-xl text-red-500"><FiMapPin /></div>
                <div>
                  <p className="font-bold text-gray-800">{seller.city}, {seller.area}</p>
                  <p className="text-gray-500">{seller.address}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Contact Card */}
             <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
               <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900">بيانات التواصل</h3>
               <div className="space-y-4">
                  <a href={`tel:${seller.phone}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-green-50 transition-colors group">
                    <FiPhone className="text-gray-400 group-hover:text-green-500" />
                    <span className="font-bold text-gray-700">{seller.phone}</span>
                  </a>
                  <a href={`https://wa.me/${seller.whatsapp}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-green-50 transition-colors group">
                    <FaWhatsapp className="text-gray-400 group-hover:text-green-500" />
                    <span className="font-bold text-gray-700">واتساب</span>
                  </a>
               </div>
            </section>
            {/* Working Hours Card */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900"><FiClock className="text-orange-500"/> أوقات العمل</h3>
              <div className="space-y-4">
                {seller.is24Hours ? (
                  <div className="p-4 bg-orange-50 text-orange-800 rounded-2xl font-bold text-center italic">مفتوح 24 ساعة</div>
                ) : (
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl font-bold text-gray-700">
                    <span>{seller.openTime}</span>
                    <span className="text-gray-300">إلى</span>
                    <span>{seller.closeTime}</span>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {WORK_DAYS.map((d) => (
                    <span key={d.key} 
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold ${seller.working_days.includes(d.key) ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-400 opacity-50"}`}>
                      {d.label}
                    </span>
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