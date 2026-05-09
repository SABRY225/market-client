import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function getSallerNotification() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/vendor/overview/notifictions`,{
       headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
        }
      );
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message ;
    throw new Error(message);
  }
}

// 2️⃣ Hook لاستخدام React Query
export function useSallerNotification(options = {}) {
  return useQuery(['sallerNotification'], getSallerNotification, options);
}

// 3️⃣ تصدير افتراضي
export default getSallerNotification;
