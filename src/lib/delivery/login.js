import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function loginDelivery(data) {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/delivery/login`, data);
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

export function useLoginDelivery(options = {}) {
  return useQuery(['login-delivery'], loginDelivery, options);
}

export default loginDelivery;
