import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function getTopMenu() {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/menu/top`);
    return res.data; 
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}


export function useTopMenu(options = {}) {
  return useQuery(['getTopMenu'], getTopMenu, options);
}

export default getTopMenu;
