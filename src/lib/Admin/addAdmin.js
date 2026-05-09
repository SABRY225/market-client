import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function addAdmin(data) {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/admin/add`, data,{
        headers: {  Authorization: `Bearer ${localStorage.getItem("token")}`, },
    });
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message ;
    throw new Error(message);
  }
}

// 2️⃣ Hook لاستخدام React Query
export function useAdd(options = {}) {
  return useQuery(['addAdmin'], addAdmin, options);
}

// 3️⃣ تصدير افتراضي
export default addAdmin;
