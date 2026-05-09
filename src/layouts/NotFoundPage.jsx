import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'; // استخدم أيقونة جذابة

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        {/* أيقونة جذابة */}
        <ExclamationTriangleIcon className="h-24 w-24 text-red-500 mx-auto animate-bounce" />
        
        {/* العنوان الرئيسي */}
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          أوبس! الصفحة دي مش موجودة
        </h1>
        
        {/* الوصف */}
        <p className="mt-4 text-lg text-gray-600">
          يبدو أن الصفحة اللي بتدور عليها اختفت. ممكن تكون الرابط خطأ أو الصفحة اتحذفت.
        </p>

        {/* أزرار الحلول */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          {/* زر العودة للصفحة الرئيسية */}
          <a
            href="/"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            العودة للصفحة الرئيسية
          </a>
          
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;