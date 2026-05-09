import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function getTopProducts() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/menu/top-products`);
    return res.data; 
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

export function useGetTopProducts(options = {}) {
  return useQuery(['getTopProducts'], getTopProducts, options);
}

export default getTopProducts;
