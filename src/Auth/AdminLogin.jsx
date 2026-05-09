import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Loader2, ShieldCheck, AlertCircle, Cpu, Fingerprint, Globe } from 'lucide-react';

export default function AdminLogin() {
  const { t, i18n } = useTranslation();
  console.log(i18n.language);
  
  const isArabic = i18n.language == 'ar';
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || (isArabic ? 'فشل تسجيل الدخول' : 'Login failed'));
      
      const sendRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: data.token }),
      });
      const sendData = await sendRes.json();
      if (!sendRes.ok) throw new Error(sendData.message || (isArabic ? 'فشل إرسال رمز التحقق' : 'Failed to send code'));
      
      navigate('/admin/verify', { state: { email , token: data.token } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`h-screen w-full flex overflow-hidden bg-white font-sans selection:bg-orange-100 ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* الجانب الأيسر: واجهة التحكم والبيانات (يظهر فقط في الشاشات الكبيرة) */}
      <div className="hidden lg:flex lg:w-3/5 h-full relative overflow-hidden items-center justify-center bg-zinc-950">
        {/* تأثير الـ Mesh Gradient للجانب التقني */}
        <div className="absolute inset-0 opacity-40">
            <div className={`absolute top-[-10%] ${isArabic ? 'right-[-10%]' : 'left-[-10%]'} w-[70%] h-[70%] bg-orange-600/20 blur-[120px] rounded-full animate-pulse`}></div>
            <div className={`absolute bottom-[-10%] ${isArabic ? 'left-[-10%]' : 'right-[-10%]'} w-[60%] h-[60%] bg-zinc-800 blur-[100px] rounded-full`}></div>
        </div>

        {/* خطوط الشبكة التقنية (Grid Pattern) */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

        <div className="relative z-10 p-20 w-full max-w-2xl">
            <div className="mb-12 inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                <Cpu size={22} className="text-orange-500 animate-spin-slow" />
                <span className="text-white font-bold tracking-widest text-sm uppercase">{isArabic ? 'النظام الرئيسي v2.0' : 'Mainframe v2.0'}</span>
            </div>
            
            <h1 className="text-6xl font-black text-white mb-8 leading-tight tracking-tighter">
                {isArabic ? 'قوة التحكم في' : 'Total Control at'} <br /> 
                <span className="text-orange-600 underline decoration-zinc-700 underline-offset-8">
                   {isArabic ? 'قبضة يدك.' : 'Your Fingertips.'}
                </span>
            </h1>
            
            <p className="text-zinc-400 text-xl mb-12 leading-relaxed font-light">
                {isArabic 
                    ? 'مرحباً بك في مركز العمليات الرئيسي. قم بإدارة الخوادم، تتبع الإحصائيات، واتخذ القرارات الاستراتيجية.' 
                    : 'Welcome to the HQ. Manage servers, track global metrics, and make strategic decisions from one place.'}
            </p>

            {/* بطاقات حالة النظام الـ Admin */}
            <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/5 flex items-center gap-5 group hover:border-orange-500/50 transition-all cursor-default">
                    <div className="w-12 h-12 bg-orange-600/20 rounded-2xl flex items-center justify-center text-orange-500">
                        <Fingerprint size={24} />
                    </div>
                    <div>
                        <div className="text-white font-bold tracking-tight">{isArabic ? 'البصمة الحيوية' : 'Biometric'}</div>
                        <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">{isArabic ? 'مستوى الأمان 4' : 'Security Level 4'}</div>
                    </div>
                </div>
                <div className="p-6 bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/5 flex items-center gap-5 group hover:border-orange-500/50 transition-all cursor-default">
                    <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400">
                        <Globe size={24} />
                    </div>
                    <div>
                        <div className="text-white font-bold tracking-tight">{isArabic ? 'النطاق العالمي' : 'Global Node'}</div>
                        <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">{isArabic ? 'نشط ومشفر' : 'Active & Encrypted'}</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer الجانب الأيسر */}
        <div className={`absolute bottom-12 ${isArabic ? 'right-20' : 'left-20'} flex items-center gap-6 text-zinc-600 text-[10px] font-black tracking-[0.2em] uppercase`}>
            <span>{isArabic ? 'الخادم: HK-01' : 'Server: HK-01'}</span>
            <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
            <span>{isArabic ? 'الحالة: يعمل كالمعتاد' : 'Status: Operational'}</span>
        </div>
      </div>

      {/* الجانب الأيمن: نموذج الدخول */}
      <div className="w-full lg:w-2/5 h-full flex flex-col items-center justify-center p-8 bg-white relative">
        
        <div className="w-full max-w-[420px] relative z-10">
          {/* Header Section */}
          <div className={`mb-12 text-center ${isArabic ? 'lg:text-right' : 'lg:text-left'}`}>
            <div className="lg:hidden flex justify-center mb-10">
                <div className="w-16 h-16 bg-zinc-950 text-orange-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <ShieldCheck size={32} />
                </div>
            </div>
            
            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-orange-50 text-orange-600 text-[11px] font-black uppercase tracking-widest mb-5">
              {isArabic ? 'مصادقة المسؤول' : 'Admin Authentication'}
            </span>
            <h2 className="text-4xl font-black text-zinc-900 mb-3 tracking-tighter leading-none">
              {isArabic ? 'سجل دخولك' : 'Secure Sign-In'}
            </h2>
            <p className="text-zinc-500 font-medium">
              {isArabic ? 'أدخل بيانات الاعتماد الخاصة بك للوصول إلى المناطق المحمية.' : 'Enter your credentials to access protected zones.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mb-6 p-4 bg-red-50 border-s-4 border-red-500 text-red-700 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2`}>
              <AlertCircle size={18} className="shrink-0" />
              <span className="font-bold">{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">
                {isArabic ? 'هوية المسؤول (البريد الإلكتروني)' : 'Admin Identity (Email)'}
              </label>
              <div className="relative group">
                <div className={`absolute inset-y-0 ${isArabic ? 'left-0 pl-4' : 'left-0 pl-4'} flex items-center pointer-events-none text-zinc-400 group-focus-within:text-orange-600 transition-colors`}>
                  {/* تم تعديل مكان الأيقونة تلقائياً بواسطة dir=rtl */}
                  <Mail size={18} className={isArabic ? 'mr-4' : 'ml-0'} />
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

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-zinc-50 text-center">
            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.3em]">
                {isArabic ? 'اتصال الجهاز: آمن' : 'Terminal Connection: Secured'}
            </p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .animate-spin-slow {
            animation: spin 8s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}