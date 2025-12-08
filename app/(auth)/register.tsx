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
import { Image } from "react-native";

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
        "Jurusan, nama lengkap, tanggal lahir, dan telepon wajib diisi."
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        jurusan_dipilih: form.jurusan,
        nama_lengkap: form.nama_lengkap,
        tempat_lahir: form.tempat_lahir,
        tanggal_lahir: form.tanggal_lahir,
        jenis_kelamin: form.jenis_kelamin,
        agama: form.agama,
        sekolah_asal: form.sekolah_asal,
        alamat: form.alamat,
        telepon: form.telepon,
        email: form.email,
        nama_ayah: form.nama_ayah,
        nama_ibu: form.nama_ibu,
      };

      const result = await registerPPDB(payload);

      router.push({
        pathname: "/(auth)/register-success",
        params: { noPendaftaran: result.nomor_formulir },
      });
    } catch (e: any) {
      Alert.alert("Gagal", e.message ?? "Terjadi kesalahan saat mendaftar");
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
        style={{ flex: 1, padding: 24 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ marginHorizontal: -24, marginTop: -24, marginBottom: 16 }}>
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
                  FORSMK LETRIS 2
              </Text>
            </View>
          </View>
        </View>

        {/* JURUSAN DIPILIH */}
        <Text>Jurusan Dipilih</Text>
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
            <Picker.Item label="Pilih jurusan" value="" />
            {JURUSAN_OPTIONS.map((j) => (
              <Picker.Item key={j} label={j} value={j} />
            ))}
          </Picker>
        </View>

        {/* NAMA LENGKAP */}
        <Text>Nama Lengkap</Text>
        <AppInput
          value={form.nama_lengkap}
          onChangeText={(t) => handleChange("nama_lengkap", t)}
        />

        {/* TEMPAT LAHIR */}
        <Text>Tempat Lahir</Text>
        <AppInput
          value={form.tempat_lahir}
          onChangeText={(t) => handleChange("tempat_lahir", t)}
        />

        {/* TANGGAL LAHIR */}
        <Text>Tanggal Lahir</Text>
        <Pressable onPress={() => setShowDatePicker(true)}>
          <AppInput
            value={form.tanggal_lahir}
            placeholder="YYYY-MM-DD"
            editable={false}
            pointerEvents="none"
            style={{ backgroundColor: "#f3f4f6" }}
          />
        </Pressable>

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

        {/* JENIS KELAMIN */}
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
            <Picker.Item label="Pilih jenis kelamin" value="" />
            {JENIS_KELAMIN_OPTIONS.map((j) => (
              <Picker.Item key={j} label={j} value={j} />
            ))}
          </Picker>
        </View>

        {/* AGAMA */}
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
            <Picker.Item label="Pilih agama" value="" />
            {AGAMA_OPTIONS.map((a) => (
              <Picker.Item key={a} label={a} value={a} />
            ))}
          </Picker>
        </View>

        {/* SEKOLAH ASAL */}
        <Text>Sekolah Asal</Text>
        <AppInput
          value={form.sekolah_asal}
          onChangeText={(t) => handleChange("sekolah_asal", t)}
        />

        {/* ALAMAT */}
        <Text>Alamat Tempat Tinggal</Text>
        <AppInput
          value={form.alamat}
          onChangeText={(t) => handleChange("alamat", t)}
          multiline
        />

        {/* TELEPON */}
        <Text>No Telepon / HP</Text>
        <AppInput
          value={form.telepon}
          onChangeText={(t) => handleChange("telepon", t)}
          keyboardType="phone-pad"
        />

        {/* EMAIL */}
        <Text>Email</Text>
        <AppInput
          value={form.email}
          onChangeText={(t) => handleChange("email", t)}
          keyboardType="email-address"
        />

        {/* NAMA AYAH */}
        <Text>Nama Ayah</Text>
        <AppInput
          value={form.nama_ayah}
          onChangeText={(t) => handleChange("nama_ayah", t)}
        />

        {/* NAMA IBU */}
        <Text>Nama Ibu</Text>
        <AppInput
          value={form.nama_ibu}
          onChangeText={(t) => handleChange("nama_ibu", t)}
        />

        <AppButton
          title="Daftar Sekarang"
          onPress={handleSubmit}
          loading={loading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
