import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function getUserData(id) {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/client/${id}`);
    return res.data; 
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

export function useGetUserData(options = {}) {
  return useQuery(['getUserData'], getUserData, options);
}

export default getUserData;
