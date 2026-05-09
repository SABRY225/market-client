import { useEffect, useState } from 'react';
import { LayoutDashboard, FileText, TrendingUp, DollarSign, Package, AlertCircle } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DeliveryStatistics = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  
  const [stats, setStats] = useState({
    transactions: [],
    chartData: [],
    summary: { totalEarnings: 0, totalOrders: 0, cancelRate: "0%" }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/delivery/${user.id}/myorders-stats`);
      const data = await response.json();
      setStats({
        transactions: data.transactions || [],
        chartData: data.chartData || [],
        summary: data.summary || { totalEarnings: 0, totalOrders: 0, cancelRate: "0%" }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-500 font-bold">{t("translation.status.loading_stats")}</p>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gray-50 p-4 md:p-8 ${isRtl ? 'font-arabic text-right' : 'font-sans text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Transactions Log */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            {t("translation.stats.recent_log")}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right" dir={isRtl ? 'rtl' : 'ltr'}>
            <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">{t("translation.stats.order_id")}</th>
                <th className="px-6 py-4">{t("translation.stats.time")}</th>
                <th className="px-6 py-4">{t("translation.stats.status_label")}</th>
                <th className="px-6 py-4">{t("translation.stats.commission")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.transactions.map((t_item, idx) => (
                <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 font-bold text-gray-700">#{t_item.id}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{t_item.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      t_item.status === 'delivered' || t_item.status === 'تم التسليم' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                    }`}>
                      {t_item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-blue-600 font-black">{t_item.commission} {t("translation.common.currency")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryStatistics;