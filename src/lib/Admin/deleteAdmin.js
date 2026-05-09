import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function deleteAdmin(adminId) {
  try {
    const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/admin/${adminId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

// 2️⃣ Hook لاستخدام React Query
export function useDeleteAdmin(options = {}) {
  return useQuery(['deleteAdmin'], deleteAdmin, options);
}

// 3️⃣ تصدير افتراضي
export default deleteAdmin;