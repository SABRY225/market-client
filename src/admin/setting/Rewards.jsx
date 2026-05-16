import React, { useState, useEffect } from 'react';

function Rewards() {
  // حالات التخزين (States)
  const [rewards, setRewards] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [editingId, setEditingId] = useState(null); 
  const [newPoints, setNewPoints] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');

  // 1. جلب البيانات من السيرفر عند تحميل الصفحة
  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/rewards`);
      const result = await response.json();
      if (result.success) {
        setRewards(result.data);
      }
    } catch (error) {
      console.error('خطأ في جلب المكافآت:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. دالة إرسال التعديل للنقاط فقط إلى السيرفر
  const handleUpdatePoints = async (id) => {
    if (!newPoints || isNaN(newPoints) || newPoints < 0) {
      setErrorMessage('برجاء إدخال عدد نقاط صحيح وموجب');
      return;
    }
    setErrorMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/rewards/${id}/points`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ points_required: parseInt(newPoints) }),
      });

      const result = await response.json();

      if (result.success) {
        // تحديث البيانات في الواجهة مباشرة دون إعادة تحميل الصفحة بالكامل
        setRewards(rewards.map(item => item.id === id ? { ...item, points_required: parseInt(newPoints) } : item));
        setEditingId(null); 
        setNewPoints(''); 
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error('خطأ في التعديل:', error);
      setErrorMessage('حدث خطأ أثناء الاتصال بالسيرفر');
    }
  };

  // واجهة التحميل الاحترافية (Skeleton Loader)
  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-4" dir="rtl">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse mb-8"></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-5 border-b border-gray-100 flex justify-between items-center animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/12"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen bg-gray-50 text-gray-800" dir="rtl">
      {/* الهيدر والعناوين */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          لوحة تحكم المكافآت <span className="text-sm font-medium bg-blue-50 text-blue-600 py-1 px-2.5 rounded-full border border-blue-100 mr-2">الأدمن</span>
        </h2>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          يمكنك استعراض المكافآت الحالية في النظام وتعديل النقاط المطلوبة لكل منها بشكل فوري.
        </p>
      </div>

      {/* رسالة الخطأ إن وجدت */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 rounded-l-lg text-red-700 text-sm flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="text-red-400 hover:text-red-600 font-bold">✕</button>
        </div>
      )}

      {/* حاوية الجدول المصممة باحترافية */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm font-semibold">
                <th className="p-4 w-16 text-center">ID</th>
                <th className="p-4">المفتاح (Key)</th>
                <th className="p-4">عنوان المكافأة</th>
                <th className="p-4">النقاط المطلوبة</th>
                <th className="p-4 text-center w-48">التحكم بالأدوات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {rewards.map((reward) => (
                <tr key={reward.id} className="hover:bg-gray-50/70 transition-colors duration-200">
                  {/* رقم المعرف */}
                  <td className="p-4 text-center font-medium text-gray-400">
                    #{reward.id}
                  </td>
                  
                  {/* المفتاح الكودي */}
                  <td className="p-4">
                    <span className="font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs border border-gray-200">
                      {reward.key}
                    </span>
                  </td>
                  
                  {/* العنوان */}
                  <td className="p-4 font-semibold text-gray-900">
                    {reward.title}
                  </td>
                  
                  {/* حقل النقاط والتعديل المباشر */}
                  <td className="p-4">
                    {editingId === reward.id ? (
                      <div className="flex items-center gap-2 max-w-[150px]">
                        <input
                          type="number"
                          value={newPoints}
                          onChange={(e) => setNewPoints(e.target.value)}
                          className="w-full px-3 py-1.5 text-sm bg-white border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 text-center font-bold text-blue-600"
                          placeholder={reward.points_required}
                          autoFocus
                        />
                        <span className="text-xs text-gray-400 whitespace-nowrap">نقطة</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center justify-center bg-amber-50 text-amber-700 font-bold px-3 py-1 rounded-full text-xs border border-amber-200">
                          ⭐ {reward.points_required} نقطة
                        </span>
                      </div>
                    )}
                  </td>
                  
                  {/* أزرار التحكم والعمليات */}
                  <td className="p-4 text-center">
                    {editingId === reward.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleUpdatePoints(reward.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors shadow-sm shadow-emerald-100"
                        >
                          حفظ
                        </button>
                        <button 
                          onClick={() => { setEditingId(null); setNewPoints(''); setErrorMessage(''); }}
                          className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded-lg transition-colors"
                        >
                          إلغاء
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => { setEditingId(reward.id); setNewPoints(reward.points_required); }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 text-xs font-semibold rounded-lg border border-gray-200 hover:border-blue-200 transition-all duration-200 shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        تعديل النقاط
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* في حال كانت المصفوفة فارغة */}
        {rewards.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            لا توجد مكافآت مضافة في النظام حالياً.
          </div>
        )}
      </div>
    </div>
  );
}

export default Rewards;