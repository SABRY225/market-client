import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function getAllAdmin() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/admin/all`, {
       headers: {
         Authorization: `Bearer ${localStorage.getItem("token")}`,
       },      
    });
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message ;
    throw new Error(message);
  }
}

export function useAllAdmin(options = {}) {
  return useQuery(['allAdmin'], getAllAdmin, options);
}

// 3️⃣ تصدير افتراضي
export default getAllAdmin;