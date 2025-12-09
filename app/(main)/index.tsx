import Loading from "@/components/Loading"; // Komponen Loading yang sudah disiapkan
import { get } from "@/lib/api";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext"; // Ambil context Auth untuk user

export default function Dashboard() {
  const { user, loading: userLoading } = useAuth(); // Mendapatkan user dan loading dari context
  const [registrationForm, setRegistrationForm] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Pastikan kita hanya memulai fetchData jika user sudah ada dan loading user selesai
  useEffect(() => {
    if (userLoading || !user?.id) {
      return; // Jangan lanjutkan fetchData jika user masih loading atau nomor_formulir belum ada
    }

    const fetchData = async () => {
      try {
        // Ambil token yang disimpan di SecureStore
        const token = await SecureStore.getItemAsync("auth_token");
        console.log("Token yang digunakan untuk request:", token); // Log token yang digunakan
        console.log("User saved (main):", user); // Log token yang digunakan

        if (!token) {
          throw new Error("Token tidak ditemukan, harap login ulang.");
        }

        // Menggunakan axios untuk request GET
        const response = await get(
          `http://192.168.100.9:5500/api/regist-form/mobile/detail/${user?.id}`
        );

        console.log("Data yang diterima:", response.data); // Log data yang diterima

        setRegistrationForm(response.data); // Simpan data ke state
      } catch (error: any) {
        console.error("Gagal mengambil data:", error);
        setError(error.message || "Terjadi kesalahan dalam pengambilan data.");
        Alert.alert(
          "Error",
          error.message || "Terjadi kesalahan dalam pengambilan data."
        );
      }
    };

    fetchData(); // Menjalankan fungsi fetchData
  }, [user?.id, userLoading]); // Menjalankan ketika user.id atau loading berubah

  // Menunggu loading atau data user yang belum ada
  if (userLoading || !user) {
    return <Loading />; // Jika masih loading, tampilkan loading screen
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 8 }}>
        Selamat datang,
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>
        {registrationForm?.nama_lengkap ?? "Calon Siswa"}
      </Text>

      <Text style={{ marginBottom: 4 }}>
        Nomor Pendaftaran: {registrationForm?.nomor_formulir}
      </Text>
      <Text>Jurusan: {registrationForm?.jurusan_dipilih ?? "-"}</Text>
    </View>
  );
}
