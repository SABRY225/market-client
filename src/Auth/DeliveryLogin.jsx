import React from 'react';
import LoginForm from './LoginForm';
import { Bike, Navigation, MapPin, Gauge, ShieldCheck, Timer } from 'lucide-react';

const DeliveryLogin = () => {
    const bgImage = 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?auto=format&fit=crop&q=80&w=1415';
    
    return (
        <div className="h-screen w-full bg-white overflow-hidden font-sans selection:bg-yellow-100">
            <div className="flex h-full w-full">
                
                {/* الجانب الأيسر: المرئيات (مخفي في الموبايل) */}
                <div className="hidden lg:flex lg:w-[55%] h-full relative overflow-hidden items-center justify-center bg-zinc-950">
                    <div className="absolute inset-0 h-full">
                        <img 
                            src={bgImage} 
                            alt="Delivery Motion" 
                            className="absolute inset-0 w-full h-full object-cover opacity-40 scale-110 animate-city-flow"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900/90 to-transparent"></div>
                    </div>

                    <div className="relative z-10 p-12 xl:p-24 w-full max-w-3xl">
                        <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 bg-yellow-400 rounded-2xl shadow-xl shadow-yellow-500/20">
                            <Bike size={24} className="text-zinc-900" />
                            <span className="text-zinc-900 font-black tracking-tighter text-lg italic">GO<span className="opacity-70">DELIVERY</span></span>
                        </div>
                        
                        <h1 className="text-5xl xl:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter uppercase">
                            الطريق لك <br /> 
                            <span className="text-yellow-400 italic">والربح بيدك.</span>
                        </h1>
                        
                        <p className="text-zinc-400 text-lg mb-10 leading-relaxed max-w-xl font-medium">
                            انطلق الآن، تتبع خرائطك، وحقق أقصى استفادة من رحلاتك اليومية في منصتنا المتطورة.
                        </p>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="p-6 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 group hover:bg-white/10 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-yellow-400 rounded-2xl text-zinc-900">
                                        <Gauge size={22} />
                                    </div>
                                    <Navigation size={18} className="text-yellow-400 animate-pulse" />
                                </div>
                                <div className="text-3xl font-black text-white tracking-tighter">15-20</div>
                                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">طلب متوقع بالساعة</div>
                            </div>

                            <div className="p-6 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 group hover:bg-white/10 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-zinc-800 rounded-2xl text-yellow-400">
                                        <Timer size={22} />
                                    </div>
                                    <MapPin size={18} className="text-zinc-500" />
                                </div>
                                <div className="text-3xl font-black text-white tracking-tighter">فوري</div>
                                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">تحصيل الأرباح</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* الجانب الأيمن: نموذج تسجيل الدخول */}
                <div className="w-full lg:w-[45%] h-full flex flex-col items-center justify-center p-6 md:p-12 bg-white relative">
                    
                    <div className="w-full max-w-[400px]">
                        {/* شعار الموبايل فقط */}
                        <div className="lg:hidden flex flex-col items-center mb-12">
                            <div className="w-16 h-16 bg-yellow-400 rounded-3xl flex items-center justify-center text-zinc-900 shadow-lg mb-4 -rotate-6">
                                <Bike size={32} />
                            </div>
                            <h2 className="text-xl font-black text-zinc-900 italic uppercase">Go Delivery</h2>
                        </div>

                        <div className="mb-10 text-right">
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-[10px] font-black uppercase tracking-widest mb-4 border border-yellow-100">
                                Captain's Portal • بوابة الكابتن
                             </div>
                             <h2 className="text-4xl font-black text-zinc-900 mb-2 italic">جاهز للتحرّك؟ 🏍️</h2>
                             <p className="text-zinc-500 font-medium text-sm">سجل دخولك لبدء استقبال الطلبات القريبة منك.</p>
                        </div>

                        {/* استدعاء المكون الجديد هنا */}
                        <LoginForm />

                        <div className="mt-10">
                            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center gap-4">
                                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-yellow-400 shrink-0">
                                    <ShieldCheck size={20} />
                                </div>
                                <p className="text-[11px] text-zinc-500 leading-tight">
                                    تأكد دائماً من تفعيل <strong>GPS</strong> وتحديث بيانات <strong>التأمين</strong> الخاصة بمركبتك.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* عنصر جمالي خلفي */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl -z-10"></div>
                </div>

            </div>

            <style jsx>{`
                @keyframes city-flow {
                    0% { transform: scale(1.1) translateX(0); }
                    100% { transform: scale(1.2) translateX(-20px); }
                }
                .animate-city-flow {
                    animation: city-flow 20s infinite alternate ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default DeliveryLogin;