import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { 
  LifeBuoy, Send, MessageSquare, Clock, CheckCircle2, 
  AlertCircle, Loader2, ChevronDown, Bell 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import getSallerTickets from "../lib/saller/fetchSallerTickets";
import createSallerTicket from "../lib/saller/createSallerTicket";

export default function VendorSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newTicket, setNewTicket] = useState({
    type: "",
    subject: "",
    message: "",
  });

  // 1. جلب التذاكر عند تحميل الصفحة
  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await getSallerTickets();
        setTickets(data);
      } catch (error) {
        toast.error("فشل في تحميل التذاكر");
      } finally {
        setLoading(false);
      }
    };
    loadTickets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTicket({ ...newTicket, [name]: value });
  };

  // 2. إرسال تذكرة جديدة للسيرفر
  const handleSubmit = async () => {
    if (!newTicket.type || !newTicket.subject || !newTicket.message) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    setSubmitting(true);
    try {
      const response = await createSallerTicket(newTicket);
      setTickets([response, ...tickets]); // إضافة التذكرة الجديدة لأعلى القائمة
      setNewTicket({ type: "", subject: "", message: "" });
      toast.success("تم إرسال تذكرتك بنجاح، فريقنا سيرد عليك قريباً");
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الطلب");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "تم الرد": return "bg-green-100 text-green-700 border-green-200";
      case "قيد المراجعة": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-blue-100 text-blue-700 border-blue-200";
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
    <div className="p-6 space-y-8 bg-gray-50/30 min-h-screen rtl text-right">
      <Toaster position="top-center" />
      
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-100">
          <LifeBuoy size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">مركز الدعم الفني</h2>
          <p className="text-sm text-gray-500">نحن هنا لمساعدتك في حل أي مشكلة تواجهك</p>
        </div>
      </div>

      {/* إنشاء تذكرة جديدة */}
      <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
        <CardContent className="p-6 space-y-6 mt-2">
          <div className="flex items-center gap-2 text-blue-600 border-b border-gray-50 pb-4">
            <MessageSquare size={20} />
            <h3 className="text-lg font-bold">فتح تذكرة دعم جديدة</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 mr-1">نوع المشكلة</label>
              <div className="relative">
                <select
                  name="type"
                  value={newTicket.type}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none rounded-2xl p-3 pr-4 focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                >
                  <option value="">اختر القسم المختص...</option>
                  <option value="طلبات">📦 مشكلة في الطلبات</option>
                  <option value="منتجات">🏷️ مشكلة في المنتجات</option>
                  <option value="مدفوعات">💰 الاستفسارات المالية</option>
                  <option value="أخرى">🛠️ مشكلة تقنية أخرى</option>
                </select>
                <ChevronDown className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 mr-1">عنوان الموضوع</label>
              <input
                type="text"
                name="subject"
                placeholder="اكتب عنواناً مختصراً للمشكلة"
                value={newTicket.subject}
                onChange={handleChange}
                className="w-full bg-gray-50 border-none rounded-2xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600 mr-1">تفاصيل المشكلة</label>
            <Textarea
              name="message"
              placeholder="يرجى شرح المشكلة بالتفصيل لنتمكن من مساعدتك بشكل أسرع..."
              value={newTicket.message}
              onChange={handleChange}
              className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 min-h-[120px]"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-12 h-12 flex gap-2 shadow-lg shadow-blue-50 transition-all font-bold"
          >
            {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            إرسال التذكرة الآن
          </Button>
        </CardContent>
      </Card>

      {/* قائمة التذاكر */}
      <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">تتبع تذاكرك السابقة</h3>
          <span className="text-xs font-medium text-gray-400">إجمالي التذاكر: {tickets.length}</span>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-sm">
                  <th className="p-4 font-bold">رقم التذكرة</th>
                  <th className="p-4 font-bold">القسم</th>
                  <th className="p-4 font-bold">الموضوع</th>
                  <th className="p-4 font-bold text-center">الحالة</th>
                  <th className="p-4 font-bold">آخر تحديث (الرد)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 font-bold text-blue-600 text-sm">#{ticket.id}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">
                        {ticket.type}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-800 font-medium">{ticket.subject}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusStyle(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {ticket.response ? (
                        <div className="flex items-start gap-2 bg-green-50/50 p-3 rounded-2xl border border-green-100">
                          <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-green-800 leading-relaxed">{ticket.response}</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock size={16} />
                          <span className="text-xs italic">بانتظار مراجعة الإدارة...</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tickets.length === 0 && (
              <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                <AlertCircle size={48} className="mb-3 opacity-20" />
                <p>لا توجد تذاكر سابقة لديك حالياً.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* قسم الإشعارات الجانبية السريعة */}
      {tickets.some((t) => t.status === "تم الرد") && (
        <Card className="border-none shadow-sm rounded-3xl bg-emerald-600 text-white overflow-hidden">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-2xl">
              <Bell className="animate-bounce" size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg leading-none">لديك ردود جديدة!</h3>
              <p className="text-sm text-emerald-100">تم الرد على بعض تذاكرك، يمكنك مراجعة التفاصيل في الجدول أعلاه.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}