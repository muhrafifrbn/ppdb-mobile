// app/(auth)/register.tsx
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import AppButton from "../../components/ui/AppButton";
import AppInput from "../../components/ui/AppInput";
import { registerPPDB } from "../../lib/api";

const JURUSAN_OPTIONS = [
  "AKUNTANSI KEUANGAN LEMBAGA",
  "BISNIS DARING PEMASARAN",
  "DESAIN KOMUNIKASI VISUAL",
  "MANAJEMEN PERKANTORAN DAN LAYANAN BISNIS",
  "PENGEMBANGAN PERANGKAT LUNAK DAN GIM",
  "TEKNIK JARINGAN KOMPUTER DAN TELEKOMUNIKASI",
];

const JENIS_KELAMIN_OPTIONS = ["LAKI-LAKI", "PEREMPUAN"];

const AGAMA_OPTIONS = [
  "ISLAM",
  "KRISTEN PROTESTAN",
  "KRISTEN KATOLIK",
  "HINDU",
  "BUDHA",
  "KONG HU CHU",
  "KEPERCAYAAN",
  "LAINNYA",
];

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [form, setForm] = useState({
    jurusan: "",
    nama_lengkap: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    agama: "",
    sekolah_asal: "",
    alamat: "",
    telepon: "",
    email: "",
    nama_ayah: "",
    nama_ibu: "",
  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Android: event.type === "dismissed" kalau batal
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (event.type === "dismissed") return;
    const date = selectedDate || new Date();
    const iso = date.toISOString().split("T")[0]; // YYYY-MM-DD
    handleChange("tanggal_lahir", iso);
  };

  const handleSubmit = async () => {
    if (
      !form.jurusan ||
      !form.nama_lengkap ||
      !form.tanggal_lahir ||
      !form.telepon
    ) {
      Alert.alert(
        "Validasi",
        "Jurusan, nama, tanggal lahir, dan telepon wajib diisi."
      );
      return;
    }

    try {
      setLoading(true);
      const result = await registerPPDB(form as any);

      router.push({
        pathname: "/(auth)/register-success",
        params: { noPendaftaran: result.noPendaftaran },
      });
    } catch (e: any) {
      Alert.alert("Gagal", e.message ?? "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >

        <View
          style={{
            width: "100%",
            borderRadius: 12,
            backgroundColor: "white",
            padding: 12,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          <View style={{ marginHorizontal: -12, marginTop: -12, marginBottom: 12 }}>
            <View
              style={{
                backgroundColor: "#b91c1c",
                height: 110,
                borderBottomLeftRadius: 110,
                borderBottomRightRadius: 110,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                  FORMULIR PENDAFTARAN SMK LETRIS 2
              </Text>
            </View>
          </View>

          <Text>Jurusan Yang Di Pilih</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 8,
              marginBottom: 12,
              overflow: "hidden",
              backgroundColor: "white",
            }}
          >
            <Picker
              selectedValue={form.jurusan}
              onValueChange={(value) => handleChange("jurusan", String(value))}
            >
              <Picker.Item label="Jurusan Yang Di Pilih" value="" />
              {JURUSAN_OPTIONS.map((j) => (
                <Picker.Item key={j} label={j} value={j} />
              ))}
            </Picker>
          </View>

          <Text>Nama Lengkap</Text>
          <AppInput
            value={form.nama_lengkap}
            onChangeText={(t) => handleChange("nama_lengkap", t)}
            placeholder="Nama Lengkap"
          />

          <Text>Alamat Anda</Text>
          <AppInput
            value={form.alamat}
            onChangeText={(t) => handleChange("alamat", t)}
            placeholder="Alamat Anda"
            multiline
          />

          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text>Tempat Lahir</Text>
              <AppInput
                value={form.tempat_lahir}
                onChangeText={(t) => handleChange("tempat_lahir", t)}
                placeholder="Tempat Lahir"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text>Tanggal Lahir</Text>
              <Pressable onPress={() => setShowDatePicker(true)}>
                <AppInput
                  value={form.tanggal_lahir}
                  placeholder="dd/mm/yy"
                  editable={false}
                  pointerEvents="none"
                  style={{ backgroundColor: "#f3f4f6" }}
                />
              </Pressable>
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={
                form.tanggal_lahir ? new Date(form.tanggal_lahir) : new Date()
              }
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
            />
          )}

          <Text>Jenis Kelamin</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 8,
              marginBottom: 12,
              overflow: "hidden",
              backgroundColor: "white",
            }}
          >
            <Picker
              selectedValue={form.jenis_kelamin}
              onValueChange={(value) =>
                handleChange("jenis_kelamin", String(value))
              }
            >
              <Picker.Item label="Jenis Kelamin" value="" />
              {JENIS_KELAMIN_OPTIONS.map((j) => (
                <Picker.Item key={j} label={j} value={j} />
              ))}
            </Picker>
          </View>

          <Text>Agama</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 8,
              marginBottom: 12,
              overflow: "hidden",
              backgroundColor: "white",
            }}
          >
            <Picker
              selectedValue={form.agama}
              onValueChange={(value) => handleChange("agama", String(value))}
            >
              <Picker.Item label="Agama" value="" />
              {AGAMA_OPTIONS.map((a) => (
                <Picker.Item key={a} label={a} value={a} />
              ))}
            </Picker>
          </View>

          <Text>Asal Sekolah</Text>
          <AppInput
            value={form.sekolah_asal}
            onChangeText={(t) => handleChange("sekolah_asal", t)}
            placeholder="Asal Sekolah"
          />

          <Text>No Telpon</Text>
          <AppInput
            value={form.telepon}
            onChangeText={(t) => handleChange("telepon", t)}
            placeholder="No Telpon"
            keyboardType="phone-pad"
          />

          <Text>Email</Text>
          <AppInput
            value={form.email}
            onChangeText={(t) => handleChange("email", t)}
            placeholder="Email"
            keyboardType="email-address"
          />

          <Text>Nama Ayah</Text>
          <AppInput
            value={form.nama_ayah}
            onChangeText={(t) => handleChange("nama_ayah", t)}
            placeholder="Nama Ayah"
          />

          <Text>Nama Ibu</Text>
          <AppInput
            value={form.nama_ibu}
            onChangeText={(t) => handleChange("nama_ibu", t)}
            placeholder="Nama Ibu"
          />

          <AppButton
            title="Daftar Sekarang"
            onPress={handleSubmit}
            loading={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
