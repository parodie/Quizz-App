// src/services/api.js
import axios from 'axios';

/*export const api = axios.create({
    baseURL: '/api',   // relative URL (the rest handled by nginx)
    withCredentials: true
});
*/

const getApiBaseUrl = () => {
  const url = import.meta.env.VITE_API_BASE_URL;
  // Fallback to '/api' if not set
  return url || '/api';
};

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: false
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
