import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { 
  Bell, DollarSign, Package, TrendingUp, Loader2, 
  ChevronLeft, Info, ShoppingBag, AlertCircle 
} from "lucide-react";
import getSallerStatistics from "../lib/saller/fetchSallerStatistics";
import getSallerNotification from "../lib/saller/fetchSallerNotification";

export default function VendorOverview() {
  const [stats, setStats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await getSallerStatistics();
        const notificationsRes = await getSallerNotification();
        
        const formattedStats = [
          { 
            title: "مبيعات اليوم", 
            value: statsRes.today_sales, 
            unit: "EGP",
            icon: <DollarSign size={24} />, 
            color: "bg-emerald-100 text-emerald-600",
            trend: "+12%" // مثال لقيمة إضافية
          },
          { 
            title: "طلبات جديدة", 
            value: statsRes.today_orders, 
            unit: "طلب",
            icon: <Package size={24} />, 
            color: "bg-blue-100 text-blue-600" 
          },
          { 
            title: "طلبات الشهر", 
            value: statsRes.monthly_orders, 
            icon: <TrendingUp size={24} />, 
            color: "bg-violet-100 text-violet-600" 
          },
        ];

        setStats(formattedStats);
        setNotifications(notificationsRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم</h1>
        <p className="text-gray-500 text-sm">{new Date().toLocaleDateString('ar-KW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow duration-300 rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className={`p-4 rounded-2xl ${item.color}`}>
                  {item.icon}
                </div>
                {item.trend && (
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                    {item.trend}
                  </span>
                )}
              </div>
              <div className="mt-5">
                <p className="text-gray-400 text-sm font-medium">{item.title}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <h3 className="text-2xl font-bold text-gray-800">{item.value}</h3>
                  <span className="text-xs font-semibold text-gray-500">{item.unit}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notifications Section */}
      <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Bell size={20} className="text-blue-600" />
            </div>
            الإشعارات الأخيرة
          </h2>
          <button className="text-sm text-blue-600 hover:underline font-medium">مشاهدة الكل</button>
        </div>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-50">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="group flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 group-hover:bg-white transition-colors">
                    {n.type.includes("طلب") ? <ShoppingBag size={18} className="text-orange-500" /> : <Info size={18} className="text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-gray-800">{n.type}</p>
                      <span className="text-[11px] text-gray-400 font-medium">{n.time || "منذ قليل"}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">{n.message}</p>
                  </div>
                  <ChevronLeft size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
              ))
            ) : (
              <div className="p-10 text-center">
                <AlertCircle className="mx-auto text-gray-300 mb-3" size={40} />
                <p className="text-gray-500">لا توجد إشعارات جديدة حالياً</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}