import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Settings2, Megaphone, ShoppingBag, 
  Gift, UserPlus, Truck, Wallet, ChevronLeft 
} from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const settingsLinks = [
    { key: "general", label: "الإعلانات",  icon: Megaphone, color: "bg-blue-500" },
    { key: "mart", label: "المارت", icon: ShoppingBag, color: "bg-emerald-500" },
    { key: "integrations", label: "مكافآت العملاء", icon: Gift, color: "bg-purple-500" },
    { key: "invitation-system", label: "نظام الدعوات والنقاط",  icon: UserPlus, color: "bg-amber-500" },
    { key: "delivery-system", label: "نظام التوصيل",  icon: Truck, color: "bg-rose-500" },
  ];

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen" dir="rtl">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsLinks.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                onClick={() => navigate(`./${item.key}`)}
                className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-transparent transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className={`w-14 h-14 ${item.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.label}</h3>

                </div>
                
                <div className="mt-8 flex items-center text-gray-400 group-hover:text-gray-900 transition-colors font-medium text-sm">
                  <span>فتح الإعدادات</span>
                  <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Settings;