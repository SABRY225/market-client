import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { 
  MapPin, CreditCard, CheckCircle, Clock, 
  HandCoins, Loader2, Info, Store, Navigation, ChevronRight 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// --- إعدادات أيقونة الخريطة ---
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({ 
  iconUrl: markerIcon, 
  shadowUrl: markerShadow, 
  iconSize: [25, 41], 
  iconAnchor: [12, 41] 
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- دالة حساب المسافة (Haversine Formula) ---
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

const formatCurrency = (amount) => 
  new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount || 0);

// مكون اختيار الموقع على الخريطة
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) { setPosition(e.latlng); },
  });
  return position ? <Marker position={position} /> : null;
}

export default function FoodCheckout() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  // States
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapPosition, setMapPosition] = useState({ lat: 27.2579, lng: 33.8116 });
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // 1. جلب بيانات الطلب والمطعم
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/client/order-details/${orderId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setOrderData(res.data);
        
        // إذا كان هناك موقع مسجل مسبقاً للطلب نضعه على الخريطة
        if (res.data.location?.lat) {
          setMapPosition({ lat: parseFloat(res.data.location.lat), lng: parseFloat(res.data.location.lng) });
        }
      } catch (err) {
        toast.error("فشل في تحميل بيانات الطلب");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  // 2. الحسابات الديناميكية للمسافة والتوصيل
  const deliveryInfo = useMemo(() => {
    if (!orderData?.restaurant) return { distance: 0, fee: 0 };
    
    // إحداثيات المطعم من الباك اند
    const restLat = parseFloat(orderData.restaurant.latitude);
    const restLng = parseFloat(orderData.restaurant.longitude);

    const distance = calculateDistance(
      mapPosition.lat, mapPosition.lng,
      restLat, restLng
    );

    const fee = Math.max(15, Math.round(distance * 2.1 * 2)); // 5 ج لكل كيلو - حد أدنى 15 ج
    return { distance: distance.toFixed(2), fee };
  }, [orderData, mapPosition]);

  const subtotal = parseFloat(orderData?.billing?.subtotal || 0);
  const serviceFee = parseFloat(orderData?.billing?.serviceFee || 0);
  const total = subtotal + deliveryInfo.fee ;

  // 3. إرسال الطلب النهائي
  const handleConfirmOrder = async () => {

    try {
      setIsSubmitting(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/client/confirm-order`, {
        order_id: orderId,
        latitude: mapPosition.lat,
        longitude: mapPosition.lng,
        delivery_fee: deliveryInfo.fee,
        delivery_time: orderData?.preparationTime + (deliveryInfo.distance * 2),
        total_price: total,
        payment_method: paymentMethod
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      toast.success("تم تأكيد الطلب بنجاح!");
      setTimeout(() => navigate(`/orders`), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء التأكيد");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-orange-500" size={40} />
      <p className="font-bold text-gray-500">جاري تجهيز فاتورتك...</p>
    </div>
  );
  console.log(orderData);
  
  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20 pt-10 px-4 text-right" dir="rtl">
      <Toaster position="top-center" />
      
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        
        {/* القسم الأيمن: البيانات */}
        <div className="lg:col-span-2 space-y-6">
          <header className="mb-8">
            <h1 className="text-4xl font-black text-gray-900">مراجعة الطلب</h1>
            <p className="text-gray-500 mt-2">يرجى التأكد من موقع التوصيل وطريقة الدفع</p>
          </header>

          {/* كروت المعلومات السريعة */}
          <section className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-2xl text-orange-600"><Store size={24} /></div>
              <div>
                <p className="text-xs text-gray-400 font-bold">المطعم</p>
                <h3 className="font-black text-gray-800">{orderData?.restaurant?.name_ar}</h3>
              </div>
            </div>
            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-2xl text-blue-600"><Clock size={24} /></div>
              <div>
                <p className="text-xs text-gray-400 font-bold">وقت الوصول المتوقع</p>
                <h3 className="font-black text-gray-800">{orderData?.preparationTime + (deliveryInfo.distance * 2)} دقيقة</h3>
              </div>
            </div>
          </section>

          {/* الخريطة والموقع */}
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black flex items-center gap-2">
                <MapPin className="text-orange-500" /> موقع التوصيل
              </h2>
              <span className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                <Navigation size={12} /> تبعد {deliveryInfo.distance} كم
              </span>
            </div>

            <div className="h-72 rounded-[2rem] overflow-hidden border-4 border-gray-50 z-0">
              <MapContainer center={mapPosition} zoom={15} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker position={mapPosition} setPosition={setMapPosition} />
              </MapContainer>
            </div>

          </section>

          {/* طريقة الدفع */}
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              <CreditCard className="text-orange-500" /> طريقة الدفع
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border-2 border-orange-500 bg-orange-50 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-4">
                  <HandCoins className="text-orange-500" />
                  <span className="font-bold text-orange-900">نقداً عند الاستلام</span>
                </div>
                <CheckCircle size={20} className="text-orange-500" />
              </div>
              <div className="p-5 rounded-2xl border-2 border-gray-100 bg-gray-50 flex items-center justify-between opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <CreditCard className="text-gray-400" />
                  <span className="font-bold text-gray-400">بطاقة (قريباً)</span>
                </div>
                <Info size={16} className="text-gray-400" />
              </div>
            </div>
          </section>
        </div>

        {/* القسم الأيسر: الفاتورة */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 sticky top-10">
            <h3 className="text-2xl font-black mb-6">ملخص الحساب</h3>
            
            {/* قائمة الأصناف */}
            <div className="space-y-4 mb-6 max-h-40 overflow-y-auto pl-2">
              {orderData?.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm font-medium">
                  <span className="text-gray-500">{item.quantity}x {item.menu?.name}</span>
                  <span className="text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* تفاصيل الحساب */}
            <div className="space-y-3 py-6 border-t border-dashed border-gray-200">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>إجمالي الأصناف</span>
                <span className="font-bold">{formatCurrency(subtotal - serviceFee)}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>رسوم الخدمة</span>
                <span className="font-bold">{formatCurrency(serviceFee)}</span>
              </div>
              <div className="flex justify-between text-blue-600 text-sm font-bold bg-blue-50 p-3 rounded-xl">
                <span>توصيل ({deliveryInfo.distance} كم)</span>
                <span>{formatCurrency(deliveryInfo.fee)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 mb-8">
              <span className="text-xl font-black">الإجمالي</span>
              <span className="text-3xl font-black text-orange-600">{formatCurrency(total)}</span>
            </div>

            <Button 
              onClick={handleConfirmOrder}
              disabled={isSubmitting}
              className="w-full h-16 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xl shadow-lg shadow-orange-200 flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  تأكيد وإرسال الطلب
                  <ChevronRight size={20} className="group-hover:translate-x-[-4px] transition-transform rotate-180" />
                </>
              )}
            </Button>

            <p className="text-[10px] text-gray-400 text-center mt-4 leading-relaxed">
              بمجرد التأكيد سيتم توجيه طلبك للمطعم مباشرة ولا يمكن الإلغاء بعد بدء التحضير
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}