import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function sendCode(email) {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/client/send-code`, {email});
    return res.data; 
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

export function useSendCode(options = {}) {
  return useQuery(['sendCode'], sendCode, options);
}

export default sendCode;
