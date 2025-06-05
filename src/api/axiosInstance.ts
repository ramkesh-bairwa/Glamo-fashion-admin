// src/api/axiosInstance.ts
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://glamofashion.com/glamo-api/api';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
