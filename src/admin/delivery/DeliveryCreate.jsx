import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiUser, FiTruck, FiFileText, FiMapPin, FiClock, 
  FiUploadCloud, FiShield, FiPhone, FiMail, FiCheckCircle, FiInfo 
} from "react-icons/fi";

// --- استيراد Leaflet الجديد ---
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// حل مشكلة أيقونات Leaflet الافتراضية
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// مكون فرعي لالتقاط النقر على الخريطة
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} /> : null;
}
// -----------------------------

const VEHICLE_TYPES = [
  { key: "motorcycle", label: "دراجة نارية", icon: "🏍️" },
  { key: "car", label: "سيارة", icon: "🚗" },
  { key: "bike", label: "دراجة هوائية", icon: "🚲" },
];

const WORK_DAYS = [
  { key: "sat", label: "السبت" }, { key: "sun", label: "الأحد" },
  { key: "mon", label: "الاثنين" }, { key: "tue", label: "الثلاثاء" },
  { key: "wed", label: "الأربعاء" }, { key: "thu", label: "الخميس" },
  { key: "fri", label: "الجمعة" },
];

export default function DeliveryCreate() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  const [form, setForm] = useState({
    fullName: "", phone: "", whatsapp: "", email: "", dob: "", gender: "",
    username: "", password: "", accountStatus: "approved",
    vehicleType: "car", vehicleModel: "", vehicleColor: "", plateNumber: "",
    idExpiry: "", licenseExpiry: "", vehicleLicenseExpiry: "",
    latitude: 24.7136, longitude: 46.6753, 
    online: false, operatingArea: "",
    workType: "full_time", dailyHours: "", workingDays: WORK_DAYS.map((d) => d.key),
  });

  const [previews, setPreviews] = useState({});

  const handleMapClick = (pos) => {
    setForm(s => ({ ...s, latitude: pos[0], longitude: pos[1] }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(s => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setPreviews(p => ({ ...p, [field]: URL.createObjectURL(file) }));
    }
  };

  const toggleDay = (key) => {
    setForm(s => ({
      ...s,
      workingDays: s.workingDays.includes(key) 
        ? s.workingDays.filter(d => d !== key) 
        : [...s.workingDays, key]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Final Data:", form);
    alert("تم حفظ بيانات المندوب بنجاح");
  };

  const TabButton = ({ step, icon: Icon, label }) => (
    <button
      type="button"
      onClick={() => setActiveTab(step)}
      className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
        activeTab === step 
        ? "bg-orange-500 text-white shadow-lg shadow-orange-200 scale-105" 
        : "bg-white text-gray-400 hover:bg-gray-50"
      }`}
    >
      <Icon size={18} />
      <span className="hidden md:inline">{label}</span>
    </button>
  )

  return (
    <div className="min-h-screen bg-[#F4F7FE] p-4 md:p-10" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">إضافة مندوب توصيل</h1>
            <p className="text-gray-500 mt-1">قم بتعبئة الملف التعريف الكامل للمندوب الجديد</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate(-1)} className="px-6 py-3 rounded-xl bg-white text-gray-500 font-bold shadow-sm">إلغاء</button>
            <button onClick={handleSubmit} className="px-8 py-3 rounded-xl bg-gray-900 text-white font-bold shadow-lg hover:bg-black transition-all">حفظ البيانات</button>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="flex flex-wrap gap-3 mb-8">
          <TabButton step={1} icon={FiUser} label="البيانات الشخصية" />
          <TabButton step={2} icon={FiTruck} label="المركبة" />
          <TabButton step={3} icon={FiFileText} label="المستندات" />
          <TabButton step={4} icon={FiMapPin} label="الموقع" />
          <TabButton step={5} icon={FiClock} label="العمل" />
        </div>

        <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Personal */}
            {activeTab === 1 && (
              <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xl font-bold flex items-center gap-3"><FiUser className="text-orange-500"/> المعلومات الأساسية</h3>
                   <div className="w-24 h-24 relative group">
                      <div className="w-full h-full rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center">
                        {previews.avatar ? <img src={previews.avatar} className="w-full h-full object-cover" /> : <FiUser size={30} className="text-gray-300"/>}
                      </div>
                      <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-3xl transition-all">
                        <FiUploadCloud />
                        <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'avatar')} />
                      </label>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="الاسم الكامل" name="fullName" value={form.fullName} onChange={handleChange} />
                  <Input label="رقم الهاتف" name="phone" value={form.phone} onChange={handleChange} />
                  <Input label="واتساب" name="whatsapp" value={form.whatsapp} onChange={handleChange} />
                  <Input label="البريد الإلكتروني" name="email" type="email" value={form.email} onChange={handleChange} />
                  <Input label="تاريخ الميلاد" name="dob" type="date" value={form.dob} onChange={handleChange} />
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 mr-2">الجنس</label>
                    <select name="gender" value={form.gender} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="">اختر</option>
                      <option value="male">ذكر</option>
                      <option value="female">أنثى</option>
                    </select>
                  </div>
                </div>
              </section>
            )}

            {/* Step 2: Vehicle */}
            {activeTab === 2 && (
              <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 animate-in fade-in duration-500">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3"><FiTruck className="text-blue-500"/> بيانات المركبة</h3>
                <div className="flex gap-4 mb-8">
                  {VEHICLE_TYPES.map(v => (
                    <button key={v.key} type="button" onClick={() => setForm({...form, vehicleType: v.key})} 
                      className={`flex-1 p-6 rounded-[2rem] border-2 transition-all ${form.vehicleType === v.key ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-50 text-gray-400'}`}>
                      <div className="text-3xl mb-2">{v.icon}</div>
                      <div className="font-bold text-sm">{v.label}</div>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="موديل المركبة" name="vehicleModel" value={form.vehicleModel} onChange={handleChange} />
                  <Input label="لون المركبة" name="vehicleColor" value={form.vehicleColor} onChange={handleChange} />
                  <Input label="رقم اللوحة" name="plateNumber" value={form.plateNumber} onChange={handleChange} />
                </div>
              </section>
            )}

            {/* Step 3: Documents */}
            {activeTab === 3 && (
              <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 animate-in fade-in duration-500">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3"><FiFileText className="text-purple-500"/> المستندات الرسمية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <DocUpload label="صورة الهوية الوطنية" field="idImage" preview={previews.idImage} onFile={handleFileChange} />
                  <Input label="تاريخ انتهاء الهوية" name="idExpiry" type="date" value={form.idExpiry} onChange={handleChange} />
                  <hr className="md:col-span-2" />
                  <DocUpload label="رخصة القيادة" field="licenseImage" preview={previews.licenseImage} onFile={handleFileChange} />
                  <Input label="تاريخ انتهاء الرخصة" name="licenseExpiry" type="date" value={form.licenseExpiry} onChange={handleChange} />
                </div>
              </section>
            )}

            {/* Step 4: Map */}
           {activeTab === 4 && (
              <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 animate-in fade-in duration-500">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><FiMapPin className="text-red-500"/> النطاق الجغرافي</h3>
                
                {/* الخريطة المجانية */}
                <div className="h-96 rounded-3xl overflow-hidden border-4 border-gray-50 mb-6 z-0">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="منطقة العمل الرئيسية" name="operatingArea" value={form.operatingArea} onChange={handleChange} placeholder="مثال: شمال الرياض" />
                  <div className="bg-red-50 p-4 rounded-2xl flex items-center gap-4 border border-red-100">
                    <div className="bg-white p-2 rounded-xl text-red-500 shadow-sm"><FiInfo /></div>
                    <p className="text-xs text-red-700 leading-relaxed font-bold">انقر على الخريطة لتحديد موقع المندوب. الموقع الحالي: {form.latitude.toFixed(4)}, {form.longitude.toFixed(4)}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Step 5: Work Schedule */}
            {activeTab === 5 && (
              <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 animate-in fade-in duration-500">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3"><FiClock className="text-green-500"/> إعدادات الدوام</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600">نوع التوظيف</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["full_time", "part_time"].map(t => (
                        <button key={t} type="button" onClick={() => setForm({...form, workType: t})}
                          className={`py-3 rounded-xl text-xs font-bold border transition-all ${form.workType === t ? 'bg-green-500 border-green-500 text-white' : 'bg-white text-gray-400'}`}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <Input label="ساعات العمل اليومية" name="dailyHours" type="number" value={form.dailyHours} onChange={handleChange} />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-600">أيام العمل الأسبوعية</label>
                  <div className="flex flex-wrap gap-2">
                    {WORK_DAYS.map(d => (
                      <button key={d.key} type="button" onClick={() => toggleDay(d.key)}
                        className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all ${form.workingDays.includes(d.key) ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
               <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><FiShield className="text-blue-500"/> إعدادات الحساب</h4>
               <div className="space-y-5">
                  <Input label="اسم المستخدم" name="username" value={form.username} onChange={handleChange} />
                  <Input label="كلمة المرور" name="password" type="password" value={form.password} onChange={handleChange} />
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm font-bold text-blue-800">الحالة: متصل الآن</span>
                      <input type="checkbox" name="online" checked={form.online} onChange={handleChange} className="w-5 h-5 accent-blue-600" />
                    </label>
                  </div>
               </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-black p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
               <FiCheckCircle className="absolute -bottom-6 -left-6 text-white/10" size={120} />
               <h4 className="font-bold text-lg mb-2">جاهز للإرسال؟</h4>
               <p className="text-gray-400 text-sm leading-relaxed mb-6">يرجى مراجعة كافة البيانات، خصوصاً تواريخ انتهاء المستندات الرسمية للمندوب.</p>
               <button onClick={handleSubmit} className="w-full bg-orange-500 hover:bg-orange-600 py-4 rounded-2xl font-black text-white transition-all">اعتماد المندوب الآن</button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

// مكونات مساعدة (Sub-components)
const Input = ({ label, ...props }) => (
  <div className="space-y-2 w-full">
    <label className="text-sm font-bold text-gray-600 mr-2">{label}</label>
    <input {...props} className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
  </div>
);

const DocUpload = ({ label, field, preview, onFile }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-gray-600 mr-2">{label}</label>
    <div className="relative group h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl overflow-hidden flex flex-col items-center justify-center text-gray-400">
      {preview ? (
        <img src={preview} className="w-full h-full object-cover" />
      ) : (
        <>
          <FiUploadCloud size={24} className="mb-2" />
          <span className="text-xs font-bold">ارفع الصورة</span>
        </>
      )}
      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => onFile(e, field)} />
    </div>
  </div>
);