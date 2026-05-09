import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function getTopReviews() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/review/top-reviews`);
    return res.data; 
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

export function useGetTopReviews(options = {}) {
  return useQuery(['getTopReviews'], getTopReviews, options);
}

export default getTopReviews;
