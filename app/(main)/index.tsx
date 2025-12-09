import Loading from "@/components/Loading"; // Komponen Loading yang sudah disiapkan
import { get } from "@/lib/api";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Alert, Image, Text, View } from "react-native";
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
        const response = await get(`/regist-form/mobile/detail/${user?.id}`);

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
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "#b91c1c",
          height: 120,
          borderBottomLeftRadius: 90,
          borderBottomRightRadius: 90,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("@/assets/images/logo-letris-removebg.png")}
            style={{ width: 48, height: 48, marginRight: 10 }}
            resizeMode="contain"
          />
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            SISTEM PPDB SMK LETRIS 2
          </Text>
        </View>
      </View>

      <View style={{ flex: 1, padding: 16 }}>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 16,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 8 }}>
            Selamat datang,
          </Text>
          <Text style={{ fontSize: 18, marginBottom: 16 }}>
            {registrationForm?.nama_lengkap ?? "Calon Siswa"}
          </Text>

          <View
            style={{ height: 1, backgroundColor: "#e5e7eb", marginVertical: 8 }}
          />

          <Text style={{ color: "#6b7280" }}>Nomor Pendaftaran</Text>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>
            {registrationForm?.nomor_formulir ?? "-"}
          </Text>

          <Text style={{ color: "#6b7280" }}>Jurusan</Text>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            {registrationForm?.jurusan_dipilih ?? "-"}
          </Text>
        </View>
      </View>
    </View>
  );
}
