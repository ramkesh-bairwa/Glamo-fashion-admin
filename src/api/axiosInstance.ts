// src/api/axiosInstance.ts
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://glamofashion.com/glamo-api/api/admin';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const axiosWithToken = () => {
  const token = localStorage.getItem('adminToken');
  
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

export default axiosInstance;
