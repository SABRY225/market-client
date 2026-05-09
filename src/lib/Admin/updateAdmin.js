import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function updateAdmin(adminId, data) {
  try {
    const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/admin/${adminId}`, data,
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    return res.data; 
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

export function useUpdateAdmin(options = {}) {
  return useQuery(['UpdateAdmin'], updateAdmin, options);
}

// 3️⃣ تصدير افتراضي
export default updateAdmin;