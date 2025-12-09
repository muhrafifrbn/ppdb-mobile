import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { loginPPDB, PPDBUser } from "../lib/api";

type AuthContextType = {
  user: PPDBUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (nomorFormulir: string, tanggal_lahir: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PPDBUser | null>(null);
  const [loading, setLoading] = useState(true); // Loading state untuk memastikan data dimuat terlebih dahulu

  // Gunakan useEffect untuk memuat user dan token saat aplikasi pertama kali dimuat
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const saved = await SecureStore.getItemAsync("ppdb_user");
        const token = await SecureStore.getItemAsync("auth_token");
        console.log("Token yang diambil:", token); // Debugging: Pastikan token ada
        console.log("Saved :", saved); // Debugging: Pastikan token ada
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } catch (err) {
        console.log("Failed to load user:", err);
      } finally {
        setLoading(false); // Setelah data selesai dimuat, set loading ke false
      }
    };

    loadUserData();
  }, []); // Hanya dijalankan sekali saat aplikasi pertama kali dimuat

  const login = async (nomorFormulir: string, tanggal_lahir: string) => {
    setLoading(true); // Menandakan loading saat login
    try {
      const userData = await loginPPDB(nomorFormulir, tanggal_lahir);
      setUser(userData.user); // Simpan user data setelah login
      console.log("Login sukses. Token:", userData.accessToken); // Debugging: Pastikan token diterima
      console.log("User Data AuthContext:", user); // Debugging: Pastikan token diterima
      // Simpan user dan token ke SecureStore
      await SecureStore.setItemAsync(
        "ppdb_user",
        JSON.stringify(userData.user)
      );
      await SecureStore.setItemAsync("auth_token", userData.accessToken); // Menyimpan token
    } finally {
      setLoading(false); // Setelah login selesai, set loading ke false
    }
  };

  const logout = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync("ppdb_user");
    await SecureStore.deleteItemAsync("auth_token"); // Hapus token saat logout
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
