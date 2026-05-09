import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function getFavorites() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/client/favorites`,{
        headers: {  Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data; 
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

export function useGetFavorites(options = {}) {
  return useQuery(['getFavorites'], getFavorites, options);
}

export default getFavorites;
