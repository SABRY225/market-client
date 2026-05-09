import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function loginCleint(data) {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/client/login`, data);
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

export function useLoginClient(options = {}) {
  return useQuery(['login'], loginCleint, options);
}

export default loginCleint;
