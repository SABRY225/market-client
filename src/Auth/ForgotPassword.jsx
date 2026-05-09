import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // أضفنا useNavigate هنا
import { Mail, ArrowLeft, CheckCircle2, SendHorizontal, Loader2, Eye, EyeOff, Lock } from 'lucide-react';
import BackButton from '../components/ui/BackButton';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import sendCode from '../lib/client/sendCode';
import forgetPassword from '../lib/client/forgetPassword';

const ForgotPassword = () => {
    const navigate = useNavigate(); // تعريف navigate لإصلاح الخطأ المحتمل
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resetData, setResetData] = useState({
        code: '',
        newPassword: ''
    });
    const [showNewPassword, setShowNewPassword] = useState(false);

    const bgImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    // طلب الكود
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await sendCode(email);
            toast.success('تم إرسال كود التحقق بنجاح');
            setIsSubmitted(true);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'عذراً، البريد الإلكتروني غير مسجل لدينا';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // تعيين كلمة المرور الجديدة
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // استبدل بالرابط الفعلي الخاص بك
            await forgetPassword({
                email,
                code: resetData.code,
                password: resetData.newPassword
            }); 

            toast.success('تم تغيير كلمة المرور بنجاح!');
            // التوجيه لصفحة تسجيل الدخول
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'الكود غير صحيح أو انتهت صلاحيته');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-fixed bg-center relative p-4"
             style={{ backgroundImage: `url(${bgImage})` }}>
            <Toaster position="top-center" />
            <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-[2px]"></div>

            <div className="absolute top-6 right-6 z-20">
                <BackButton customText="العودة للدخول" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden border border-white/20 transition-all duration-500">
                    
                    {/* Header */}
                    <div className={`p-10 text-center text-white transition-colors duration-500 ${isSubmitted ? 'bg-green-600' : 'bg-orange-600'}`}>
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                            {isSubmitted ? <CheckCircle2 size={40} className="animate-bounce" /> : <Mail size={40} />}
                        </div>
                        <h2 className="text-3xl font-bold">
                            {isSubmitted ? 'تحقق من الكود' : 'نسيت كلمة المرور؟'}
                        </h2>
                    </div>

                    <div className="p-8">
                        {isSubmitted ? (
                            /* واجهة إدخال الكود والباسورد الجديد */
                            <div className="space-y-6 animate-fade-in">
                                <div className="text-center space-y-2">
                                    <p className="text-gray-600">أدخل الكود المرسل إلى:</p>
                                    <p className="font-bold text-orange-600">{email}</p>
                                </div>

                                <form className="space-y-4" onSubmit={handleResetPassword}>
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700">كود التحقق</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 group-focus-within:text-orange-500">
                                                <CheckCircle2 size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                maxLength="6"
                                                placeholder="000000"
                                                className="block w-full pr-11 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-right"
                                                value={resetData.code}
                                                onChange={(e) => setResetData({...resetData, code: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700">كلمة المرور الجديدة</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 group-focus-within:text-orange-500">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="block w-full pr-11 pl-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-right"
                                                value={resetData.newPassword}
                                                onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
                                                required
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 hover:text-orange-600"
                                            >
                                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : "تغيير كلمة المرور"}
                                    </button>
                                </form>
                                
                                <button 
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-gray-500 hover:text-orange-600 text-sm w-full text-center"
                                >
                                    لم يصلك الكود؟ إعادة إرسال
                                </button>
                            </div>
                        ) : (
                            /* واجهة طلب الكود الأصلية */
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <p className="text-center text-gray-500 text-sm leading-relaxed">
                                    أدخل بريدك الإلكتروني وسنرسل لك كود التحقق لإعادة تعيين كلمة مرورك.
                                </p>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 block mr-1">البريد الإلكتروني</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 group-focus-within:text-orange-500">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="name@example.com"
                                            className="block w-full pr-11 pl-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-right"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                        <>
                                            <span>إرسال كود التحقق</span>
                                            <SendHorizontal size={18} className="rotate-180" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;