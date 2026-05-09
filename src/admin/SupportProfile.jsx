import React from 'react';
import { useParams } from 'react-router-dom';

export default function SupportProfile() {
  const { id } = useParams();
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">ملف الدعم الفني</h1>
      <div className="bg-white rounded-2xl shadow p-5">
        <p className="text-gray-700">رقم الموظف: {id}</p>
        <p className="text-sm text-gray-500 mt-2">هذه صفحة مخصصة لعرض وإدارة موظف الدعم الفني.</p>
      </div>
    </div>
  );
}
