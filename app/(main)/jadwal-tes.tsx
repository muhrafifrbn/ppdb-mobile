import apiClient, { get } from "@/lib/api"; // Import apiClient untuk handling error 404 manual
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import AppButton from "../../components/ui/AppButton"; // Pastikan path benar
import { useStudentData } from "../../context/StudentContext"; // Pakai ini untuk ambil ID Siswa

export default function JadwalTes() {
  const { student } = useStudentData(); // Ambil data siswa (ID & Gelombang)

  // State untuk status pembayaran & Jadwal
  const [paymentStatus, setPaymentStatus] = useState<
    "loading" | "unpaid" | "pending" | "confirmed"
  >("loading");
  const [jadwalTes, setJadwalTes] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fungsi Utama: Cek Pembayaran dulu, baru Jadwal
  const fetchData = async () => {
    // Pastikan data siswa ada
    if (!student?.id) return;

    try {
      // 1. CEK STATUS PEMBAYARAN
      // Kita gunakan apiClient langsung agar bisa catch error 404
      try {
        const payRes = await apiClient.get(
          `/payment-form/mobile/detail/${student.id}`
        );
        const payData = payRes.data?.data || payRes.data;

        if (payData) {
          if (payData.konfirmasi_pembayaran === 1) {
            setPaymentStatus("confirmed");

            // 2. JIKA CONFIRMED, BARU FETCH JADWAL TES
            await fetchJadwalData();
          } else {
            setPaymentStatus("pending");
          }
        } else {
          setPaymentStatus("unpaid");
        }
      } catch (payError: any) {
        // Jika Error 404, artinya belum ada data pembayaran
        if (payError.response && payError.response.status === 404) {
          setPaymentStatus("unpaid");
        } else {
          console.error("Error cek pembayaran:", payError);
          // Default ke unpaid jika error lain agar aman
          setPaymentStatus("unpaid");
        }
      }
    } catch (error) {
      console.error("General Error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Fungsi Fetch Jadwal (Dipanggil jika confirmed)
  const fetchJadwalData = async () => {
    try {
      if (!student?.id_gelombang) return;

      const response = await get(
        `/information/schedule-test/mobile/detail/${student.id_gelombang}`
      );

      if (response && response.data) {
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
        setJadwalTes(null);
      }
    } catch (error) {
      console.error("Gagal ambil jadwal:", error);
      setJadwalTes(null);
    }
  };

  useEffect(() => {
    if (student) {
      fetchData();
    }
  }, [student]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Helper format tanggal
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

  // --- LOGIC TAMPILAN (RENDER) ---

  // 1. TAMPILAN LOADING
  if (paymentStatus === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#b91c1c" />
        <Text style={{ marginTop: 10, color: "#666" }}>
          Memeriksa status...
        </Text>
      </View>
    );
  }

  // 2. TAMPILAN BELUM BAYAR (TERKUNCI)
  if (paymentStatus === "unpaid") {
    return (
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
          backgroundColor: "#fff",
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Ionicons name="lock-closed" size={80} color="#d1d5db" />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 16,
            color: "#374151",
          }}
        >
          Akses Terkunci
        </Text>
        <Text
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginTop: 8,
            marginBottom: 24,
          }}
        >
          Anda belum melakukan pembayaran formulir. Silakan selesaikan
          pembayaran di Dashboard untuk melihat jadwal tes.
        </Text>
        <AppButton
          title="Ke Pembayaran"
          onPress={() => router.push("/(main)")}
        />
      </ScrollView>
    );
  }

  // 3. TAMPILAN MENUNGGU KONFIRMASI (PENDING)
  if (paymentStatus === "pending") {
    return (
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
          backgroundColor: "#fff",
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Ionicons name="time-outline" size={80} color="orange" />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 16,
            color: "#374151",
          }}
        >
          Menunggu Verifikasi
        </Text>
        <Text style={{ textAlign: "center", color: "#6b7280", marginTop: 8 }}>
          Bukti pembayaran Anda sedang diperiksa oleh Admin. Jadwal tes akan
          muncul otomatis setelah pembayaran dikonfirmasi.
        </Text>
      </ScrollView>
    );
  }

  // 4. TAMPILAN SUDAH BAYAR (CONFIRMED) -> TAMPILKAN JADWAL
  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {/* HEADER */}
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

          {jadwalTes ? (
            /* DATA JADWAL ADA */
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
            /* SUDAH BAYAR TAPI JADWAL BELUM DISET ADMIN */
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
                Pembayaran Anda sudah dikonfirmasi, namun Panitia belum mengatur
                jadwal tes untuk Gelombang Anda.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
