import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function deleteCartItems(itemId) {
  try {
    const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/client/cart/${itemId}`,{
        headers: {  Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data; 
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

export function useDeleteCartItems(options = {}) {
  return useQuery(['deleteCartItems'], deleteCartItems, options);
}

export default deleteCartItems;
