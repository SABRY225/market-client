import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function updateOrderStatus(orderId) {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/orders/${orderId}`,{
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
export function useUpdateOrderStatus(options = {}) {
  return useQuery(['update-Order-Status'], updateOrderStatus, options);
}

// 3️⃣ تصدير افتراضي
export default updateOrderStatus;
