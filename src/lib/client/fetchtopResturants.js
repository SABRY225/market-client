import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function getTopResturants() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/vendor/top-resturants`);
    return res.data; 
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

export function useGetTopResturants(options = {}) {
  return useQuery(['getTopResturants'], getTopResturants, options);
}

export default getTopResturants;
