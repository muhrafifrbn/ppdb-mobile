import { get } from "@/lib/api"; // Menggunakan fungsi get dari api.ts
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Image, RefreshControl, ScrollView, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext"; // Ambil context Auth untuk user

export default function JadwalTes() {
  const { user } = useAuth(); // Mendapatkan user dari context
  const [jadwalTes, setJadwalTes] = useState<any>(null); // Menyimpan jadwal tes
  const [error, setError] = useState<string | null>(null); // Menyimpan error
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Ambil token yang disimpan di SecureStore
      const token = await SecureStore.getItemAsync("auth_token");
      console.log("Token yang digunakan untuk request:", token); // Log token yang digunakan

      if (!token) {
        throw new Error("Token tidak ditemukan, harap login ulang.");
      }

      // Gunakan get dari api.ts untuk request data
      const response = await get(
        `/information/schedule-test/mobile/detail/${user?.id_gelombang}`
      );

      console.log("Data yang diterima:", response); // Log data yang diterima

      // Parse informasi_ruangan jika ada
      const infoRuangan = JSON.parse(response.data.informasi_ruangan);

      // Gabungkan informasi ruangan ke dalam data yang akan ditampilkan
      setJadwalTes({
        ...response.data,
        informasi_ruangan: infoRuangan,
      });
    } catch (error: any) {
      setError(error.message || "Terjadi kesalahan dalam pengambilan data.");
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // Set loading ke false setelah data selesai di-fetch
      setRefreshing(false); // Setelah refresh selesai, set refreshing ke false
    }
  };

  useEffect(() => {
    if (user?.id_gelombang) {
      fetchData(); // Menjalankan fungsi fetchData jika id_gelombang tersedia
    }
  }, [user?.id_gelombang]); // Menjalankan ketika user.id_gelombang berubah

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(); // Memanggil fetchData untuk refresh data
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error: {error}</Text>
      </View>
    );
  } // Format tanggal
  const formatTanggal = (tanggal: string) => {
    const date = new Date(tanggal);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("id-ID", options); // Format Indonesia
  };

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
            source={require("../../assets/images/logo-letris-removebg.png")}
            style={{ width: 48, height: 48, marginRight: 10 }}
            resizeMode="contain"
          />
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            SISTEM PPDB SMK LETRIS 2
          </Text>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
            Jadwal Tes PPDB
          </Text>

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
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                Tes Kesehatan
              </Text>
              <Text style={{ color: "#6b7280" }}>
                {formatTanggal(jadwalTes.tanggal_tes)} •{" "}
                {jadwalTes.informasi_ruangan.tes_kesehatan || "-"}
              </Text>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: "#e5e7eb",
                marginVertical: 8,
              }}
            />
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>Wawancara</Text>
              <Text style={{ color: "#6b7280" }}>
                {formatTanggal(jadwalTes.tanggal_tes)} •{" "}
                {jadwalTes.informasi_ruangan.wawancara || "-"}
              </Text>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: "#e5e7eb",
                marginVertical: 8,
              }}
            />
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>Psikotes</Text>
              <Text style={{ color: "#6b7280" }}>
                {formatTanggal(jadwalTes.tanggal_tes)} •{" "}
                {jadwalTes.informasi_ruangan.psikotes || "-"}
              </Text>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: "#e5e7eb",
                marginVertical: 8,
              }}
            />
            <View>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                Tes Komputer (TIK)
              </Text>
              <Text style={{ color: "#6b7280" }}>
                {formatTanggal(jadwalTes.tanggal_tes)} •{" "}
                {jadwalTes.informasi_ruangan.tes_komputer || "-"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
