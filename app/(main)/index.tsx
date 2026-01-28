import Loading from "@/components/Loading";
import apiClient, { postMultipart } from "@/lib/api";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import AppButton from "../../components/ui/AppButton";
import { useStudentData } from "../../context/StudentContext";

export default function Dashboard() {
  const { student, loading, refreshStudent } = useStudentData();
  const [bank, setBank] = useState<string>("");
  const [buktiUri, setBuktiUri] = useState<string>("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [paidLocal, setPaidLocal] = useState(false);

  // 1. LOGIKA STATUS PEMBAYARAN & KONFIRMASI
  const [paymentStatus, setPaymentStatus] = useState<
    "unpaid" | "pending" | "confirmed" | "loading"
  >("loading");
  const isPaid = paymentStatus !== "unpaid" || paidLocal;
  const isConfirmed = paymentStatus === "confirmed";
  const currentStep = !isPaid ? 1 : !isConfirmed ? 2 : 3;

  useEffect(() => {
    refreshStudent();
  }, []);

  const fetchPaymentStatus = async () => {
    if (!student?.id) {
      setPaymentStatus("loading");
      return;
    }
    try {
      const res = await apiClient.get(
        `/payment-form/mobile/detail/${student.id}`
      );
      const pay = res.data?.data || res.data;
      if (
        pay?.konfirmasi_pembayaran === 1 ||
        pay?.status_konfirmasi === "CONFIRMED" ||
        pay?.status_konfirmasi === "VERIFIED"
      ) {
        setPaymentStatus("confirmed");
      } else {
        setPaymentStatus("pending");
      }
    } catch (err: any) {
      if (err?.response?.status === 404) setPaymentStatus("unpaid");
      else setPaymentStatus("unpaid");
    }
  };

  useEffect(() => {
    setPaidLocal(false);
    if (student?.id) fetchPaymentStatus();
  }, [student?.id]);

  const BANKS = [
    { value: "BCA", label: "BCA", norek: "1234567890 a.n. SMK Letris 2" },
    { value: "BRI", label: "BRI", norek: "0987654321 a.n. SMK Letris 2" },
    {
      value: "Mandiri",
      label: "Mandiri",
      norek: "1112223334 a.n. SMK Letris 2",
    },
    { value: "BNI", label: "BNI", norek: "5556667778 a.n. SMK Letris 2" },
  ];

  const formatIDR = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n || 0);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") {
      Alert.alert(
        "Izin diperlukan",
        "Aktifkan izin akses galeri untuk unggah bukti."
      );
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!res.canceled) setBuktiUri(res.assets[0].uri);
  };

  const handleSubmitPayment = async () => {
    if (!bank || !buktiUri) {
      Alert.alert(
        "Validasi",
        "Pilih bank dan unggah bukti pembayaran terlebih dahulu."
      );
      return;
    }
    try {
      setUploading(true);
      const amount = Number((student as any)?.nominal_pembayaran ?? 150000);
      const idFormulir =
        (student as any)?.id ?? (student as any)?.id_formulir ?? "";

      const form = new FormData();
      form.append("nama_tagihan", "Biaya Pendaftaran");
      form.append("nama_bank", bank);
      form.append("tanggal_transfer", new Date().toISOString().split("T")[0]);
      form.append("jumlah_tagihan", String(amount));
      form.append("id_formulir", String(idFormulir));

      const filename = buktiUri.split("/").pop() || `bukti-${Date.now()}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      form.append("bukti_bayar", {
        uri:
          Platform.OS === "android"
            ? buktiUri
            : buktiUri.replace("file://", ""),
        name: filename,
        type: type,
      } as any);

      await postMultipart("/payment-form/mobile/create", form);

      Alert.alert("Berhasil", "Bukti pembayaran terkirim.");
      setPaidLocal(true);
      setPaymentStatus("pending");
      setShowPaymentModal(false);
      setBank("");
      setBuktiUri("");
      refreshStudent();
    } catch (e: any) {
      Alert.alert("Gagal", "Terjadi kesalahan saat mengunggah data.");
    } finally {
      setUploading(false);
    }
  };

  if (loading && !student) return <Loading />;

  return (
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

      <View style={{ flex: 1, padding: 16 }}>
        {/* INFO SISWA */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 16,
            elevation: 2,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 8,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 8 }}>
            Selamat datang
          </Text>
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

        {/* STATUS PEMBAYARAN */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 16,
            elevation: 2,
            marginTop: 12,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>
            Status Pendaftaran
          </Text>
          <Text style={{ color: "#6b7280" }}>Tagihan Pendaftaran</Text>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>
            {formatIDR(Number((student as any)?.nominal_pembayaran ?? 200000))}
          </Text>

          {paymentStatus === "unpaid" && (
            <AppButton
              title="Bayar Sekarang"
              onPress={() => setShowPaymentModal(true)}
            />
          )}

          {/* PROGRESS TRACKER */}
          <View style={{ marginTop: 24, paddingHorizontal: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* Bulatan 1: Bayar */}
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: currentStep >= 1 ? "#10b981" : "#d1d5db",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {currentStep > 1 ? (
                  <Text
                    style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}
                  >
                    ✓
                  </Text>
                ) : (
                  <Text style={{ color: "#fff", fontSize: 10 }}>1</Text>
                )}
              </View>
              {/* Garis 1 */}
              <View
                style={{
                  flex: 1,
                  height: 3,
                  backgroundColor: currentStep >= 2 ? "#10b981" : "#d1d5db",
                }}
              />
              {/* Bulatan 2: Konfirmasi */}
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor:
                    currentStep === 2
                      ? "#f59e0b"
                      : currentStep > 2
                      ? "#10b981"
                      : "#d1d5db",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {currentStep > 2 ? (
                  <Text
                    style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}
                  >
                    ✓
                  </Text>
                ) : (
                  <Text style={{ color: "#fff", fontSize: 10 }}>2</Text>
                )}
              </View>
              {/* Garis 2 */}
              <View
                style={{
                  flex: 1,
                  height: 3,
                  backgroundColor: currentStep >= 3 ? "#10b981" : "#d1d5db",
                }}
              />
              {/* Bulatan 3: Jadwal Tes */}
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: currentStep === 3 ? "#10b981" : "#d1d5db",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontSize: 10 }}>3</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: currentStep >= 1 ? "#10b981" : "#6b7280",
                  fontWeight: currentStep === 1 ? "700" : "400",
                  width: 60,
                  textAlign: "center",
                }}
              >
                Bayar
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color:
                    currentStep === 2
                      ? "#f59e0b"
                      : currentStep > 2
                      ? "#10b981"
                      : "#6b7280",
                  fontWeight: currentStep === 2 ? "700" : "400",
                  width: 80,
                  textAlign: "center",
                }}
              >
                Konfirmasi
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: currentStep === 3 ? "#10b981" : "#6b7280",
                  fontWeight: currentStep === 3 ? "700" : "400",
                  width: 60,
                  textAlign: "center",
                }}
              >
                Jadwal Tes
              </Text>
            </View>
          </View>

          {/* PESAN JIKA SUDAH KONFIRMASI */}
          {isConfirmed && (
            <View
              style={{
                marginTop: 20,
                padding: 12,
                backgroundColor: "#ecfdf5",
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#10b981",
              }}
            >
              <Text
                style={{
                  color: "#065f46",
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                Dikonfirmasi! ✓
              </Text>
              <Text
                style={{
                  color: "#065f46",
                  fontSize: 12,
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                Pembayaran Anda telah diverifikasi. Silakan cek menu jadwal tes
                secara berkala.
              </Text>
            </View>
          )}
        </View>

        {/* MODAL PEMBAYARAN */}
        <Modal
          visible={showPaymentModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPaymentModal(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <View
              style={{ backgroundColor: "#fff", borderRadius: 12, padding: 20 }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "700", marginBottom: 16 }}
              >
                Form Pembayaran
              </Text>
              <Text style={{ color: "#6b7280", marginBottom: 4 }}>
                Pilih Bank Tujuan
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 8,
                  marginBottom: 12,
                  overflow: "hidden",
                }}
              >
                <Picker
                  selectedValue={bank}
                  onValueChange={(v) => setBank(String(v))}
                >
                  <Picker.Item label="-- Pilih Bank --" value="" />
                  {BANKS.map((b) => (
                    <Picker.Item
                      key={b.value}
                      label={b.label}
                      value={b.value}
                    />
                  ))}
                </Picker>
              </View>
              {bank ? (
                <View
                  style={{
                    backgroundColor: "#f3f4f6",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                >
                  <Text style={{ fontSize: 12, color: "#6b7280" }}>
                    Nomor Rekening Tujuan:
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                      color: "#b91c1c",
                    }}
                  >
                    {BANKS.find((b) => b.value === bank)?.norek}
                  </Text>
                </View>
              ) : null}
              <Text style={{ color: "#6b7280", marginBottom: 8 }}>
                Upload Bukti (Gambar)
              </Text>
              <Pressable
                onPress={pickImage}
                style={{
                  borderWidth: 1,
                  borderStyle: "dashed",
                  borderColor: "#d1d5db",
                  borderRadius: 8,
                  padding: 20,
                  alignItems: "center",
                  backgroundColor: "#f9fafb",
                }}
              >
                <Text style={{ color: "#4b5563" }}>
                  {buktiUri ? "✓ Gambar Terpilih" : "Pilih dari Galeri"}
                </Text>
              </Pressable>
              {buktiUri && (
                <Image
                  source={{ uri: buktiUri }}
                  style={{
                    width: "100%",
                    height: 150,
                    borderRadius: 8,
                    marginTop: 12,
                  }}
                  resizeMode="contain"
                />
              )}
              <View style={{ flexDirection: "row", marginTop: 20, gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <AppButton
                    title="Kirim Bukti"
                    onPress={handleSubmitPayment}
                    loading={uploading}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <AppButton
                    title="Batal"
                    onPress={() => setShowPaymentModal(false)}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}
