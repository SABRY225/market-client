import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// 1️⃣ دالة لجلب بيانات المدير
export async function postReviewStatus(reviewId,text) {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/review/${reviewId}/status`,{text},{
       headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
        }
      );
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message ;
    throw new Error(message);
  }
}

// 2️⃣ Hook لاستخدام React Query
export function useUpdateReviewStatus(options = {}) {
  return useQuery(['update-review-Status'], postReviewStatus, options);
}

// 3️⃣ تصدير افتراضي
export default postReviewStatus;
