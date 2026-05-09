import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import getAnalyticsStatistics from "../lib/fetchAnalyticsStatistics";
import getAnalyticsMonthlySales from "../lib/fetchAnalyticsMonthlySales";
import getAnalyticsActiveUsers from "../lib/fetchAnalyticsActiveUsers";
import getAnalyticsMostViewedProducts from "../lib/fetchAnalyticsMostViewedProducts";
import getAnalyticsPlatformMonthlyProfits from "../lib/fetchAnalyticsPlatformMonthlyProfits";
import { AlertTriangle, DollarSign, Eye, Flame, Loader2, Package, ShoppingBag, Trophy, Users, XCircle } from "lucide-react";

function AnalyticsDashboard() {
const [analytics, setAnalytics] = useState({});
  const [analyticsMonthlySales, setAnalyticsMonthlySalesData] = useState([]);
  const [analyticsActiveUsers, setAnalyticsActiveUsers] = useState([]);
  const [analyticsMostViewedProducts, setAnalyticsMostViewedProducts] = useState([]);
  
  // 1. إضافة حالة التحميل
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true); // البدء بالتحميل
        
        // جلب البيانات (يفضل استخدام Promise.all لتسريع العملية)
        const [stats, sales, users, products] = await Promise.all([
          getAnalyticsStatistics(),
          getAnalyticsMonthlySales(),
          getAnalyticsActiveUsers(),
          getAnalyticsMostViewedProducts()
        ]);

        setAnalytics(stats);
        setAnalyticsMonthlySalesData(sales);
        setAnalyticsActiveUsers(users);
        setAnalyticsMostViewedProducts(products);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // إنهاء التحميل سواء نجح أو فشل
      }
    };

    load();
  }, []);

  // 2. شاشة التحميل
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium animate-pulse">جاري تحميل البيانات الإحصائية...</p>
      </div>
    );
  }

const stats = [
    {
      title: "إجمالي المبيعات",
      value: `${analytics.totalSales} ج.م`,
      icon: <DollarSign size={24} />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "المستخدمين النشطين",
      value: analytics.usersCount,
      icon: <Users size={24} />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "عدد الطلبات",
      value: analytics.ordersCount,
      icon: <ShoppingBag size={24} />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "إجمالي المنتجات",
      value: analytics?.products?.totalProducts,
      icon: <Package size={24} />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "نفذت من المخزن",
      value: analytics?.products?.outOfStock,
      icon: <XCircle size={24} />,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "مخزون منخفض",
      value: analytics?.products?.lowStock,
      icon: <AlertTriangle size={24} />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];
  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">التقارير والتحليلات</h2>

      {/* بطاقات الإحصائيات */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 p-6 bg-gray-50 rounded-xl">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center group"
        >
          <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color} mb-3 group-hover:scale-110 transition-transform`}>
            {stat.icon}
          </div>
          <span className="text-gray-500 text-xs font-medium mb-1 truncate">
            {stat.title}
          </span>
          <span className={`text-xl font-bold ${stat.color} tracking-tight`}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>

      {/* الرسم البياني للمبيعات */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">📈 المبيعات الشهرية</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsMonthlySales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toLocaleString()} ج.م`} />
            <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* المستخدمين النشطين */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">👥 حركة المستخدمين (Active Users)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={analyticsActiveUsers}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="active" fill="#10b981" barSize={40} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* المنتجات الأكثر مشاهدة */}
<div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-white to-orange-50/30">
        <div className="flex items-center gap-2">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Flame className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">المنتجات الأكثر مبيعا</h3>
        </div>
        <span className="text-xs font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
          الأكثر رواجاً اليوم
        </span>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-right border-separate border-spacing-y-2 px-4">
          <thead>
            <tr className="text-gray-400 text-sm uppercase tracking-wider">
              <th className="p-3 font-medium">الترتيب</th>
              <th className="p-3 font-medium">المنتج</th>
              <th className="p-3 font-medium">المبيعات</th>
            </tr>
          </thead>
          <tbody>
            {analyticsMostViewedProducts.map((p, i) => (
              <tr key={i} className="group hover:bg-gray-50 transition-colors duration-200">
                {/* Rank */}
                <td className="p-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-600 font-bold text-sm group-hover:bg-white group-hover:shadow-sm">
                    {i === 0 ? <Trophy className="w-4 h-4 text-yellow-500" /> : i + 1}
                  </div>
                </td>

                {/* Product Name & Image */}
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                      {p.name}
                    </span>
                  </div>
                </td>

                {/* View Count */}
                <td className="p-3">
                  <div className="flex items-center justify-center gap-1 text-gray-700 bg-gray-50 rounded-lg py-1 px-2 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                    <span className="font-bold">{p.sales}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}

export default AnalyticsDashboard;
