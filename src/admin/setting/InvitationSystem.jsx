import React, { useState, useEffect } from 'react';

function InvitationSystem() {
  const [systemPoints, setSystemPoints] = useState(0);
  const [isEditingPoints, setIsEditingPoints] = useState(false);
  const [inputPoints, setInputPoints] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // 1. جلب نقاط النظام
      const resPoints = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/invitation-system/points`);
      const dataPoints = await resPoints.json();
      if (dataPoints.success) {
        setSystemPoints(dataPoints.data?.points || 0);
      }
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
    } finally {
      setLoading(false);
    }
  };

  // تحديث نقاط النظام
  const handleSavePoints = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/invitation-system/points`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: parseInt(inputPoints) })
      });
      const result = await response.json();
      if (result.success) {
        setSystemPoints(inputPoints);
        setIsEditingPoints(false);
        showNotification('تم تحديث نقاط نظام الدعوات بنجاح', 'success');
      }
    } catch (error) {
      showNotification('حدث خطأ أثناء التحديث', 'error');
    }
  };

  const showNotification = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  // دالة نسخ الرابط إلى الحافظة
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    showNotification('تم نسخ رابط الدعوة إلى الحافظة', 'success');
  };

  if (loading) return <div className="p-10 text-center text-gray-500 animate-pulse" dir="rtl">جاري تحميل إعدادات وبيانات النظام...</div>;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto bg-gray-50  text-gray-800" dir="rtl">
      
      {/* الإشعارات */}
      {message.text && (
        <div className={`fixed top-5 left-5 z-50 p-4 rounded-xl shadow-lg border text-sm transition-all ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* الرأس */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">نظام النقاط </h2>
        <p className="text-gray-500 text-sm mt-1">إدارة تسعيرة النقاط مقابل الجنية</p>
      </div>

      {/* قسم التحكم بالنقاط العامة للنظام */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/80 mb-8 max-w-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-700 text-sm">عدد النقاط المكافأة لقية واحد جنية</h3>
          </div>
          <div className="text-left">
            {isEditingPoints ? (
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  value={inputPoints}
                  onChange={(e) => setInputPoints(e.target.value)}
                  className="w-24 px-3 py-1.5 border border-blue-500 rounded-xl font-bold text-center text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <button onClick={handleSavePoints} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-xl transition-colors">حفظ</button>
                <button onClick={() => setIsEditingPoints(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs px-3 py-2 rounded-xl">إلغاء</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-amber-500">⭐ {systemPoints} <span className="text-xs font-medium text-gray-400">نقطة</span></span>
                <button 
                  onClick={() => { setIsEditingPoints(true); setInputPoints(systemPoints); }}
                  className="text-xs text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100 font-medium transition-colors"
                >
                  تعديل القيمة
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvitationSystem;