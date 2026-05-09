import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/menu`;

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

/* =========================
   🟢 جلب الأقسام + الأصناف
========================= */
const fetchCategories = async () => {
  const res = await axios.get(`${API_URL}/categories`, {
    headers: authHeader(),
  });
  return res.data;
};

export const useMenuCategories = () =>
  useQuery({
    queryKey: ["menu-categories"],
    queryFn: fetchCategories,
  });

/* =========================
   ➕ إضافة صنف
========================= */
const addItem = async (formData) => {
  const res = await axios.post(`${API_URL}/items`, formData, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const useAddMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-categories"] });
    },
  });
};

/* =========================
   ✏️ تعديل صنف
========================= */
const updateItem = async ({ id, formData }) => {
  const res = await axios.put(`${API_URL}/items/${id}`, formData, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-categories"] });
    },
  });
};

/* =========================
   🗑 حذف صنف
========================= */
const deleteItem = async (id) => {
  const res = await axios.delete(`${API_URL}/items/${id}`, {
    headers: authHeader(),
  });
  return res.data;
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-categories"] });
    },
  });
};

/* =========================
   ➕ إضافة قسم
========================= */
const addCategory = async (data) => {
  const res = await axios.post(`${API_URL}/categories`, data, {
    headers: authHeader(),
  });
  return res.data;
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-categories"] });
    },
  });
};
