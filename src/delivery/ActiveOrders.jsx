import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useTranslation } from "react-i18next";

// إصلاح أيقونة الخريطة لـ Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function ActiveOrders() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  
  const [orders, setOrders] = useState([]);
  const [showInvoice, setShowInvoice] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/delivery/${user.id}/myorders-active`);
      const data = await response.json();
      // إضافة خاصية showMap لكل طلب للتحكم المستقل
      const ordersWithMap = data.map(order => ({ ...order, showMap: false }));
      setOrders(ordersWithMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/delivery/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason: cancelReason }),
      });
      if (response.ok) {
        alert(status === 'success' ? t("translation.messages.delivery_success") : t("translation.messages.cancel_success"));
        setCancellingOrder(null);
        fetchOrders();
      }
    } catch (err) {
      alert(t("translation.messages.update_error"));
    }
  };

  const toggleMap = (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, showMap: !o.showMap } : o));
  };

  if (loading) return <div className="text-center mt-20 font-bold text-slate-500">{t("translation.status.loading_active")}</div>;

  return (
    <div className={`bg-slate-50 min-h-screen p-4 pb-10 ${isRtl ? 'font-arabic text-right' : 'font-sans text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-blue-600 animate-pulse"></span>
            {t("translation.active_orders.title")}
          </h3>
          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">
            {orders.length} {t("translation.active_orders.count_unit")}
          </span>
        </div>

        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 mb-8 overflow-hidden border border-white transition-all hover:shadow-2xl hover:shadow-slate-300/50">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase tracking-widest">#{order.id}</span>
                    <h4 className="text-2xl font-black text-slate-900 mt-2">{order.customer}</h4>
                    <p className="text-slate-400 text-sm font-medium mt-1">📍 {order.address || t("translation.common.no_address")}</p>
                  </div>
                  <button 
                    onClick={() => toggleMap(order.id)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${order.showMap ? 'bg-red-50 text-red-500 rotate-90' : 'bg-blue-50 text-blue-600'}`}
                  >
                    {order.showMap ? '✕' : '🗺️'}
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <a href={`tel:${order.phone}`} className="flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-slate-200 active:scale-95 transition-transform">
                    <span>📞</span> {t("translation.actions.call")}
                  </a>
                  <a href={`https://wa.me/${order.phone}`} target="_blank" className="flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-green-100 active:scale-95 transition-transform">
                    <span>💬</span> {t("translation.actions.whatsapp")}
                  </a>
                </div>

                {/* Management Buttons */}
                <div className="flex gap-3 pt-6 border-t border-slate-50">
                  <button 
                    onClick={() => setShowInvoice(order)}
                    className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold text-xs sm:text-sm hover:bg-slate-200 transition-colors"
                  >
                    📄 {t("translation.actions.invoice")}
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(order.id, "success")}
                    className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-bold text-xs sm:text-sm hover:bg-blue-700 shadow-xl shadow-blue-100 active:scale-95 transition-all"
                  >
                    ✅ {t("translation.actions.delivered")}
                  </button>
                  <button 
                    onClick={() => setCancellingOrder(order)}
                    className="w-14 h-14 flex items-center justify-center rounded-2xl text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Map Container */}
              {order.showMap && (
                <div className="h-[320px] w-full border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500 z-0">
                  <MapContainer center={order.location || [29.3759, 47.9774]} zoom={14} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={order.location || [29.3759, 47.9774]} />
                  </MapContainer>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-32">
            <div className="text-6xl mb-4 opacity-20">📦</div>
            <p className="text-slate-400 font-bold">{t("translation.active_orders.empty")}</p>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {showInvoice && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-end sm:items-center justify-center p-4 z-[1000] animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-20 duration-500">
            <div className="bg-slate-900 p-10 text-white text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-2xl shadow-blue-500/50">🧾</div>
              <h2 className="text-2xl font-black">{t("translation.invoice.summary")}</h2>
              <p className="text-slate-500 text-xs mt-2 font-mono uppercase tracking-tighter">ORDER_REF: {showInvoice.id}</p>
            </div>
            <div className="p-8 sm:p-10">
              <div className="space-y-4 mb-8">
                {showInvoice.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">{item.name}</span>
                    <span className="font-bold text-slate-900">{item.price} {t("translation.common.currency")}</span>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 p-6 rounded-[2rem] border-2 border-dashed border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-black">{t("invoice.total")}</span>
                  <span className="text-3xl font-black text-blue-700">{showInvoice.total} {t("translation.common.currency")}</span>
                </div>
              </div>
              <button onClick={() => setShowInvoice(null)} className="w-full mt-8 bg-slate-900 text-white py-5 rounded-2xl font-bold active:scale-95 transition-transform">
                {t("translation.common.close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancellingOrder && (
        <div className="fixed inset-0 bg-red-900/20 backdrop-blur-md flex items-center justify-center p-4 z-[1001] animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="font-black text-xl mb-3 text-slate-800">{t("translation.cancel_modal.title")} {cancellingOrder.customer}</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">{t("translation.cancel_modal.subtitle")}</p>
            <textarea 
              className="w-full border-none bg-slate-100 rounded-[1.5rem] p-5 text-sm mb-6 focus:ring-2 focus:ring-red-500 outline-none transition-all"
              placeholder={t("cancel_modal.placeholder")}
              rows="3"
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={() => setCancellingOrder(null)} className="flex-1 py-4 rounded-2xl bg-slate-100 font-bold text-slate-600 active:scale-95 transition-all">{t("common.back")}</button>
              <button 
                onClick={() => handleUpdateStatus(cancellingOrder.id, "cancelled")} 
                className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-bold shadow-lg shadow-red-200 active:scale-95 transition-all"
              >
                {t("translation.cancel_modal.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActiveOrders;