import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function updateSaller(data,id) {
  try {
    const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/auth/vendor/profile/${id}`, data,
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    return res.data; 
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

export function useUpdateSaller(options = {}) {
  return useQuery(['updateSaller'], updateSaller, options);
}

// 3️⃣ تصدير افتراضي
export default updateSaller;