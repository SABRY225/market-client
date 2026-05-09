import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function addToCart(data) {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/client/cart`,data,{
        headers: {  Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data; 
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

export function useAddToCart(options = {}) {
  return useQuery(['addToCart'], addToCart, options);
}

export default addToCart;
