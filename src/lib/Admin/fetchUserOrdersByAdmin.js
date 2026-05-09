import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function getUserOrdersByAdmin(id) {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/admin/orders/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});
    return res.data; 
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

export function useGetUserOrdersByAdmin(options = {}) {
  return useQuery(['getUserOrderByAdmin'], getUserOrdersByAdmin, options);
}

export default getUserOrdersByAdmin;
