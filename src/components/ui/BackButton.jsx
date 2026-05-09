// src/components/BackButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // أو أيقونة من Heroicons

const BackButton = ({ customText = 'العودة للخلف', className = '' }) => {
  const navigate = useNavigate();

  // الدالة التي تستدعي navigate(-1) للرجوع خطوة واحدة في التاريخ
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleGoBack}
      // تصميم Tailwind CSS احترافي
      className={`
        flex items-center space-x-2 ltr:space-x-reverse 
        px-4 py-2 
        bg-white text-gray-700 
        border border-gray-300 
        rounded-lg 
        shadow-sm 
        hover:bg-gray-100 
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        transition duration-150 ease-in-out
        ${className}
      `}
    >
      {/* الأيقونة (تتجه لليمين في اللغة العربية) */}
      <ArrowLeft size={18} className="rtl:rotate-180" /> 
      
      {/* النص المخصص */}
      <span className="font-medium text-sm">
        {customText}
      </span>
    </button>
  );
};

export default BackButton;