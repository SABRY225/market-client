import React from 'react';
import LoginForm from '../components/LoginForm';
import { Headphones, MessageSquare, ShieldCheck, Zap, HeartHandshake, CheckCircle2 } from 'lucide-react';

const SupportLogin = () => {
    // صورة تعبيرية لمركز خدمة عملاء حديث أو تكنولوجيا تواصل
    const bgImage = 'https://images.unsplash.com/photo-1521791136364-798a7bc0d26e?auto=format&fit=crop&q=80&w=1471';
    
    return (
        // h-screen تضمن أن الارتفاع يغطي الشاشة بالكامل
        <div className="h-screen w-full bg-slate-50 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-700">
            
            <div className="flex h-full w-full">
                
                {/* الجانب الأيسر: الهوية البصرية للدعم (60% من العرض) */}
                <div className="hidden lg:flex lg:w-[60%] h-full relative overflow-hidden items-center justify-center bg-indigo-950">
                    
                    {/* خلفية الصورة مع تراكب لوني بارد مريح للعين */}
                    <div className="absolute inset-0 h-full">
                        <img 
                            src={bgImage} 
                            alt="Support Team" 
                            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity scale-110 animate-subtle-move"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-indigo-900/90 to-sky-900/40"></div>
                    </div>

                    <div className="relative z-10 p-12 xl:p-24 w-full max-w-3xl">
                        {/* شعار بوابة الدعم */}
                        <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10">
                            <Headphones size={24} className="text-sky-400" />
                            <span className="text-white font-black tracking-tight text-lg">Support<span className="text-sky-400">Core</span></span>
                        </div>
                        
                        <h1 className="text-5xl xl:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
                            ساعدهم على <br /> 
                            <span className="text-sky-400 italic">النجاح اليوم.</span>
                        </h1>
                        
                        <p className="text-indigo-100 text-lg mb-10 leading-relaxed max-w-xl font-light">
                            بوابتك لإدارة المحادثات، حل المشكلات الفنية، ورفع مستوى <span className="text-white font-bold border-b-2 border-sky-500 pb-1">رضا العملاء</span> في منصتنا.
                        </p>

                        {/* إحصائيات قسم الدعم الفني */}
                        <div className="grid grid-cols-2 gap-5">
                            <div className="p-6 bg-white/[0.03] backdrop-blur-xl rounded-[2rem] border border-white/10 group hover:bg-white/[0.08] transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-sky-500 rounded-2xl text-white shadow-lg shadow-sky-500/30">
                                        <Zap size={22} />
                                    </div>
                                    <CheckCircle2 size={18} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="text-3xl font-black text-white tracking-tighter">&lt; 2 دقيقة</div>
                                <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mt-1">متوسط وقت الاستجابة</div>
                            </div>

                            <div className="p-6 bg-white/[0.03] backdrop-blur-xl rounded-[2rem] border border-white/10 group hover:bg-white/[0.08] transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-indigo-500 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
                                        <HeartHandshake size={22} />
                                    </div>
                                    <MessageSquare size={18} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="text-3xl font-black text-white tracking-tighter">98%</div>
                                <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mt-1">نسبة سعادة المستخدمين</div>
                            </div>
                        </div>
                    </div>

                    {/* علامة الحماية في الأسفل */}
                    <div className="absolute bottom-8 left-12 flex items-center gap-3 py-2 px-4 bg-white/5 rounded-full backdrop-blur-md border border-white/10">
                        <ShieldCheck size={16} className="text-emerald-400" />
                        <span className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">نظام تشفير المحادثات مفعل</span>
                    </div>
                </div>

                {/* الجانب الأيمن: نموذج تسجيل الدخول (40% من العرض) */}
                <div className="w-full lg:w-[40%] h-full flex flex-col items-center justify-center p-8 bg-white relative overflow-y-auto">
                    
                    <div className="w-full max-w-[400px] py-10 relative z-10">
                        
                        {/* شعار الجوال */}
                        <div className="lg:hidden flex flex-col items-center mb-10">
                            <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl mb-4 rotate-3">
                                <Headphones size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-indigo-900 tracking-tighter uppercase">SupportCore</h2>
                        </div>

                        <div className="mb-10 text-center lg:text-right">
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
                                Agent Portal • Secure Login
                             </div>
                             <h2 className="text-3xl font-black text-slate-900 mb-2">أهلاً بك مجدداً 👋</h2>
                             <p className="text-slate-500 font-medium">سجل دخولك للبدء في مساعدة المستخدمين.</p>
                        </div>

                        <LoginForm
                            title="" 
                            description=""
                            colorClass="indigo" // لون احترافي للدعم
                            backgroundImage={null} 
                            animationClass="" 
                        />

                        <div className="mt-12 space-y-4 text-center">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-xs text-slate-500 mb-1 leading-relaxed">
                                    هل تواجه مشكلة في الوصول؟ <br />
                                    تواصل مع <strong>مدير النظام</strong> للحصول على مساعدة.
                                </p>
                            </div>
    
                        </div>
                    </div>

                    {/* زخرفة هندسية خفيفة في زاوية الشاشة */}
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                        <MessageSquare size={200} className="text-indigo-900" />
                    </div>
                </div>

            </div>

            <style jsx>{`
                @keyframes subtle-move {
                    0% { transform: scale(1.1) translate(0, 0); }
                    100% { transform: scale(1.2) translate(-10px, -10px); }
                }
                .animate-subtle-move {
                    animation: subtle-move 25s infinite alternate ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default SupportLogin;