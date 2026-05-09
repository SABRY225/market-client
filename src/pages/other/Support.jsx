// src/pages/FoodSupport.jsx
import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { 
  Send, Clock, CheckCircle, Ticket, Mail, Phone, 
  FileText, X, MessageCircle, HelpCircle, Utensils, 
  Truck, CreditCard, ChevronLeft 
} from "lucide-react";

export default function FoodSupport() {
  const [tickets, setTickets] = useState([
    {
      id: "TK-8821",
      subject: "الطعام وصل بارداً",
      category: "جودة الطعام",
      status: "open",
      messages: [
        { sender: "System", text: "تم فتح تذكرة بخصوص الطلب #ORD552" },
        { sender: "Support", text: "نعتذر بشدة عن ذلك. هل يمكنك إرفاق صورة للوجبة؟" },
      ],
      date: "اليوم، 02:30 م",
    },
    {
      id: "TK-7710",
      subject: "تغيير عنوان التوصيل",
      category: "تعديل طلب",
      status: "closed",
      messages: [
        { sender: "System", text: "تم فتح التذكرة." },
        { sender: "Support", text: "تم تحديث العنوان بنجاح وتوجيه السائق." },
        { sender: "System", text: "تم حل المشكلة." },
      ],
      date: "أمس، 09:15 م",
    },
  ]);

  const [newTicket, setNewTicket] = useState({ subject: "", description: "", category: "general" });
  const [notification, setNotification] = useState(null);

  const handleSubmit = () => {
    if (!newTicket.subject || !newTicket.description) {
      setNotification({ type: 'error', message: "يرجى كتابة الموضوع والوصف للمساعدة" });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    const ticket = {
      id: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
      ...newTicket,
      status: "open",
      messages: [{ sender: "System", text: "جارٍ ربطك مع موظف الدعم المختص..." }],
      date: "الآن",
    };
    setTickets([ticket, ...tickets]);
    setNewTicket({ subject: "", description: "", category: "general" });
    setNotification({ type: 'success', message: "تم إرسال طلبك، سنتواصل معك خلال دقائق" });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-10 bg-[#FAFAFA] min-h-screen text-right" dir="rtl">
      
      {/* الرأس */}
      <div className="text-center space-y-3 py-6">
        <h1 className="text-4xl font-black text-gray-900">كيف يمكننا مساعدتك؟</h1>
        <p className="text-gray-500 font-medium">فريق Foodie متاح دائماً لضمان وصول وجبتك بأفضل حال</p>
      </div>

      {/* إشعار عائم */}
      {notification && (
        <div className={`fixed top-6 left-6 z-50 p-4 rounded-2xl shadow-2xl text-white flex items-center gap-3 animate-bounce ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
          <span className="font-bold">{notification.message}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* 1. قائمة التذاكر السابقة (العمود الجانبي) */}
        <div className="lg:col-span-4 space-y-6">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Clock className="text-orange-500" /> تذاكرك الحالية
            </h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pl-2">
                {tickets.map((ticket) => (
                    <div key={ticket.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 hover:border-orange-200 transition-all group cursor-pointer">
                        <div className="flex justify-between items-start mb-3">
                            <Badge className={`rounded-full px-3 py-1 font-bold ${ticket.status === 'open' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                {ticket.status === 'open' ? 'نشطة' : 'مكتملة'}
                            </Badge>
                            <span className="text-[10px] font-bold text-gray-400">{ticket.date}</span>
                        </div>
                        <h3 className="font-black text-gray-800 group-hover:text-orange-600 transition-colors">{ticket.subject}</h3>
                        <p className="text-xs text-gray-500 mt-1">رقم التذكرة: {ticket.id}</p>
                        <div className="mt-4 flex -space-x-2 space-x-reverse">
                            <div className="w-6 h-6 rounded-full bg-orange-500 border-2 border-white"></div>
                            <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* 2. منطقة العمل الرئيسية (فتح تذكرة أو محادثة) */}
        <div className="lg:col-span-8 space-y-8">
            
            {/* خيارات سريعة للمشاكل الشائعة */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SupportCategory icon={Truck} label="تأخر الطلب" color="bg-blue-50 text-blue-600" />
                <SupportCategory icon={Utensils} label="مشكلة بالوجبة" color="bg-red-50 text-red-600" />
                <SupportCategory icon={CreditCard} label="الدفع والاسترداد" color="bg-green-50 text-green-600" />
                <SupportCategory icon={HelpCircle} label="أخرى" color="bg-purple-50 text-purple-600" />
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 space-y-6">
                <div className="flex items-center gap-4 border-b pb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                        <MessageCircle />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900">أخبرنا بما حدث</h2>
                        <p className="text-sm text-gray-500">سيقوم أحد ممثلي الخدمة بالرد عليك خلال أقل من دقيقتين</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-600 mr-2">موضوع البلاغ</label>
                        <Input 
                            placeholder="مثال: نسيت إضافة المشروب في طلب رقم #552"
                            value={newTicket.subject}
                            onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                            className="h-14 rounded-2xl bg-gray-50 border-none font-bold placeholder:text-gray-300"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-600 mr-2">التفاصيل</label>
                        <Textarea 
                            placeholder="اشرح لنا المشكلة بمزيد من التفاصيل..."
                            value={newTicket.description}
                            onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                            className="rounded-2xl bg-gray-50 border-none font-medium min-h-[150px] placeholder:text-gray-300"
                        />
                    </div>

                    <div className="flex items-center gap-4 bg-orange-50/50 p-4 rounded-2xl border border-dashed border-orange-200">
                        <FileText className="text-orange-500" />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-gray-700">إرفاق صورة</p>
                            <p className="text-[10px] text-gray-500">صور الوجبة أو الفاتورة لمساعدتنا في التحقق</p>
                        </div>
                        <input type="file" className="hidden" id="food-upload" />
                        <label htmlFor="food-upload" className="cursor-pointer bg-white px-4 py-2 rounded-xl text-xs font-black shadow-sm">اختيار ملف</label>
                    </div>

                    <Button 
                        onClick={handleSubmit}
                        className="w-full h-16 bg-orange-500 hover:bg-orange-600 text-white rounded-[1.5rem] font-black text-xl shadow-lg shadow-orange-100 transition-all hover:scale-[1.01]"
                    >
                        بدء المحادثة الآن
                    </Button>
                </div>
            </div>

            {/* قسم التواصل المباشر */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-900 p-6 rounded-[2rem] text-white flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                            <Phone size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">اتصل بنا</p>
                            <p className="font-black text-lg" dir="ltr">19xxx</p>
                        </div>
                    </div>
                    <ChevronLeft className="text-gray-500 rotate-180" />
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                            <MessageCircle size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">راسلنا واتساب</p>
                            <p className="font-black text-lg text-gray-800">سريع وفوري</p>
                        </div>
                    </div>
                    <ChevronLeft className="text-gray-300 rotate-180" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

// مكون مساعد لتصنيفات الدعم
const SupportCategory = ({ icon: Icon, label, color }) => (
    <button className="flex flex-col items-center gap-3 p-5 bg-white rounded-[2rem] shadow-sm border border-gray-50 hover:border-orange-200 transition-all group">
        <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${color}`}>
            <Icon size={24} />
        </div>
        <span className="text-xs font-black text-gray-700">{label}</span>
    </button>
);