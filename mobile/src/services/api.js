import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  'http://10.173.111.127:5000/api';
  console.log("API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    console.log("========== AXIOS ERROR ==========");
    console.log("Message:", error.message);
    console.log("Code:", error.code);
    console.log("Status:", error.response?.status);
    console.log("Response:", error.response?.data);
    console.log("Base URL:", error.config?.baseURL);
    console.log("URL:", error.config?.url);

    return Promise.reject(error);
  }
);

export default api;
