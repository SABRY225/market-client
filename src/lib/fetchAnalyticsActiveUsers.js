import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function getAnalyticsActiveUsers() {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/analytics/active-users`, {
      token: localStorage.getItem("token"),
    });
    return res.data; // Axios يحط البيانات مباشرة في res.data
  } catch (error) {
    // Axios يحط الخطأ في response أو message
    const message = error.response?.data?.message || error.message ;
    throw new Error(message);
  }
}

// 2️⃣ Hook لاستخدام React Query
export function useAnalyticsActiveUsers(options = {}) {
  return useQuery(['analyticsActiveUsers'], getAnalyticsActiveUsers, options);
}

// 3️⃣ تصدير افتراضي
export default getAnalyticsActiveUsers;
