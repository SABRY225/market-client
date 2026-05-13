// src/services/adService.js
import axios from 'axios';


export const adService = {
  getAll: () => axios.get(`${import.meta.env.VITE_API_URL}/api/v1/advertisements`),
  getActive: () => axios.get(`${import.meta.env.VITE_API_URL}/api/v1/advertisements/active-list`),
  getById: (id) => axios.get(`${import.meta.env.VITE_API_URL}/api/v1/advertisements/${id}`),
  
  // نستخدم FormData لدعم رفع الصور
  create: (formData) => axios.post(`${import.meta.env.VITE_API_URL}/api/v1/advertisements`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  update: (id, formData) => axios.put(`${import.meta.env.VITE_API_URL}/api/v1/advertisements/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  delete: (id) => axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/advertisements/${id}`),
  toggleActive: (id, isActive) => 
    axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/advertisements/${isActive ? 'disactive' : 'active'}/${id}`),
  
  increaseClick: (id) => axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/advertisements/click/${id}`),
};