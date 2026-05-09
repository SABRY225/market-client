import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import BackButton from '../components/ui/BackButton';
import axios from 'axios'; // استيراد axios
import toast, { Toaster } from 'react-hot-toast'; // استيراد toast
import registerCleint from '../lib/client/register';

const CustomerRegister = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // 1. تعريف حالة البيانات (Form Data)
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        password: '',
    });

    const bgImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    // 2. تحديث البيانات عند الكتابة
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. دالة الإرسال إلى الـ Endpoint
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // استبدل الرابط برابط الـ API الخاص بك
            const response = await registerCleint(formData);
            console.log(response);
            
            if (response.status === 200 || response.status === 201) {
                toast.success('تم إنشاء الحساب بنجاح! جاري التحويل...');
                // توجيه المستخدم بعد ثانيتين
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء التسجيل، حاول مرة أخرى';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-fixed bg-center relative p-4"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            {/* مكون التنبيهات */}
            <Toaster position="top-center" reverseOrder={false} />

            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

            <div className="absolute top-6 right-6 z-20">
                <BackButton customText="العودة" /> 
            </div>

            <div className="relative z-10 w-full max-w-lg">
                <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden border border-white/20">
                    
                    <div className="bg-orange-600 p-8 text-center text-white">
                        <h2 className="text-3xl font-extrabold mb-2">إنشاء حساب</h2>
                        <p className="text-orange-100 text-sm">ابدأ رحلة تسوق مميزة معنا اليوم</p>
                    </div>

                    <form className="p-8 space-y-5" onSubmit={handleSubmit}>
                        
                        <div className='flex flex-col sm:flex-row gap-5'>
                            {/* حقل الاسم */}
                            <div className="space-y-1 flex-1">
                                <label className="text-sm font-semibold text-gray-700 mr-1">الاسم الكامل</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="أحمد محمد"
                                        className="block w-full pr-10 pl-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all outline-none text-right"
                                        required
                                    />
                                </div>
                            </div>

                            {/* حقل الهاتف */}
                            <div className="space-y-1 flex-1">
                                <label className="text-sm font-semibold text-gray-700 mr-1">رقم الهاتف</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                                        <Phone size={18} />
                                    </div>
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        type="tel"
                                        placeholder="01xxxxxxxxx"
                                        className="block w-full pr-10 pl-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all outline-none text-right"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row gap-5'>
                            {/* حقل البريد */}
                            <div className="space-y-1 flex-1">
                                <label className="text-sm font-semibold text-gray-700 mr-1">البريد الإلكتروني</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        type="email"
                                        placeholder="example@mail.com"
                                        className="block w-full pr-10 pl-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all outline-none text-right"
                                        required
                                    />
                                </div>
                            </div>

                            {/* حقل كلمة المرور */}
                            <div className="space-y-1 flex-1">
                                <label className="text-sm font-semibold text-gray-700 mr-1">كلمة المرور</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="block w-full pr-10 pl-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all outline-none text-right"
                                        required
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-orange-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* الشروط والأحكام */}
                        <div className="flex items-center gap-2 pt-2">
                            <input 
                                type="checkbox" 
                                id="terms" 
                                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                                required 
                            />
                            <label htmlFor="terms" className="text-xs text-gray-600 leading-none cursor-pointer">
                                أوافق على <span className="text-orange-600 font-bold hover:underline">الشروط</span> و <span className="text-orange-600 font-bold hover:underline">سياسة الخصوصية</span>
                            </label>
                        </div>

                        {/* زر الإرسال مع حالة التحميل */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-orange-200 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>إنشاء الحساب</span>
                                    <ArrowRight size={18} className="group-hover:mr-2 transition-all rotate-180" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-600">
                            لديك حساب بالفعل؟{' '}
                            <Link to="/login" className="text-orange-600 font-bold hover:text-orange-800 transition-colors">
                                سجل الدخول الآن
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerRegister;