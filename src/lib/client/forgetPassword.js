import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function forgetPassword(data) {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/client/forget-password`, data);
    return res.data; 
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

export function useForgetPassword(options = {}) {
  return useQuery(['forgetPassword'], forgetPassword, options);
}

export default forgetPassword;
