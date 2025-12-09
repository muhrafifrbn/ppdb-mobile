import { get } from "@/lib/api"; // Menggunakan fungsi get dari api.ts
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext"; // Ambil context Auth untuk user

export default function JadwalTes() {
  const { user } = useAuth(); // Mendapatkan user dari context
  const [jadwalTes, setJadwalTes] = useState<any>(null); // Menyimpan jadwal tes
  const [error, setError] = useState<string | null>(null); // Menyimpan error

  useEffect(() => {
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
        console.error("Gagal mengambil data di jadwal-tes:", error);
        setError(error.message || "Terjadi kesalahan dalam pengambilan data.");
        Alert.alert(
          "Error",
          error.message || "Terjadi kesalahan dalam pengambilan data."
        );
      }
    };

    if (user?.id_gelombang) {
      fetchData(); // Menjalankan fungsi fetchData jika id_gelombang tersedia
    }
  }, [user?.id_gelombang]); // Menjalankan ketika user.id_gelombang berubah

  if (!jadwalTes) {
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
  }

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>
        Jadwal Tes PPDB
      </Text>

      <Text>
        • Tanggal Tes: {new Date(jadwalTes.tanggal_tes).toLocaleDateString()}
      </Text>
      <Text>• Jam Mulai: {jadwalTes.jam_mulai}</Text>
      <Text>• Jam Selesai: {jadwalTes.jam_selesai}</Text>

      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: "700" }}>Informasi Ruangan:</Text>
        <Text>
          • Tes Kesehatan: {jadwalTes.informasi_ruangan.tes_kesehatan || "-"}
        </Text>
        <Text>• Wawancara: {jadwalTes.informasi_ruangan.wawancara || "-"}</Text>
        <Text>• Psikotes: {jadwalTes.informasi_ruangan.psikotes || "-"}</Text>
        <Text>
          • Tes Komputer (TIK):{" "}
          {jadwalTes.informasi_ruangan.tes_komputer || "-"}
        </Text>
      </View>

      <Text>• Nama Gelombang: {jadwalTes.nama_gelombang}</Text>
    </View>
  );
}
