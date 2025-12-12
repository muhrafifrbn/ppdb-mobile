import { get } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons"; // Import icon untuk tampilan kosong
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function JadwalTes() {
  const { user } = useAuth();
  const [jadwalTes, setJadwalTes] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");

      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      // Gunakan get dari api.ts
      const response = await get(
        `/information/schedule-test/mobile/detail/${user?.id_gelombang}`
      );

      // Cek apakah response memiliki data yang valid
      if (response && response.data) {
        // Coba parse informasi_ruangan (aman dari error jika string tidak valid)
        let infoRuangan = {};
        try {
          infoRuangan =
            typeof response.data.informasi_ruangan === "string"
              ? JSON.parse(response.data.informasi_ruangan)
              : response.data.informasi_ruangan;
        } catch (e) {
          console.log("Gagal parse informasi ruangan", e);
        }

        setJadwalTes({
          ...response.data,
          informasi_ruangan: infoRuangan,
        });
      } else {
        // Jika response sukses tapi data kosong
        setJadwalTes(null);
      }
    } catch (error: any) {
      console.error("Gagal mengambil jadwal:", error);
      // Jika error (misal 404), kita pastikan jadwalTes null agar UI menampilkan "Belum ditentukan"
      setJadwalTes(null);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.id_gelombang) {
      fetchData();
    } else {
      // Jika user belum punya gelombang, stop loading dan biarkan kosong
      setIsLoading(false);
    }
  }, [user?.id_gelombang]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Format tanggal helper
  const formatTanggal = (tanggal: string) => {
    if (!tanggal) return "-";
    const date = new Date(tanggal);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {/* HEADER (Tetap Tampil Walaupun Error) */}
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
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
            Jadwal Tes PPDB
          </Text>

          {/* KONDISI 1: LOADING */}
          {isLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 50,
              }}
            >
              <ActivityIndicator size="large" color="#b91c1c" />
              <Text style={{ marginTop: 10, color: "#6b7280" }}>
                Memuat jadwal...
              </Text>
            </View>
          ) : jadwalTes ? (
            /* KONDISI 2: DATA ADA */
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
                  {jadwalTes.informasi_ruangan?.tes_kesehatan || "-"}
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
                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                  Wawancara
                </Text>
                <Text style={{ color: "#6b7280" }}>
                  {formatTanggal(jadwalTes.tanggal_tes)} •{" "}
                  {jadwalTes.informasi_ruangan?.wawancara || "-"}
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
                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                  Psikotes
                </Text>
                <Text style={{ color: "#6b7280" }}>
                  {formatTanggal(jadwalTes.tanggal_tes)} •{" "}
                  {jadwalTes.informasi_ruangan?.psikotes || "-"}
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
                  {jadwalTes.informasi_ruangan?.tes_komputer || "-"}
                </Text>
              </View>
            </View>
          ) : (
            /* KONDISI 3: DATA KOSONG / ERROR (Tampilan Pemberitahuan) */
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 40,
                padding: 20,
              }}
            >
              <Ionicons
                name="calendar-clear-outline"
                size={80}
                color="#d1d5db"
              />
              <Text
                style={{
                  marginTop: 16,
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#374151",
                  textAlign: "center",
                }}
              >
                Jadwal Belum Ditentukan
              </Text>
              <Text
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  color: "#6b7280",
                  textAlign: "center",
                }}
              >
                Silakan cek kembali secara berkala atau hubungi panitia PPDB
                jika Anda merasa ini kesalahan.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
