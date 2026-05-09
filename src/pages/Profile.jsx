import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { User, Settings, History, Loader2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import getUserData from "../lib/client/fetchUserData";
import updateUserData from "../lib/client/updateUserData";
// 1. استيراد المكتبة
import toast, { Toaster } from "react-hot-toast";

export default function FoodProfile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  
  const [userInfo, setUserInfo] = useState({ 
    name: "", email: "", phone: "", address: "", city: "" 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData(user.id);
        setUserInfo(response);
      } catch (error) {
        toast.error("فشل في تحميل بيانات المستخدم");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setSaving(true);
    // يمكنك استخدام toast.promise لجعل العملية أكثر احترافية
    const updatePromise = updateUserData(userInfo, user.id);

    toast.promise(updatePromise, {
      loading: 'جاري حفظ البيانات...',
      success: <b>تم تحديث بياناتك بنجاح! 🎉</b>,
      error: <b>عذراً، تعذر الحفظ. حاول ثانية.</b>,
    }, {
      style: {
        borderRadius: '15px',
        background: '#333',
        color: '#fff',
        fontFamily: 'Tajawal, sans-serif',
      },
    });

    try {
      await updatePromise;
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-orange-500" /></div>;

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 bg-[#FAFAFA] min-h-screen text-right" dir="rtl">
      {/* 2. إضافة مكون Toaster في أي مكان داخل الـ return */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* الرأس */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900">حسابي</h1>
          <p className="text-gray-500 mt-1 font-medium">أهلاً بك مجدداً، {userInfo.name}!</p>
        </div>
        <div className="flex gap-2">
            <button onClick={()=> navigate("/orders")} className="flex items-center rounded-2xl border border-gray-200 h-12 px-6 font-bold bg-white shadow-sm hover:bg-gray-50" >
                <History className="w-5 h-5 ml-2 text-orange-500" />
                طلباتي السابقة
            </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* العمود الأيمن */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-orange-400 to-orange-600 opacity-10"></div>
                <div className="relative">
                    <User size={20} className="w-28 h-28 rounded-[2rem] bg-gray-100 p-4 mx-auto ring-8 ring-white shadow-xl text-orange-500"/>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mt-6">{userInfo.name}</h2>
                <div className="grid grid-cols-2 gap-3 mt-8">
                    <div className="bg-gray-50 p-4 rounded-2xl">
                        <p className="text-2xl font-black text-orange-600">{userInfo.ordersCount || 0}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">إجمالي الطلبات</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl">
                        <p className="text-2xl font-black text-orange-600">{userInfo.favoritesCount || 0}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">المفضلة</p>
                    </div>
                </div>
            </div>
        </div>

        {/* العمود الأيسر */}
        <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                    <Settings className="text-orange-500" /> إعدادات الحساب
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-600 mr-2">الاسم بالكامل</label>
                        <Input name="name" value={userInfo.name} onChange={handleChange} className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500/20 font-bold" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-600 mr-2">رقم الجوال</label>
                        <Input name="phone" value={userInfo.phone} onChange={handleChange} className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500/20 font-bold" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-bold text-gray-600 mr-2">البريد الإلكتروني</label>
                        <Input name="email" value={userInfo.email} onChange={handleChange} className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500/20 font-bold" />
                    </div>

                    <div className="md:col-span-2 border-t border-gray-50 my-2 pt-6">
                         <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <MapPin size={18} className="text-orange-500"/> تفاصيل العنوان
                         </h3>
                         <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 mr-2">المدينة</label>
                                <Input name="city" value={userInfo.city} onChange={handleChange} placeholder="مثال: القاهرة" className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500/20 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 mr-2">العنوان بالتفصيل</label>
                                <Input name="address" value={userInfo.address} onChange={handleChange} placeholder="الشارع، رقم المبنى..." className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500/20 font-bold" />
                            </div>
                         </div>
                    </div>
                </div>

                <Button 
                  onClick={handleUpdate}
                  disabled={saving}
                  className="mt-8 bg-gray-900 hover:bg-black text-white px-10 h-14 rounded-2xl font-black min-w-[180px]"
                >
                  {saving ? <Loader2 className="animate-spin ml-2" /> : "حفظ التغييرات"}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}