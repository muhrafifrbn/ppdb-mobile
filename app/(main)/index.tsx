// app/(main)/index.tsx
import Loading from "@/components/Loading";
import React, { useState } from "react";
import { Alert, Image, Modal, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import AppButton from "../../components/ui/AppButton";
import { useStudentData } from "../../context/StudentContext"; // 1. Import Context

export default function Dashboard() {
  // 2. Ambil data, loading status, dan fungsi refresh dari Context
  const { student, loading, refreshStudent } = useStudentData();
  const [bank, setBank] = useState<string>("");
  const [buktiUri, setBuktiUri] = useState<string>("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const BANKS = [
    { value: "BCA", label: "BCA", norek: "1234567890 a.n. SMK Letris 2" },
    { value: "BRI", label: "BRI", norek: "0987654321 a.n. SMK Letris 2" },
    { value: "Mandiri", label: "Mandiri", norek: "1112223334 a.n. SMK Letris 2" },
    { value: "BNI", label: "BNI", norek: "5556667778 a.n. SMK Letris 2" },
  ];
  const formatIDR = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n || 0);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") {
      Alert.alert("Izin diperlukan", "Aktifkan izin akses galeri untuk unggah bukti.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!res.canceled) setBuktiUri(res.assets[0].uri);
  };

  const handleSubmitPayment = () => {
    if (!bank || !buktiUri) {
      Alert.alert("Validasi", "Pilih bank dan unggah bukti pembayaran terlebih dahulu.");
      return;
    }
    Alert.alert("Berhasil", "Bukti pembayaran terkirim.");
    setShowPaymentModal(false);
    setBank("");
    setBuktiUri("");
  };

  // Jika sedang loading awal dan data belum ada, tampilkan spinner
  if (loading && !student) {
    return <Loading />;
  }

  return (
    // 3. Gunakan ScrollView agar bisa Pull-to-Refresh
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refreshStudent} />
      }
    >
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
            source={require("@/assets/images/logo-letris-removebg.png")}
            style={{ width: 48, height: 48, marginRight: 10 }}
            resizeMode="contain"
          />
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            SISTEM PPDB SMK LETRIS 2
          </Text>
        </View>
      </View>

      {/* CONTENT */}
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
            Selamat datang
          </Text>

          {/* 4. Tampilkan Data dari Context */}
          <Text style={{ fontSize: 18, marginBottom: 16 }}>
            {student?.nama_lengkap ?? "Calon Siswa"}
          </Text>

          <View
            style={{ height: 1, backgroundColor: "#e5e7eb", marginVertical: 8 }}
          />

          <Text style={{ color: "#6b7280" }}>Nomor Pendaftaran</Text>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>
            {student?.nomor_formulir ?? "-"}
          </Text>

          <Text style={{ color: "#6b7280" }}>Jurusan</Text>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            {student?.jurusan_dipilih ?? "-"}
          </Text>
        </View>

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
            marginTop: 12,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>
            Pembayaran Pendaftaran
          </Text>

          <Text style={{ color: "#6b7280" }}>Nominal Tagihan</Text>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>
            {formatIDR(Number((student as any)?.nominal_pembayaran ?? (student as any)?.total_biaya ?? 0))}
          </Text>

          <AppButton title="Bayar Sekarang" onPress={() => setShowPaymentModal(true)} />
        </View>

        <Modal visible={showPaymentModal} transparent animationType="slide" onRequestClose={() => setShowPaymentModal(false)}>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", padding: 24 }}>
            <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>Pembayaran</Text>

              <Text style={{ color: "#6b7280" }}>Pilih Bank</Text>
              <View style={{ borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, marginBottom: 12, overflow: "hidden" }}>
                <Picker selectedValue={bank} onValueChange={(v) => setBank(String(v))}>
                  <Picker.Item label="Pilih Bank" value="" />
                  {BANKS.map((b) => (
                    <Picker.Item key={b.value} label={b.label} value={b.value} />
                  ))}
                </Picker>
              </View>

              {bank ? (
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ color: "#6b7280" }}>No Rekening</Text>
                  <Text style={{ fontSize: 16, fontWeight: "600" }}>
                    {BANKS.find((b) => b.value === bank)?.norek}
                  </Text>
                </View>
              ) : null}

              <Text style={{ color: "#6b7280", marginBottom: 8 }}>Upload Bukti Pembayaran</Text>
              <Pressable onPress={pickImage} style={{ borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 12, alignItems: "center" }}>
                <Text>{buktiUri ? "Ganti Bukti" : "Pilih Gambar"}</Text>
              </Pressable>
              {buktiUri ? (
                <View style={{ marginTop: 12, alignItems: "center" }}>
                  <Image source={{ uri: buktiUri }} style={{ width: 160, height: 160, borderRadius: 8 }} />
                </View>
              ) : null}

              <View style={{ flexDirection: "row", marginTop: 16, gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <AppButton title="Kirim" onPress={handleSubmitPayment} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppButton title="Tutup" onPress={() => setShowPaymentModal(false)} />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}
