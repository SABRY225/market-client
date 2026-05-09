import axios from "axios";
import { useMutation } from "@tanstack/react-query";

// 1️⃣ دالة إنشاء الطلب
export async function createOrder() {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/client/create-order`,
      {}, // 👈 الجسم (Body) فارغ، يجب وضعه قبل الإعدادات
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }
    );
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
}

// 2️⃣ Hook باستخدام useMutation
export function useCreateOrder() {
  return useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      // يمكنك إضافة منطق هنا مثل إظهار تنبيه نجاح
      console.log("Order created successfully", data);
    },
    onError: (error) => {
      console.error("Failed to create order", error.message);
    }
  });
}

export default createOrder;