import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function AvailableOrders() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/delivery/${user.id}/myorders-pending`);
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAcceptOrder = async (orderId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/delivery/${orderId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        alert(t("translation.messages.accept_success"));
        fetchOrders();
      }
    } catch (err) {
      alert(t("translation.messages.accept_error"));
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600 font-medium">{t("translation.status.loading_orders")}</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
      <span className="text-5xl mb-4">⚠️</span>
      <p className="font-bold text-xl">{t("translation.status.error_connection")}: {error}</p>
      <button onClick={fetchOrders} className="mt-4 text-blue-600 underline">{t("translation.common.retry")}</button>
    </div>
  );

  return (
    <div className={`bg-slate-50 min-h-screen pb-12 ${isRtl ? 'font-arabic text-right' : 'font-sans text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Area */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            {t("translation.orders.available_title")}
            <span className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded-full">{orders.length}</span>
          </h3>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid gap-6">
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-lg">{t("translation.orders.no_orders")}</p>
            </div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group">
                <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase">#{o.id.slice(-5)}</span>
                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{o.customer}</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      <div className="flex items-center text-gray-500 text-sm gap-2">
                        <span className="text-blue-500 text-base">📍</span>
                        <span className="truncate max-w-[200px]">{o.address || t("translation.orders.no_address")}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm gap-2">
                        <span className="text-blue-500 text-base">⏱️</span>
                        <span>{t("translation.orders.delivery_within")}: {o.deliveryTime / 60} {t("translation.common.hour")}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm gap-2">
                        <span className="text-green-500 text-base">💰</span>
                        <span className="font-bold text-slate-700">{t("translation.orders.delivery_fee")}: {o.deliveryFee} {t("translation.common.currency")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4 md:mt-0 border-t md:border-t-0 pt-4 md:pt-0">
                    <button onClick={() => setSelectedOrder(o)} className="flex-1 md:flex-none px-6 py-2.5 rounded-xl text-slate-600 font-bold bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200">
                      {t("translation.common.details")}
                    </button>
                    <button onClick={() => handleAcceptOrder(o.id)} className="flex-1 md:flex-none px-8 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
                      {t("translation.orders.accept_btn")}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-slate-900 text-white p-8 text-center relative">
              <div className={`absolute -bottom-3 left-0 right-0 h-6 bg-white rounded-t-[2rem]`}></div>
              <h2 className="text-2xl font-black tracking-tight">{t("invoice.summary")}</h2>
              <p className="text-slate-400 text-sm mt-2 font-mono">ID: {selectedOrder.id}</p>
            </div>

            <div className="px-8 pb-8 pt-4 space-y-6">
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{t("translation.invoice.customer")}</span>
                  <span className="font-bold text-slate-800">{selectedOrder.customer}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{t("translation.invoice.phone")}</span>
                  <span className="font-bold text-slate-800" dir="ltr">{selectedOrder.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{t("translation.invoice.payment_method")}</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">{selectedOrder.payment}</span>
                </div>
              </div>

              <div className="overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-100">
                      <th className={`${isRtl ? 'text-right' : 'text-left'} pb-3 font-bold text-slate-400`}>{t("translation.invoice.item")}</th>
                      <th className={`${isRtl ? 'text-left' : 'text-right'} pb-3 font-bold text-slate-400`}>{t("translation.invoice.price")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="py-3 text-slate-700 font-medium">{item.name}</td>
                        <td className={`py-3 ${isRtl ? 'text-left' : 'text-right'} font-bold text-slate-900`}>{item.price} {t("translation.common.currency")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t-2 border-dashed border-slate-200 pt-4 mt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-slate-800">{t("translation.invoice.total")}</span>
                  <span className="text-2xl font-black text-blue-600">{selectedOrder.total} {t("translation.common.currency")}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setSelectedOrder(null)} className="py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors">
                    {t("translation.common.close")}
                  </button>
                  <button className="py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 flex items-center justify-center gap-2 transition-transform active:scale-95">
                    <span>{t("translation.common.print")}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AvailableOrders;