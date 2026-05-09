import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { 
  FileText, Loader2, PackageSearch, CheckCircle2, 
  Truck, Clock, AlertCircle, Eye 
} from "lucide-react";
import getSallerOrders from "../lib/saller/fetchSallerOrders";
import updateOrderStatus from "../lib/saller/updateOrderStatus";
import { Link } from "react-router-dom";

export default function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getSallerOrders();
      setOrders(data);
    } catch (error) {
      console.error("خطأ في جلب الطلبات:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "تم التسليم":
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "تم الشحن":
      case "shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "جاري المعالجة":
      case "processing":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50/30 min-h-screen rtl text-right" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-blue-600" /> إدارة الطلبات
          </h1>
          <p className="text-sm text-gray-500 mt-1">تابع حالة مبيعاتك وطلبات العملاء</p>
        </div>
        <div className="text-sm font-bold text-blue-600 bg-blue-50 px-5 py-2 rounded-2xl border border-blue-100 shadow-sm">
          إجمالي الطلبات: {orders.length}
        </div>
      </div>

      {/* Orders Table */}
      <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50/80 text-gray-600 border-b">
                  <th className="p-5 font-bold text-sm">رقم الطلب</th>
                  <th className="p-5 font-bold text-sm text-center">المبلغ</th>
                  <th className="p-5 font-bold text-sm text-center">الحالة</th>
                  <th className="p-5 font-bold text-sm text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-5">
                      <span className="font-mono font-bold text-gray-700 uppercase">
                        #{order.id.toString().slice(-6)}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <span className="font-bold text-gray-900 text-lg">
                        {order.total}
                      </span>
                      <span className="text-xs text-gray-500 mr-1">ج.م</span>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <Link 
                        to={`./${order.id}`} // الانتقال لصفحة التفاصيل
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md active:scale-95 text-sm"
                      >
                        <Eye size={16} />
                        تفاصيل الطلب
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Delivered */}
        <Card className="border-none shadow-sm rounded-3xl bg-white border border-gray-100">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
              <CheckCircle2 className="text-green-500" size={22} /> آخر الطلبات المسلمة
            </h2>
            <div className="space-y-3">
              {orders.filter(o => o.status === "delivered" || o.status === "تم التسليم").slice(0, 3).map(old => (
                <div key={old.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 text-blue-600 font-bold text-xs">
                      #{old.id.toString().slice(-3)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{old.product || "منتج عام"}</p>
                      <p className="text-xs text-gray-500">{old.customer || "عميل مجهول"}</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg uppercase">
                    مكتمل
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Card */}
        <Card className="border-none shadow-lg rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white relative overflow-hidden">
          <div className="absolute top-[-20px] left-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <CardContent className="p-8 flex flex-col justify-center h-full relative z-10">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner">
                <Truck size={32} className="text-white" />
              </div>
              <div>
                <p className="text-blue-100 text-sm font-medium">طلبات جاري تجهيزها</p>
                <h3 className="text-4xl font-black mt-1">
                  {orders.filter(o => o.status === "processing" || o.status === "جاري المعالجة").length}
                  <span className="text-lg font-normal mr-2 opacity-80">طلبات</span>
                </h3>
              </div>
            </div>
            <button className="mt-8 w-full py-4 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-1 active:scale-95">
              تجهيز بوليصات الشحن
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}