// src/pages/Contact.jsx
import React from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, MessageSquare } from "lucide-react";

export default function Contact() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen py-12 px-4 sm:px-8 text-right" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-black text-gray-900">لنتحدث قليلاً!</h1>
          <p className="text-gray-500 mt-4 text-lg font-medium">لديك استفسار، اقتراح، أو ترغب في الانضمام كشريك؟ نحن هنا من أجلك.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-8">
              <ContactDetail 
                icon={Phone} 
                title="اتصل بنا مباشرة" 
                value="+٢٠ ١٠٠ ٢٣٤ ٥٦٧٨" 
                desc="من السبت للخميس، ٩ص - ٩م"
              />
              <ContactDetail 
                icon={Mail} 
                title="البريد الإلكتروني" 
                value="hello@foodie.app" 
                desc="سنرد عليك خلال ٢٤ ساعة"
              />
              <ContactDetail 
                icon={MapPin} 
                title="المكتب الرئيسي" 
                value="القاهرة، التجمع الخامس" 
                desc="برج الأعمال، الدور الرابع"
              />
            </div>

            {/* Social Media */}
            <div className="flex gap-4 justify-center lg:justify-start">
              <SocialIcon Icon={Instagram} color="hover:bg-pink-500" />
              <SocialIcon Icon={Twitter} color="hover:bg-blue-400" />
              <SocialIcon Icon={Facebook} color="hover:bg-blue-700" />
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-50">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 mr-2">الاسم</label>
                    <Input placeholder="أحمد محمد" className="h-14 rounded-2xl bg-gray-50 border-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 mr-2">البريد الإلكتروني</label>
                    <Input type="email" placeholder="name@email.com" className="h-14 rounded-2xl bg-gray-50 border-none font-bold" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 mr-2">نوع الاستفسار</label>
                  <select className="w-full h-14 rounded-2xl bg-gray-50 border-none px-4 font-bold text-gray-700 outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none">
                    <option>عام</option>
                    <option>شراكة مطاعم</option>
                    <option>انضم كطيار (ديليفري)</option>
                    <option>بلاغ عن مشكلة تقنية</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 mr-2">رسالتك</label>
                  <Textarea 
                    placeholder="كيف يمكننا مساعدتك اليوم؟" 
                    className="rounded-2xl bg-gray-50 border-none font-medium min-h-[150px]"
                  />
                </div>

                <Button className="w-full h-16 bg-orange-500 hover:bg-orange-600 text-white rounded-[1.5rem] font-black text-xl shadow-lg transition-all">
                   إرسال الرسالة
                </Button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const ContactDetail = ({ icon: Icon, title, value, desc }) => (
  <div className="flex items-start gap-5">
    <div className="bg-gray-900 p-4 rounded-2xl text-white">
      <Icon size={24} />
    </div>
    <div>
      <h4 className="font-black text-gray-900">{title}</h4>
      <p className="text-orange-600 font-bold mt-1" dir="ltr">{value}</p>
      <p className="text-xs text-gray-400 mt-1 font-medium">{desc}</p>
    </div>
  </div>
);

const SocialIcon = ({ Icon, color }) => (
  <button className={`p-4 bg-white rounded-2xl text-gray-400 transition-all shadow-sm ${color} hover:text-white`}>
    <Icon size={24} />
  </button>
);