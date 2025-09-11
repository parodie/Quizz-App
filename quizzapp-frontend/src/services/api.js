// src/services/api.js
import axios from 'axios';

export const api = axios.create({
    baseURL: '/api',   // relative URL (the rest handled by nginx)
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});