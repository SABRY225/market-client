import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function getUserOrders(activeTab) {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/client/orders`, {
    params: { status: activeTab },
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});
    return res.data; 
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

export function useGetUserOrders(options = {}) {
  return useQuery(['getUserOrder'], getUserOrders, options);
}

export default getUserOrders;
