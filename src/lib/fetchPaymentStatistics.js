import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function getStatistics() {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/payment/statistics`, {
      token: localStorage.getItem("token"),
    });
    return res.data; // Axios يحط البيانات مباشرة في res.data
  } catch (error) {
    // Axios يحط الخطأ في response أو message
    const message = error.response?.data?.message || error.message ;
  }
}

// 2️⃣ Hook لاستخدام React Query
export function useStatistics(options = {}) {
  return useQuery(['Statistics'], getStatistics, options);
}

// 3️⃣ تصدير افتراضي
export default getStatistics;