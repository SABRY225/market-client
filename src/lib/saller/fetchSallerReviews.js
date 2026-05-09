import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function getSallerReviews() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/review`, {
       headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    return res.data; 
  } catch (error) {
    const message = error.response?.data?.message || error.message ;
    throw new Error(message);
  }
}

// 2️⃣ Hook لاستخدام React Query
export function useSallerReviews(options = {}) {
  return useQuery(['sallerReviews'], getSallerReviews, options);
}

// 3️⃣ تصدير افتراضي
export default getSallerReviews;
