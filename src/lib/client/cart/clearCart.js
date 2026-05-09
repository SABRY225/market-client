import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function clearCart() {
  try {
    const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/client/cart`,{
        headers: {  Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data; 
  } catch (error) {
    const message = error.response?.data?.message ;
    throw new Error(message);
  }
}

export function useClearCart(options = {}) {
  return useQuery(['clearCart'], clearCart, options);
}

export default clearCart;
