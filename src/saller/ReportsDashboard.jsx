import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { FileText, Download, TrendingUp, DollarSign, RefreshCcw, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import getReportsData from "../lib/saller/fetchReportsData";

export default function ReportsDashboard() {
  const [period, setPeriod] = useState("daily");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    chartData: [],
    topProducts: [],
    summary: { returnsRate: "0%", totalProfit: "0" }
  });


  useEffect(() => {
  console.log("useEffect fired, period =", period);

  const fetchData = async () => {
    console.log("fetchData start");
          try {
        const result = await getReportsData(period);
        setData(result);
        console.log("asdasd");
        
      } catch (error) {
        toast.error("فشل في تحديث بيانات التقارير");
      } finally {
        setLoading(false);
      }
  };

  fetchData();
}, [period]);


  const handleExportExcel = () => {
    toast.success("يتم الآن إعداد ملف Excel...");
    // هنا يتم استدعاء API التصدير
  };

  const handleExportPDF = () => {
    toast.success("جاري إنشاء تقرير PDF...");
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50/30 min-h-screen rtl text-right">
      <Toaster position="top-center" />
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="text-blue-600" /> التقارير والتحليلات
          </h1>
          <p className="text-sm text-gray-500 mt-1">راقب أداء متجرك ونمو مبيعاتك لحظة بلحظة</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-white border-none shadow-sm rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-600 cursor-pointer"
          >
            <option value="daily">📅 تقرير المبيعات اليومية</option>
            <option value="monthly">📊 تقرير المبيعات الشهرية</option>
          </select>

          <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block"></div>

          <button
            onClick={handleExportExcel}
            className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
            title="تصدير Excel"
          >
            <Download size={20} />
          </button>
          <button
            onClick={handleExportPDF}
            className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
            title="تصدير PDF"
          >
            <FileText size={20} />
          </button>
        </div>
      </header>

      {/* بطاقات الملخص السريع */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm rounded-3xl bg-white group hover:shadow-md transition-all">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">الأرباح الإجمالية</p>
              <h3 className="text-2xl font-black text-gray-800 tracking-tight">
                {loading ? "..." : `${data.summary.totalProfit} EGP`}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl bg-white group hover:shadow-md transition-all">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl group-hover:scale-110 transition-transform">
              <RefreshCcw size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">نسبة الإرجاع</p>
              <h3 className="text-2xl font-black text-gray-800 tracking-tight">
                {loading ? "..." : data.summary.returnsRate}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl bg-blue-600 text-white shadow-lg shadow-blue-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">أداء المتجر العام</p>
              <h3 className="text-xl font-bold mt-1">نمو مستقر 🚀</h3>
            </div>
            <div className="bg-white/20 p-2 rounded-lg text-xs">محدث الآن</div>
          </CardContent>
        </Card>
      </div>

      {/* الرسم البياني الرئيسي */}
      <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-gray-700">
              {period === "daily" ? "مخطط المبيعات اليومي (الأسبوعي)" : "تحليل النمو الشهري"}
            </h2>
          </div>
          
          <div className="h-[350px] w-full relative">
            {loading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={32} />
              </div>
            )}
            
            <ResponsiveContainer width="100%" height="100%">
              {period === "daily" ? (
                <LineChart data={data.chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                    cursor={{stroke: '#2563eb', strokeWidth: 2}}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    strokeWidth={4}
                    dot={{ r: 6, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={data.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none'}} cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* المنتجات الأكثر مبيعاً */}
      <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-lg font-bold text-gray-700">🏆 قائمة الأبطال (المنتجات الأعلى مبيعاً)</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.topProducts.map((p, i) => (
              <div
                key={i}
                className="group flex flex-col p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all"
              >
                <span className="text-xs font-bold text-blue-500 mb-1">المركز #{i + 1}</span>
                <span className="font-bold text-gray-700 truncate">{p.name}</span>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-2xl font-black text-gray-800">{p.sales}</span>
                  <span className="text-sm text-gray-400 font-medium">مبيع</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}