// lib/api.ts
import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

// ================================
// BASE URL API
// ================================
// Saran: pakai ENV, tapi sementara bisa hardcode
// GANTI IP sesuai laptop/server kamu
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.100.9:5500/api";
const BASE_URL_AUTH = "http://192.168.100.9:5500/api/auth-mobile/login";

// ================================
// AXIOS INSTANCE
// ================================
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // tidak digunakan di RN, tapi tidak masalah
});

// ================================
// REQUEST INTERCEPTOR
// ================================
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

// ================================
// RESPONSE INTERCEPTOR
// (jika nanti kamu pakai refresh token)
// ================================
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await apiClient.post("/auth/refresh-token");
        const newToken = refreshResponse.data.token;

        if (newToken) {
          await SecureStore.setItemAsync("auth_token", newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        await SecureStore.deleteItemAsync("auth_token");
        router.replace("/(auth)/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const postMultipart = async (endpoint: string, formData: FormData) => {
  try {
    const response = await apiClient.post(endpoint, formData, {
      transformRequest: (data) => data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    // TAMBAHKAN LOG INI:
    if (error.response) {
      console.log("SERVER ERROR DATA:", error.response.data); // Ini akan memberitahu apa yang salah
      console.log("SERVER STATUS:", error.response.status);
    }
    throw error;
  }
};

// ================================
// WRAPPER GET / POST / PUT / DELETE
// ================================

export const get = async (endpoint: string, params = {}) => {
  try {
    const response = await apiClient.get(endpoint, { params });
    // console.log("Response dari API:", response); // Log response dari API
    return response.data;
  } catch (error) {
    console.log("API Error:", error);
  }
};

export const post = async (endpoint: string, data = {}) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.log("API Error:", error);
  }
};

export const put = async (endpoint: string, data = {}) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.log("API Error:", error);
  }
};

export const del = async (endpoint: string) => {
  try {
    const response = await apiClient.delete(endpoint);
    return response.data;
  } catch (error) {
    console.log("API Error:", error);
  }
};

// ================================
// TIPE DATA SESUAI TABEL registration_form
// ================================
export interface RegistrationFormPayload {
  jurusan_dipilih: string;
  nama_lengkap: string;
  tempat_lahir: string;
  tanggal_lahir: string; // "YYYY-MM-DD"
  jenis_kelamin: string;
  agama: string;
  sekolah_asal: string;
  alamat: string;
  telepon: string;
  email: string;
  nama_ayah: string;
  nama_ibu: string;
}

export interface PPDBUser {
  id: number;
  nomor_formulir: string;
  id_gelombang: string;
}

// ================================
// REGISTER: POST /api/regist-form/mobile/create
// ================================
export async function registerPPDB(
  payload: RegistrationFormPayload
): Promise<{ id: number; nomor_formulir: string }> {
  const res = await post("/regist-form/mobile/create", payload);
  // Response dari backend:
  // {
  //   message: "...",
  //   data: { id: 123, nomor_formulir: "PPDB2024...." }
  // }

  if (!res?.data?.nomor_formulir) {
    throw new Error("Nomor formulir tidak ditemukan pada response API");
  }

  return {
    id: res.data.id,
    nomor_formulir: res.data.nomor_formulir,
  };
}

// ================================
// LOGIN: GET /api/regist-form/mobile/detail/:nomor_formulir
// (verifyFormNumber akan detect nomor_formulir tsb)
// ================================
export async function loginPPDB(
  nomor_formulir: string,
  tanggal_lahir: string
): Promise<any> {
  console.log("LOGIN PPDB CALL", nomor_formulir);

  try {
    const res = await axios.post(BASE_URL_AUTH, {
      nomor_formulir: nomor_formulir,
      tanggal_lahir: tanggal_lahir,
    });

    console.log("LOGIN PPDB RESPONSE", res.data);

    const data = res.data;

    if (!data || !data.token) {
      throw new Error("Login failed, no token received.");
    }

    return {
      accessToken: data.token,
      refreshToken: data.refreshToken,
      user: {
        id: data.id,
        nomor_formulir: data.nomor_formulir,
        id_gelombang: data.id_gelombang,
      },
    };
    // return res.data.data as PPDBUser;
  } catch (error: any) {
    console.log("LOGIN PPDB ERROR", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
}

export default apiClient;
