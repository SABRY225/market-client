import React, { useState, useEffect } from "react";
import {
  ArrowRight, Package, User, Truck, MapPin,
  Phone, Sparkles, Loader2, Check, X, AlertCircle, ExternalLink,
  Clock
} from "lucide-react";
import clsx from "clsx";
import { useParams } from "react-router-dom";

/** --- المكونات الداخلية للبطاقة --- **/
const Card = ({ children, className }) => (
  <div className={clsx("bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden", className)}>
    {children}
  </div>
);

const CardHeader = ({ children, className }) => (
  <div className={clsx("p-5 border-b border-gray-50 flex flex-col space-y-1.5", className)}>
    {children}
  </div>
);

const CardTitle = ({ children, className }) => (
  <h3 className={clsx("text-lg font-bold text-gray-900 flex items-center gap-2", className)}>
    {children}
  </h3>
);

const CardContent = ({ children, className }) => (
  <div className={clsx("p-5", className)}>{children}</div>
);

export default function OrderDetailsPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState("manual");
  const [assignedDelivery, setAssignedDelivery] = useState("");
  const [deliveryBoys, setDeliveryBoys] = useState([]);

  const { orderId } = useParams();
  const token = localStorage.getItem("token");

  // قاموس لترجمة الحالات للعربية
  const statusTranslations = {
    pending: "قيد الانتظار",
    confirmed: "تم القبول",
    processing: "جاري التحضير",
    shipped: "خرج للتوصيل",
    delivered: "تم التسليم",
    searching:"جاري البحث عن اقرب مندوب",
    cancelled: "ملغي"
  };

  useEffect(() => {
    const fetchOrderAndDrivers = async () => {
      try {
        setLoading(true);
        const requestHeaders = {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        };

        const [orderRes, driversRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/v1/order/${orderId}`, { headers: requestHeaders }),
          fetch(`${import.meta.env.VITE_API_URL}/api/v1/vendor/delivery`, { headers: requestHeaders })
        ]);

        const orderData = await orderRes.json();
        const driversData = await driversRes.json();

        setOrder(orderData);
        setDeliveryBoys(driversData.data || driversData);
        setLoading(false);
      } catch (err) {
        setError("حدث خطأ في جلب البيانات");
        setLoading(false);
      }
    };

    if (orderId) fetchOrderAndDrivers();
  }, [orderId, token]);

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/order/${order.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrder({ ...order, status: newStatus });
      }
    } catch (err) {
      alert("فشل تحديث الحالة");
    } finally {
      setIsUpdating(false);
    }
  };
useEffect(() => {
  let interval;
  if (order?.status === "searching" || order?.delivery_status === "pending") {
    // تحديث البيانات كل 5 ثوانٍ لمعرفة هل قبل المندوب أم لا
    interval = setInterval(() => {
      fetchOrderAndDrivers(); // الدالة الموجودة لديك بالفعل
    }, 5000);
  }
  return () => clearInterval(interval);
}, [order?.status, order?.delivery_status]);

const handleAssignDriver = async () => {
  if (deliveryMode === "manual" && !assignedDelivery) {
    return alert("الرجاء اختيار مندوب أولاً");
  }

  setIsUpdating(true);
  try {
    const isAuto = deliveryMode === "auto";
    const endpoint = isAuto 
      ? `${import.meta.env.VITE_API_URL}/api/v1/order/${order.id}/assign-delivery` 
      : `${import.meta.env.VITE_API_URL}/api/v1/order/${order.id}/assign`;

    // تجهيز البيانات اللازمة للسيرفر
    const payload = isAuto 
      ? { 
          restaurant_lat: order.vendor?.latitude,
          restaurant_lng: order.vendor?.longitude,
          customer_lat: order.latitude,
          customer_lng: order.longitude 
        } 
      : { delivery_id: assignedDelivery };

    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload), // تفعيل الإرسال هنا
    });

    const data = await response.json();

    if (response.ok) {
      // تحديث الحالة محلياً لإظهار رسائل الانتظار
      setOrder(prev => ({ 
        ...prev, 
        status: isAuto ? 'searching' : 'shipped',
        delivery_status: isAuto ? 'pending' : prev.delivery_status 
      }));
      alert(isAuto ? "بدأنا البحث عن أقرب مندوب..." : "تم التعيين بنجاح");
    } else {
      alert(data.message || "فشل في العملية");
    }
  } catch (err) {
    alert("حدث خطأ في الاتصال بالخادم");
  } finally {
    setIsUpdating(false);
  }
};
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="font-bold text-gray-500">جاري تحميل تفاصيل الطلب...</p>
    </div>
  );

  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500 font-bold">{error}</div>;

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen text-right" dir="rtl">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => window.history.back()} className="p-2.5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:bg-gray-50">
          <ArrowRight size={22} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-800">طلب رقم #{order?.id}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <p className="text-sm font-bold text-blue-600">{statusTranslations[order?.status] || order?.status}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* --- Decision Section (قسم اتخاذ القرار) --- */}
          <div className="space-y-4 mb-8">
            {/* 1. حالة الطلب معلق - يظهر القبول والرفض */}
            {order?.status === "pending" && (
              <Card className="border-2 border-blue-100 bg-blue-50/30 animate-in fade-in duration-500">
                <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">طلب جديد متاح</h2>
                      <p className="text-sm text-gray-600">هل ترغب في قبول الطلب والبدء في تجهيزه؟</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus("cancelled")}
                      className="flex-1 md:flex-none px-8 py-3 bg-white text-red-600 border border-red-200 font-bold rounded-2xl hover:bg-red-50 transition-all"
                    >
                      رفض
                    </button>
                    <button
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus("confirmed")}
                      className="flex-1 md:flex-none px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                    >
                      {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />} قبول الطلب
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 2. حالة الطلب مقبول - يظهر زر بدء التحضير */}
            {order?.status === "confirmed" && (
              <Card className="border-2 border-orange-100 bg-orange-50/30 animate-in slide-in-from-top-4 duration-500">
                <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-100">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">تم قبول الطلب بنجاح</h2>
                      <p className="text-sm text-gray-600">يمكنك الآن إبلاغ العميل بأنك بدأت في تحضير الطعام.</p>
                    </div>
                  </div>
                  <button
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus("processing")}
                    className="w-full md:w-auto px-10 py-3 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 shadow-lg shadow-orange-200 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Package size={18} />} بدء تجهيز الطلب
                  </button>
                </CardContent>
              </Card>
            )}

            {/* 3. حالة الطلب جاري التجهيز - تظهر رسالة تأكيد */}
            {order?.status === "processing" && (
              <Card className="border-2 border-green-100 bg-green-50/20">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="p-2 bg-green-500 text-white rounded-full">
                    <Check size={20} />
                  </div>
                  <p className="font-bold text-green-800 text-sm">الطلب الآن في مرحلة التحضير. قم بتعيين مندوب التوصيل بالأسفل عند الانتهاء.</p>
                </CardContent>
              </Card>
            )}
          </div>
          {/* Items Section */}
          <Card>
            <CardHeader><CardTitle><Package className="text-blue-600" /> محتويات الطلب</CardTitle></CardHeader>
            <CardContent className="p-0">
              {order?.items?.map((item, index) => (
                <div key={index} className="p-5 flex items-center justify-between border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-200">
                      {item?.Menu?.image ? <img src={item.Menu.image} alt="" className="w-full h-full object-cover" /> : <Package size={20} className="text-gray-400" />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{item?.Menu?.name}</p>
                      <p className="text-sm text-gray-500 font-medium">الكمية: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-black text-gray-900">{item.price} ج.م</p>
                </div>
              ))}
              <div className="p-6 bg-slate-50 border-t border-gray-100 flex justify-between items-center">
                <span className="text-gray-500 font-bold">إجمالي الفاتورة</span>
                <span className="text-2xl font-black text-blue-600">{order?.total} ج.م</span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Management */}
          {order?.status === "processing" || order?.status === "searching" ? (
              <Card className="border-2 border-gray-100">
                <CardHeader><CardTitle><Truck className="text-orange-500" /> تعيين مندوب التوصيل</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  {/* شريط اختيار الحالة */}
                  <div className="flex p-1 bg-gray-100 rounded-2xl w-full max-w-xs mx-auto">
                    <button onClick={() => setDeliveryMode("manual")} className={clsx("flex-1 py-2 rounded-xl text-sm font-bold", deliveryMode === 'manual' ? "bg-white text-blue-600 shadow" : "text-gray-500")}>يدوي</button>
                    <button onClick={() => setDeliveryMode("auto")} className={clsx("flex-1 py-2 rounded-xl text-sm font-bold", deliveryMode === 'auto' ? "bg-white text-purple-600 shadow" : "text-gray-500")}>ذكي (الأقرب)</button>
                  </div>

                  {deliveryMode === "manual" ? (
                    <select value={assignedDelivery} onChange={(e) => setAssignedDelivery(e.target.value)} className="w-full p-4 bg-gray-50 border rounded-2xl font-bold">
                      <option value="">-- اختر مندوب متاح الآن --</option>
                      {deliveryBoys.map(d => <option key={d.id} value={d.id}>{d.name} ({d.distance || '؟'} كم)</option>)}
                    </select>
                  ) : (
                    <div className="p-6 border-2 border-dashed border-purple-200 rounded-3xl text-center bg-purple-50/30 font-bold text-purple-700">
                      سيقوم النظام بالبحث عن أقرب مندوب متاح جغرافياً تلقائياً.
                    </div>
                  )}

                  <button onClick={handleAssignDriver} disabled={isUpdating} className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl">
                    {isUpdating ? <Loader2 className="animate-spin inline mr-2" /> : <Check size={20} className="inline mr-2" />}
                    تأكيد وإرسال الطلب
                  </button>

                  {/* عرض حالة المندوب الحالية */}
                  {order?.delivery_status && (
                    <div className={clsx("p-4 rounded-2xl flex items-center justify-between", 
                        order.delivery_status === 'pending' ? "bg-yellow-50 text-yellow-700 border border-yellow-100" :
                        order.delivery_status === 'accepted' ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                    )}>
                        <div className="flex items-center gap-3">
                            {order.delivery_status === 'pending' ? <Clock className="animate-pulse" /> : <Truck />}
                            <span className="font-bold">
                                {order.delivery_status === 'pending' ? "في انتظار قبول المندوب..." : 
                                 order.delivery_status === 'accepted' ? `تم القبول بواسطة: ${order.delivery_name}` : "تم رفض الطلب من المندوب"}
                            </span>
                        </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : null}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info & Location */}
          <Card className="border-t-4 border-t-blue-600 shadow-lg">
            <CardHeader><CardTitle><User className="text-blue-600" /> معلومات العميل</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><User size={18} /></div>
                <p className="font-bold text-gray-800">{order?.user?.name}</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                <div className="p-2 bg-green-100 text-green-600 rounded-xl"><Phone size={18} /></div>
                <p className="font-bold text-gray-800">{order?.user?.customer?.phone}</p>
              </div>

              {/* Location Box */}
              <div className="mt-4 p-4 border border-orange-100 bg-orange-50/50 rounded-3xl space-y-3">
                <div className="flex items-center gap-2 text-orange-700 font-bold mb-1">
                  <MapPin size={18} />
                  <span>موقع التوصيل</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed italic">
                  الإحداثيات: {order?.latitude}, {order?.longitude}
                </p>
                <a
                  href={`https://www.google.com/maps?q=${order?.latitude},${order?.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white border-2 border-orange-200 text-orange-600 font-bold rounded-2xl hover:bg-orange-100 transition-all text-sm"
                >
                  <ExternalLink size={16} /> عرض على الخريطة
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Payment Card */}
          <Card className="bg-slate-900  p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Package size={80} /></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between opacity-70 text-sm mb-4">
                <span>طريقة الدفع</span>
                <span className="px-3 py-1 bg-white/10 rounded-full border border-white/20 uppercase tracking-wider text-xs">
                  {order?.payment?.method || 'كاش'}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                <span className="font-medium text-gray-400">الإجمالي النهائي</span>
                <span className="text-2xl font-black text-yellow-400">{order?.total} ج.م</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}