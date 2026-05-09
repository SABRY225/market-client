import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Phone, Mail, MapPin, Bike, ShieldCheck, 
  Calendar, Clock, Star, Car, CreditCard, Activity, 
  Package,
  User
} from 'lucide-react';

export default function DeliveryProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    
    async function fetchData() {
      try {
        const [delRes, ordersRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/delivery/${id}`),
          fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/orders-delivery/${id}`),
        ]);

        if (!delRes.ok) throw new Error('فشل تحميل بيانات المندوب');
        if (!ordersRes.ok) throw new Error('فشل تحميل الطلبات');

        const delJson = await delRes.json();
        const ordersJson = await ordersRes.json();

        setDelivery(delJson);
        setOrders(Array.isArray(ordersJson) ? ordersJson : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // دالة لتحويل أيام العمل من نص إلى مصفوفة وعرضها بالعربي
  const renderWorkingDays = (daysString) => {
    try {
      const daysMap = { sat: "السبت", sun: "الأحد", mon: "الاثنين", tue: "الثلاثاء", wed: "الأربعاء", thu: "الخميس", fri: "الجمعة" };
      const days = JSON.parse(daysString);
      return days.map(d => daysMap[d]).join(' - ');
    } catch (e) { return "غير محدد"; }
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-gray-500">جاري جلب بيانات المندوب...</div>;

  return (
    <div className="p-4 md:p-8 bg-[#f9fafb] min-h-screen text-right" dir="rtl">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-lg shadow-sm border hover:bg-gray-50">
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{delivery?.username}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span>{delivery?.rating} تقييم المندوب</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <span className={`px-4 py-1 rounded-full text-xs font-bold border ${delivery?.online ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
            {delivery?.online ? "متصل الآن" : "غير متصل"}
          </span>
           <span className={`px-4 py-1 rounded-full text-xs font-bold border ${delivery?.accountStatus === 'approved' ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-red-50 text-red-600 border-red-200"}`}>
            {delivery?.accountStatus === 'approved' ? "حساب معتمد" : "قيد المراجعة"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* العمود الأول: المعلومات الشخصية والاتصال */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b">المعلومات الشخصية</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Phone size={18} /></div>
                <div>
                  <p className="text-xs text-gray-400">رقم الهاتف / واتساب</p>
                  <p className="text-sm font-medium" dir="ltr">{delivery?.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Mail size={18} /></div>
                <div>
                  <p className="text-xs text-gray-400">البريد الإلكتروني</p>
                  <p className="text-sm font-medium">{delivery?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Calendar size={18} /></div>
                <div>
                  <p className="text-xs text-gray-400">تاريخ الميلاد / النوع</p>
                  <p className="text-sm font-medium">{delivery?.dob} ({delivery?.gender === 'male' ? 'ذكر' : 'أنثى'})</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b">حالة العمل والنطاق</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><MapPin size={18} /></div>
                <div>
                  <p className="text-xs text-gray-400">منطقة العمل</p>
                  <p className="text-sm font-medium">{delivery?.operatingArea}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Clock size={18} /></div>
                <div>
                  <p className="text-xs text-gray-400">نوع العمل / الساعات</p>
                  <p className="text-sm font-medium">{delivery?.workType === 'full_time' ? 'دوام كامل' : 'دوام جزئي'} ({delivery?.dailyHours} ساعات)</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-400 mb-1">أيام العمل:</p>
                <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg leading-relaxed">
                  {renderWorkingDays(delivery?.workingDays)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* العمود الثاني والثالث: المركبة والطلبات */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* بيانات المركبة والرخص */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Car size={20} className="text-blue-500" /> تفاصيل المركبة
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">نوع المركبة:</span> <span className="font-bold">{delivery?.vehicleType}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">اللون:</span> <span className="font-bold">{delivery?.vehicleColor}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">رقم اللوحة:</span> <span className="font-bold font-mono">{delivery?.plateNumber}</span></div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-500" /> تواريخ انتهاء الرخص
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs p-2 border-b"><span>رخصة القيادة:</span> <span className="font-medium text-red-600">{delivery?.licenseExpiry}</span></div>
                <div className="flex justify-between text-xs p-2 border-b"><span>رخصة المركبة:</span> <span className="font-medium text-red-600">{delivery?.vehicleLicenseExpiry}</span></div>
                <div className="flex justify-between text-xs p-2 border-b"><span>الهوية الوطنية:</span> <span className="font-medium text-red-600">{delivery?.idExpiry}</span></div>
              </div>
            </div>
          </div>

          {/* سجل الطلبات */}
{/* سجل الطلبات المحدث */}
<div className="space-y-4">
  {orders.map((order) => (
    <div key={order.id} className="group bg-white border border-gray-100 rounded-3xl p-5 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-4">
          {/* أيقونة الحالة بناءً على Delivered */}
          <div className="h-14 w-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 border border-green-100">
            <Package size={24} />
          </div>
          
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800 text-lg">طلب #{order.id}</h4>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1"><Clock size={14} /> {order.startTime}</span>
              <span className="flex items-center gap-1"><User size={14} /> العميل: {order.customer}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2">
          <div className="text-left">
            <p className="text-xl font-black text-blue-600 tracking-tight">{parseFloat(order.total).toLocaleString()} <span className="text-xs font-normal mr-1">EGP</span></p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${
              order.status === 'delivered' ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
            }`}>
              {order.status === 'delivered' ? 'تم التوصيل' : order.status}
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase">
              {order.payment === 'cod' ? 'دفع نقدي' : order.payment}
            </span>
          </div>
        </div>
      </div>

      {/* تفاصيل العناصر المشراة */}
      <div className="mt-5 pt-4 border-t border-dashed border-gray-100">
        <div className="bg-slate-50/50 rounded-2xl p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
            <Activity size={12} /> المنتجات المطلوبة
          </p>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                </div>
                <span className="text-sm font-mono text-slate-500">{parseFloat(item.price).toFixed(2)} EGP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* زر عرض الموقع إذا كان مفعلاً */}
      {order.location && (
        <div className="mt-4 flex justify-end">
          <button 
            onClick={() => window.open(`https://www.google.com/maps?q=${order.location[0]},${order.location[1]}`, '_blank')}
            className="flex items-center gap-2 text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors"
          >
            <MapPin size={14} /> عرض موقع التوصيل على الخريطة
          </button>
        </div>
      )}
    </div>
  ))}
</div>
        </div>
      </div>
    </div>
  );
}