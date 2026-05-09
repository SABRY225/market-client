import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, AlertCircle, XCircle } from 'lucide-react';
import loginDelivery from '../lib/delivery/login';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null); // حالة الخطأ
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // إعادة تعيين الخطأ عند محاولة تسجيل دخول جديدة
        setIsLoading(true);

        try {
            const data = await loginDelivery({ email });
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', "delivery");
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // نجاح العملية
            navigate('/delivery');
        }
        catch (err) {
            setIsLoading(false);
            // تعيين نص الخطأ بشكل جمالي
            setError("عذراً كابتن، هذا البريد غير مسجل في نظامنا.");
        }
    };

    return (
        <div className="w-full">
            {/* نافذة الخطأ بتصميم عصري */}
            {error && (
                <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3">
                        <div className="bg-red-500/10 p-2 rounded-xl text-red-600">
                            <AlertCircle size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-red-800 tracking-tight">خطأ في الوصول</p>
                            <p className="text-[11px] text-red-600/80 font-medium">{error}</p>
                        </div>
                        <button 
                            onClick={() => setError(null)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                        >
                            <XCircle size={18} />
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 w-full">
                <div className="relative group">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 block mr-1 text-right">
                        البريد الإلكتروني للكابتن
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-yellow-500 transition-colors">
                            <Mail size={20} />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if(error) setError(null); // إخفاء الخطأ فور البدء في الكتابة
                            }}
                            placeholder="name@delivery.com"
                            dir="ltr"
                            className={`w-full bg-zinc-50 border-2 text-zinc-900 text-sm rounded-2xl block w-full pr-12 p-4 focus:outline-none focus:bg-white transition-all placeholder:text-zinc-300 font-medium ${
                                error ? 'border-red-200 focus:border-red-400' : 'border-zinc-100 focus:border-yellow-400'
                            }`}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-zinc-200"
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            <span>دخول للمنصة</span>
                            <ArrowRight size={18} className="group-hover:translate-x-[-4px] transition-transform" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;