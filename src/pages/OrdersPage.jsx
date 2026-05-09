import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { DollarSign, Package, CheckCircle, Clock, XCircle, ChevronDown, Calendar, Hash, Loader2 } from "lucide-react";
import axios from "axios"; // تأكد من تثبيته
import toast, { Toaster } from "react-hot-toast";
import getUserOrders from "../lib/client/fetchUserOrders";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [orders, setOrders] = useState([]); // البيانات القادمة من الباك اند
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // جلب البيانات عند تغيير التبويب أو عند فتح الصفحة
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // تأكد من أن الرابط يطابق الـ API الخاص بك
        // نرسل الـ status كـ Query Parameter للفلترة في الباك اند
        const response = await getUserOrders(activeTab);
        console.log(response);
        
        setOrders(response);
      } catch (error) {
        toast.error("فشل في تحميل الطلبات");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [activeTab]); // إعادة الطلب كلما تغير التبويب

  const formatCurrency = (amount) => 
    new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);

  const getStatusDetails = (status) => {
    const details = {
      pending: { text: "معلق", color: "bg-orange-100 text-orange-800", icon: Clock },
      confirmed: { text: "تم التأكيد", color: "bg-purple-100 text-purple-800", icon: CheckCircle },
      processing: { text: "قيد التحضير", color: "bg-yellow-100 text-yellow-800", icon: Clock },
      shipped: { text: "في الطريق", color: "bg-blue-100 text-blue-800", icon: Package },
      delivered: { text: "تم التسليم", color: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { text: "ملغاة", color: "bg-red-100 text-red-800", icon: XCircle },
    };
    return details[status] || { text: status, color: "bg-gray-100 text-gray-800", icon: Package };
  };

  const TABS = [
      { key: "pending", label: "معلقة" },
      { key: "confirmed", label: "المطعم استلم" },
      { key: "processing", label: "قيد التحضير" },
      { key: "shipped", label: "في الطريق" },
      { key: "delivered", label: "تم التسليم" },
      { key: "cancelled", label: "ملغاة" },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-8 bg-gray-50 min-h-screen text-right" dir="rtl">
      <Toaster />
      <h1 className="text-3xl font-extrabold text-gray-900 border-b pb-3">تتبع وإدارة طلباتك</h1>

      {/* 1. شريط التبويبات */}
      <div className="flex overflow-x-auto border-b border-gray-200 bg-white rounded-xl shadow-sm p-2 gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 px-6 py-3 rounded-lg text-sm font-bold transition-all duration-200 
              ${activeTab === tab.key 
                ? "bg-indigo-600 text-white shadow-md" 
                : "text-gray-600 hover:bg-gray-100"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2. عرض حالة التحميل أو القائمة */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-500 font-bold">جاري جلب طلباتك...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl shadow-md border-2 border-dashed border-gray-200">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-bold text-gray-700">لا توجد طلبات {TABS.find(t => t.key === activeTab)?.label} حالياً</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusDetail = getStatusDetails(order.status);
            const isExpanded = expandedOrder === order.id;

            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                    <div className="space-y-1">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">رقم الطلب</p>
                        <p className="font-black text-gray-900">#{order.id.toString().slice(-6)}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">التاريخ</p>
                        <p className="font-bold text-gray-700">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">الإجمالي</p>
                        <p className="font-black text-lg text-indigo-600">{formatCurrency(order.total_price || order.total)}</p>
                    </div>
                    <div className="text-left">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black ${statusDetail.color}`}>
                            <statusDetail.icon className="w-3 h-3 ml-2" />
                            {statusDetail.text}
                        </span>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50/50 flex justify-between items-center border-t border-gray-50">
                    <Button 
                        variant="ghost" 
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className="text-gray-500 font-bold hover:text-indigo-600"
                    >
                        {isExpanded ? "إخفاء التفاصيل" : "عرض المنتجات"}
                        <ChevronDown className={`w-4 h-4 mr-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </Button>
                </div>

                {isExpanded && (
                  <div className="px-6 py-4 bg-white border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-3">
                      {(order.items || []).map((item, i) => (
                        <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100 font-bold text-indigo-600">
                                {item.quantity || item.qty}x
                            </div>
                            <span className="font-bold text-gray-800">{item.Menu.name}</span>
                          </div>
                          <span className="font-black text-gray-900">{formatCurrency(item.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}