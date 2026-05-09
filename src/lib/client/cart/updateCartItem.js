import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function updateCartItem(itemId,data) {
  try {
    const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/client/cart/${itemId}`,data,{
        headers: {  Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data; 
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

export function useUpdateCartItem(options = {}) {
  return useQuery(['updateCartItem'], updateCartItem, options);
}

export default updateCartItem;
