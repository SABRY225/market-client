import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiOutlineBadgeCheck, HiOutlineCash, HiOutlineCollection } from "react-icons/hi";

function OrdersHistory() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  
  // وضع قيم افتراضية لتجنب خطأ undefined قبل اكتمال التحميل
  const [previousOrders, setOrders] = useState({
    data: [],
    totalCommission: 0,
    orderCount: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/delivery/${user.id}/myorders-history`);
      if (!response.ok) throw new Error("Network error");
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-slate-500 font-bold">{t("translation.status.loading_history")}</p>
    </div>
  );

  return (
    <div className={`bg-[#F8FAFC] min-h-screen p-4 md:p-8 ${isRtl ? 'font-arabic text-right' : 'font-sans text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t("translation.history.title")}</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">{t("translation.history.subtitle")}</p>
          </div>
          <button onClick={fetchOrders} className="text-blue-600 font-bold text-sm hover:underline">
             {t("translation.common.refresh")} ↻
          </button>
        </header>

        {/* Financial Insight Dashboard */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Commission Card */}
          <div className="md:col-span-2 bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-300">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <HiOutlineCash className="text-blue-400 w-6 h-6" />
                <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">{t("translation.history.total_commission")}</span>
              </div>
              <div className="flex items-baseline gap-3">
                <h2 className="text-5xl font-black italic">{previousOrders.totalCommission?.toLocaleString()}</h2>
                <span className="text-blue-400 font-bold text-xl">{t("translation.common.currency")}</span>
              </div>
            </div>
            {/* Background Decoration */}
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <HiOutlineCash size={120} />
            </div>
          </div>

          {/* Completed Orders Card */}
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center relative overflow-hidden group hover:border-blue-200 transition-all">
            <HiOutlineCollection className="text-slate-200 absolute -top-2 -right-2 w-24 h-24 group-hover:text-blue-50 transition-colors" />
            <span className="text-slate-400 text-xs font-black block mb-2 relative z-10 uppercase">{t("translation.history.completed_orders")}</span>
            <h2 className="text-4xl font-black text-slate-800 relative z-10">{previousOrders.orderCount}</h2>
            <div className="h-1.5 w-12 bg-blue-600 mt-4 rounded-full relative z-10"></div>
          </div>
        </section>

        {/* History List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t("translation.history.recent_activities")}</h3>
            <span className="text-[10px] font-bold text-slate-300">({previousOrders.data?.length})</span>
          </div>

          {previousOrders.data?.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-16 text-center border-2 border-dashed border-slate-100">
               <p className="text-slate-400">{t("translation.history.no_data")}</p>
            </div>
          ) : (
            previousOrders.data.map((order) => (
              <div key={order.id} className="group relative bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {/* Status Indicator */}
                <div className={`absolute top-10 bottom-10 ${isRtl ? 'right-0' : 'left-0'} w-1.5 bg-green-500 rounded-full`}></div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                  {/* Customer Info */}
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-2xl shadow-inner group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-300">
                      <HiOutlineBadgeCheck />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-xl leading-tight">{order.customer}</h4>
                      <div className="flex items-center gap-3 mt-1.5 text-slate-400 text-xs font-bold">
                        <span className="bg-slate-100 px-2 py-0.5 rounded uppercase">ID: {order.id.slice(-6)}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{order.itemsCount} {t("translation.history.items_unit")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial & Time Info */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-10">
                    <div className="px-6 py-3 bg-green-50 rounded-[1.5rem] border border-green-100 text-center min-w-[140px]">
                      <p className="text-[10px] font-black text-green-600 mb-1 uppercase tracking-tighter">{t("translation.history.commission_earned")}</p>
                      <p className="font-black text-green-700 text-xl">+{order.commission} {t("translation.common.currency")}</p>
                    </div>

                    <div className={`${isRtl ? 'text-left' : 'text-right'} min-w-[100px]`}>
                      <p className="text-slate-800 font-black text-sm">{order.date}</p>
                      <p className="text-slate-400 text-[11px] font-bold mt-1 uppercase tracking-tighter">{order.time}</p>
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default OrdersHistory;