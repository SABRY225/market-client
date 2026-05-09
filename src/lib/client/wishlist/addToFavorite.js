import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function addToFavorite(id) {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/client/favorites`,{product_id:id},{
        headers: {  Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data; 
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

export function useAddToFavorite(options = {}) {
  return useQuery(['addToFavorite'], addToFavorite, options);
}

export default addToFavorite;
