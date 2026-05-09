import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, ChevronRight, Loader2 } from 'lucide-react';
import BackButton from '../components/ui/BackButton';
import axios from 'axios'; // استيراد axios
import toast, { Toaster } from 'react-hot-toast'; // استيراد toast
import loginCleint from '../lib/client/login';

const CustomerLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 1. تعريف حالة بيانات الدخول
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const bgImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    // 2. تحديث البيانات عند الكتابة
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    // 3. دالة معالجة تسجيل الدخول
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // استبدل هذا الرابط بـ Endpoint تسجيل الدخول الخاص بك
            const response = await loginCleint(credentials);

            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('role', "customer");
                localStorage.setItem('user', JSON.stringify(response.user));
                
                toast.success('تم تسجيل الدخول بنجاح! مرحباً بك');
                
                // التوجيه بعد نجاح العملية
                setTimeout(() => navigate('/'), 1500);
            }
        } catch (error) {
            // إظهار رسالة خطأ بناءً على رد السيرفر
            const message = error.response?.data?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-fixed bg-center relative p-4"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            {/* مكون التنبيهات العلوي */}
            <Toaster position="top-center" reverseOrder={false} />

            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1.5px]"></div>

            <div className="absolute top-6 right-6 z-20">
                <BackButton customText="العودة" /> 
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden border border-white/20">
                    
                    <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-10 text-center text-white">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                            <LogIn size={32} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-bold">مرحباً بك مجدداً</h2>
                        <p className="text-orange-100/80 text-sm mt-2">سجل دخولك للوصول إلى حسابك وطلباتك</p>
                    </div>

                    <form className="p-8 space-y-6" onSubmit={handleSubmit}>
                        
                        {/* حقل البريد الإلكتروني */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 block mr-1">البريد الإلكتروني</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-600 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    placeholder="example@mail.com"
                                    className="block w-full pr-11 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all outline-none text-right"
                                    required
                                />
                            </div>
                        </div>

                        {/* حقل كلمة المرور */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-bold text-gray-700">كلمة المرور</label>
                                <Link to="/forgot-password" size="sm" className="text-xs font-semibold text-orange-600 hover:text-orange-800 transition-colors">
                                    نسيت كلمة المرور؟
                                </Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-600 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={credentials.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="block w-full pr-11 pl-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all outline-none text-right"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 hover:text-orange-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* زر الدخول مع حالة التحميل */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-orange-200 transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={22} />
                            ) : (
                                <>
                                    <span>تسجيل الدخول</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="px-8 pb-8 text-center">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">أو</span></div>
                        </div>
                        
                        <p className="text-gray-600">
                            ليس لديك حساب؟{' '}
                            <Link to="/register" className="text-orange-600 font-bold hover:underline inline-flex items-center gap-1 group">
                                إنشاء حساب جديد
                                <ChevronRight size={16} className="rotate-180 group-hover:translate-x-[-4px] transition-transform" />
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerLogin;