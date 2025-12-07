// lib/api.ts
import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

// ===========================================
// 1. Base URL API
// ===========================================
// GANTI dengan IP laptop/server kamu
// jangan pakai localhost!
const BASE_URL = "http://192.168.1.10:3000/api";

// ===========================================
// 2. Axios instance
// ===========================================
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ===========================================
// 3. REQUEST INTERCEPTOR
//    Tambahkan token ke setiap request
// ===========================================
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===========================================
// 4. RESPONSE INTERCEPTOR
//    Auto refresh token ketika token expired
// ===========================================
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Error: Unauthorized & belum di-retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token
        const refreshResponse = await apiClient.post("/auth/refresh-token");
        const newToken = refreshResponse.data.token;

        if (newToken) {
          // Simpan token baru
          await SecureStore.setItemAsync("auth_token", newToken);

          // Tambahkan Authorization header
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

          // Ulangi request sebelumnya
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh gagal → Logout user
        console.log("Refresh token gagal:", refreshError);

        await SecureStore.deleteItemAsync("auth_token");

        router.replace("/(auth)/login");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ===========================================
// 5. API Wrapper (sama seperti project React JS kamu)
// ===========================================

// GET
export const get = async (endpoint: string, params = {}) => {
  try {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error("GET Error:", error);
    throw error;
  }
};

// POST
export const post = async (endpoint: string, data = {}) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("POST Error:", error);
    throw error;
  }
};

// PUT
export const put = async (endpoint: string, data = {}) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("PUT Error:", error);
    throw error;
  }
};

// DELETE
export const del = async (endpoint: string) => {
  try {
    const response = await apiClient.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error("DELETE Error:", error);
    throw error;
  }
};

export default apiClient;
