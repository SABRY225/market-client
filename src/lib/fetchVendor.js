import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function getVendor(vendorId) {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/get-vendor/${vendorId}`);
    return res.data; // Axios يحط البيانات مباشرة في res.data
  } catch (error) {
    // Axios يحط الخطأ في response أو message
    const message = error.response?.data?.message || error.message ;
  }
}

// 2️⃣ Hook لاستخدام React Query
export function useVendor(options = {}) {
  return useQuery(['Vendor'], getVendor, options);
}

// 3️⃣ تصدير افتراضي
export default getVendor;