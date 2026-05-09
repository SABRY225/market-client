import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader2, ShieldCheck, RefreshCcw, ArrowLeft } from 'lucide-react';

export default function VendorVerify() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const navigate = useNavigate();
  const location = useLocation();
  
  const token = location.state?.token;
  const email = location.state?.email;

  const [code, setCode] = useState(['', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [timer, setTimer] = useState(30); // مؤقت لإعادة الإرسال
  const inputsRef = useRef([]);

  // مؤقت العد التنازلي
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (!token) navigate('/saller/login');
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const codeStr = code.join('');
    if (codeStr.length < 5) {
      setError(isArabic ? 'يرجى إدخال الرمز كاملاً' : 'Please enter the full code');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/vendor/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, code: codeStr })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', "saller");

      navigate('/saller');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setError('');
    setInfo('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      if (!res.ok) throw new Error('Failed to resend');
      setInfo(isArabic ? 'تم إرسال رمز جديد بنجاح' : 'New code sent successfully');
      setTimer(60); // إعادة تعيين المؤقت لدقيقة
    } catch (err) {
      setError(err.message);
    }
  };

  const onChangeDigit = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[idx] = val;
    setCode(next);
    if (val && idx < 4) inputsRef.current[idx + 1]?.focus();
  };

  const onKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      inputsRef.current[idx - 1].focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 font-sans">
      <div className="w-full max-w-md">
        {/* زر الرجوع */}
        <button 
          onClick={() => navigate('/saller/login')}
          className="flex items-center text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6 group"
        >
          <ArrowLeft className={`w-4 h-4 ${isArabic ? 'rotate-180 ml-2' : 'mr-2'} group-hover:-translate-x-1 transition-transform`} />
          {isArabic ? 'العودة لتسجيل الدخول' : 'Back to login'}
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-gray-100 p-8 md:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isArabic ? 'رمز التحقق' : 'Verification Code'}
            </h1>
            <p className="text-center text-gray-500 text-sm leading-relaxed">
              {isArabic ? 'أدخل الرمز المكون من 5 أرقام المرسل إلى' : 'Enter the 5-digit code sent to'} <br/>
              <span className="font-semibold text-gray-700">{email || 'your email'}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between gap-2 md:gap-4" dir="ltr">
              {code.map((d, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  value={d}
                  onChange={(e) => onChangeDigit(idx, e.target.value)}
                  onKeyDown={(e) => onKeyDown(e, idx)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-full h-14 md:h-16 text-center text-2xl font-bold rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-blue-600"
                />
              ))}
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center animate-shake">
                {error}
              </div>
            )}
            
            {info && (
              <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg text-center">
                {info}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isArabic ? 'تحقق الآن' : 'Verify Now')}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-gray-500 text-sm mb-3">
              {isArabic ? 'لم يصلك الرمز؟' : "Didn't receive the code?"}
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={timer > 0}
              className={`flex items-center justify-center gap-2 mx-auto font-semibold text-sm transition-colors ${
                timer > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {timer > 0 
                ? (isArabic ? `إعادة الإرسال خلال ${timer} ثانية` : `Resend in ${timer}s`)
                : (isArabic ? 'إعادة إرسال الرمز' : 'Resend Code')
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}