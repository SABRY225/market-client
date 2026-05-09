import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import { UtensilsCrossed, Clock, ChefHat, Star, ArrowUpRight, Mail, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const RestaurantLogin = () => {
    const bgImage = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1548';
      const { t, i18n } = useTranslation();
      const isArabic = i18n.language === 'ar';
      const navigate = useNavigate();
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
    
      const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/vendor/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
          const data = await res.json();
          
          if (!res.ok) throw new Error(data.message || 'Login failed');
          
          const sendRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/vendor/send-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: data.token }),
          });
          const sendData = await sendRes.json();
          if (!sendRes.ok) throw new Error(sendData.message || 'Failed to send code');
          
          navigate('/saller/verify', { state: { email , token: data.token } });
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
    return (
        // تم استخدام h-screen لضمان أن الحاوية الأم تأخذ طول الشاشة بالكامل
        <div className="h-screen w-full bg-white overflow-hidden font-sans selection:bg-orange-100 selection:text-orange-700">
            
            <div className="flex h-full w-full">
                
                {/* الجانب الأيسر: عالم الطهي - يغطي h-full */}
                <div className="hidden lg:flex lg:w-[60%] h-full relative overflow-hidden items-center justify-center bg-zinc-950">
                    
                    {/* خلفية الصورة */}
                    <div className="absolute inset-0 h-full">
                        <img 
                            src={bgImage} 
                            alt="Professional Kitchen" 
                            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 animate-slow-pan"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900/90 to-orange-900/30"></div>
                    </div>

                    <div className="relative z-10 p-12 xl:p-24 w-full max-w-3xl">
                        <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10">
                            <ChefHat size={24} className="text-orange-400" />
                            <span className="text-white font-black tracking-tighter text-lg">Chef<span className="text-orange-500">Panel</span></span>
                        </div>
                        
                        <h1 className="text-5xl xl:text-6xl font-black text-white mb-6 leading-tight tracking-tighter">
                            وصّل نكهاتك <br /> 
                            <span className="text-orange-500 italic">لآلاف الطاولات.</span>
                        </h1>
                        
                        <p className="text-zinc-300 text-lg mb-10 leading-relaxed max-w-xl font-medium">
                            أدوات متكاملة لإدارة قائمة طعامك، استقبال الطلبات، وتتبع الأداء في <span className="text-white border-b-2 border-orange-500">وقت قياسي</span>.
                        </p>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="p-6 bg-zinc-900/50 backdrop-blur-md rounded-[2.5rem] border border-white/5 group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-orange-500 rounded-2xl text-white shadow-lg">
                                        <Clock size={22} />
                                    </div>
                                    <ArrowUpRight size={18} className="text-zinc-600 group-hover:text-orange-500" />
                                </div>
                                <div className="text-3xl font-black text-white">18 دقيقة</div>
                                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">وقت التحضير</div>
                            </div>

                            <div className="p-6 bg-zinc-900/50 backdrop-blur-md rounded-[2.5rem] border border-white/5 group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-lg">
                                        <Star size={22} />
                                    </div>
                                    <span className="text-zinc-600 group-hover:text-amber-500 text-xs font-bold italic">Top Rated</span>
                                </div>
                                <div className="text-3xl font-black text-white">4.9/5.0</div>
                                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">تقييم العملاء</div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-8 left-12 flex items-center gap-3 py-2 px-4 bg-black/40 rounded-full backdrop-blur-md border border-white/5">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">نظام الطلبات المباشر نشط</span>
                    </div>
                </div>

                {/* الجانب الأيمن: تسجيل الدخول - يغطي h-full مع سكرول داخلي فقط إذا لزم الأمر */}
                <div className="w-full lg:w-[40%] h-full flex flex-col items-center justify-center p-8 bg-white relative overflow-y-auto">
                    
                    <div className="w-full max-w-[400px] py-10">
                        {/* شعار الجوال */}
                        <div className="lg:hidden flex flex-col items-center mb-10">
                            <div className="w-16 h-16 bg-orange-500 rounded-[1.8rem] flex items-center justify-center text-white shadow-2xl mb-4 rotate-3">
                                <UtensilsCrossed size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-zinc-900 italic tracking-tighter">ChefPanel</h2>
                        </div>

                        <div className="mb-8 text-center lg:text-right">
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-4">
                                بوابة الشركاء المعتمدين
                             </div>
                             <h2 className="text-3xl font-black text-zinc-900 mb-2">أهلاً يا شيف! 👋</h2>
                             <p className="text-zinc-500 font-medium">سجل دخولك لمتابعة مطبخك وطلباتك.</p>
                        </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 text-red-700 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0" />
              <span className="font-bold">{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">
                {isArabic ? 'هوية المسؤول' : 'Admin Identity'}
              </label>
              <div className="relative group">
                <div className={`absolute inset-y-0 ${isArabic ? 'right-0 pr-4' : 'left-0 pl-4'} flex items-center pointer-events-none text-zinc-400 group-focus-within:text-orange-600 transition-colors`}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full py-4 ${isArabic ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4'} bg-zinc-50 border-2 border-zinc-100 rounded-2xl focus:outline-none focus:ring-0 focus:border-orange-600 focus:bg-white transition-all font-medium`}
                  placeholder="admin@enterprise.com"
                />
              </div>
            </div>

            <button 
              disabled={loading} 
              className="w-full relative flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-zinc-950 text-white font-black hover:bg-orange-600 transition-all duration-300 shadow-xl shadow-zinc-200 hover:shadow-orange-200 disabled:opacity-70 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="tracking-widest uppercase text-sm">{isArabic ? 'تخطي الجدار الناري' : 'Authorize Access'}</span>
                  <ShieldCheck size={20} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </button>
          </form>

                    </div>
                </div>

            </div>

            <style jsx>{`
                @keyframes slow-pan {
                    0% { transform: scale(1); translateX(0); }
                    100% { transform: scale(1.1); translateX(-10px); }
                }
                .animate-slow-pan {
                    animation: slow-pan 20s infinite alternate ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default RestaurantLogin;