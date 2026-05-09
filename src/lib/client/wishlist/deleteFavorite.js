import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function deleteFavorites(id) {
  try {
    const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/client/favorites/${id}`,{
        headers: {  Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data; 
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

export function useDeleteFavorites(options = {}) {
  return useQuery(['deleteFavorites'], deleteFavorites, options);
}

export default deleteFavorites;
