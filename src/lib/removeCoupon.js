import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function removeCoupon(couponId) {
  try {
    const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/coupon/remove/${couponId}`, {
      headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    return res.data; // Axios يحط البيانات مباشرة في res.data
  } catch (error) {
    // Axios يحط الخطأ في response أو message
    const message = error.response?.data?.message || error.message ;
  }
}

// 2️⃣ Hook لاستخدام React Query
export function useRemoveCoupon(options = {}) {
  return useQuery(['RemoveCoupon'], removeCoupon, options);
}

// 3️⃣ تصدير افتراضي
export default removeCoupon;