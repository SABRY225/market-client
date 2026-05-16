import React, { useState, useEffect } from 'react';

function DeliverySystem() {
  // حالات التخزين (States)
  const [systemSettings, setSystemSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('price'); // 'price' or 'distance'
  
  // قيم حقول الإدخال للتعديل
  const [costperOrder, setCostperOrder] = useState('');
  const [costperKilometer, setCostperKilometer] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ text: '', type: '' });

  // 1. جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    fetchDeliverSettings();
  }, []);

  const fetchDeliverSettings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/deliver-system`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setSystemSettings(result.data);
        setActiveType(result.data.type);
        setCostperOrder(result.data.CostperOrder || 0);
        setCostperKilometer(result.data.Costperkilometer || 0);
      }
    } catch (error) {
      console.error('خطأ في جلب بيانات نظام التوصيل:', error);
      showNotification('حدث خطأ أثناء جلب البيانات من السيرفر', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 2. دالة حفظ وتحديث البيانات
  const handleUpdateSettings = async (typeToSend) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/deliver-system`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: typeToSend,
          CostperOrder: parseInt(costperOrder) || 0,
          Costperkilometer: parseInt(costperKilometer) || 0,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSystemSettings(result.data);
        showNotification('تم تحديث إعدادات نظام التوصيل بنجاح ✨', 'success');
      } else {
        showNotification(result.message, 'error');
      }
    } catch (error) {
      console.error('خطأ في التحديث:', error);
      showNotification('فشل الاتصال بالسيرفر لتحديث البيانات', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showNotification = (text, type) => {
    setNotification({ text, type });
    setTimeout(() => setNotification({ text: '', type: '' }), 4000);
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6" dir="rtl">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
          <div className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto min-h-screen bg-gray-50 text-gray-800" dir="rtl">
      
      {/* التنبيهات المنبثقة */}
      {notification.text && (
        <div className={`fixed top-6 left-6 z-50 p-4 rounded-xl shadow-xl border text-sm font-semibold transition-all duration-300 ${
          notification.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {notification.text}
        </div>
      )}

      {/* الهيدر */}
      <div className="mb-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          إعدادات نظام التوصيل <span className="text-xs font-bold bg-indigo-50 text-indigo-600 py-1 px-3 rounded-full border border-indigo-100 mr-2">لوحة الإدارة</span>
        </h2>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          قم بتحديد وتعديل استراتيجية حساب أسعار الشحن والتوصيل للطلبات داخل التطبيق.
        </p>
      </div>

      {/* كروت اختيار وتفعيل نوع النظام */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* كارت السعر الثابت للطلب */}
        <div 
          onClick={() => { setActiveType('price'); handleUpdateSettings('price'); }}
          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden ${
            activeType === 'price' 
              ? 'bg-white border-indigo-600 shadow-md shadow-indigo-50' 
              : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
          }`}
        >
          {activeType === 'price' && (
            <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl">
              نشط حالياً
            </span>
          )}
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${activeType === 'price' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">سعر ثابت للطلب</h3>
              <p className="text-xs text-gray-400 mt-1">يتم احتساب تكلفة شحن موحدة لكل طلب بغض النظر عن المسافة.</p>
            </div>
          </div>
        </div>

        {/* كارت السعر بناء على الكيلومترات */}
        <div 
          onClick={() => { setActiveType('distance'); handleUpdateSettings('distance'); }}
          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden ${
            activeType === 'distance' 
              ? 'bg-white border-indigo-600 shadow-md shadow-indigo-50' 
              : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
          }`}
        >
          {activeType === 'distance' && (
            <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl">
              نشط حالياً
            </span>
          )}
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${activeType === 'distance' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">حسب المسافة بالكيلومتر</h3>
              <p className="text-xs text-gray-400 mt-1">تتغير تكلفة التوصيل ديناميكياً حسب مسافة العميل عن المتجر.</p>
            </div>
          </div>
        </div>

      </div>

      {/* قسم تعديل القيم والأرقام */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/80 max-w-xl">
        <h3 className="font-bold text-gray-900 text-base mb-4">تعديل قيم التسعير للخدمة</h3>
        
        <div className="space-y-5">
          {/* حقل السعر الثابت */}
          <div className={`transition-opacity duration-300 ${activeType === 'price' ? 'opacity-100' : 'opacity-40'}`}>
            <label className="block text-xs font-bold text-gray-500 mb-2">تكلفة التوصيل الثابتة للطلب الواحد:</label>
            <div className="flex items-center gap-2 max-w-xs">
              <input 
                type="number"
                value={costperOrder}
                onChange={(e) => setCostperOrder(e.target.value)}
                disabled={activeType !== 'price'}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 font-bold rounded-xl focus:outline-none transition-all text-gray-800"
                placeholder="مثال: 20"
              />
              <span className="text-sm font-medium text-gray-400 whitespace-nowrap">جنية </span>
            </div>
          </div>

          {/* حقل سعر الكيلومتر */}
          <div className={`transition-opacity duration-300 ${activeType === 'distance' ? 'opacity-100' : 'opacity-40'}`}>
            <label className="block text-xs font-bold text-gray-500 mb-2">تكلفة التوصيل لكل 1 كيلومتر:</label>
            <div className="flex items-center gap-2 max-w-xs">
              <input 
                type="number"
                value={costperKilometer}
                onChange={(e) => setCostperKilometer(e.target.value)}
                disabled={activeType !== 'distance'}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-indigo-500 font-bold rounded-xl focus:outline-none transition-all text-gray-800"
                placeholder="مثال: 5"
              />
              <span className="text-sm font-medium text-gray-400 whitespace-nowrap">لكل كم</span>
            </div>
          </div>

          {/* زر الحفظ */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => handleUpdateSettings(activeType)}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-100 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  جاري الحفظ...
                </>
              ) : (
                'حفظ وتطبيق التغييرات'
              )}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

export default DeliverySystem;