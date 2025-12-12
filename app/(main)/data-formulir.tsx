import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StudentForm, useStudentData } from "../../context/StudentContext";

export default function DataFormulirScreen() {
  const { student, updateStudent } = useStudentData();

  const [isEditing, setIsEditing] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  // State untuk Date Picker
  const [showDatePicker, setShowDatePicker] = useState(false);

  // State Form Data
  const [formData, setFormData] = useState<Partial<StudentForm>>({});

  // 1. FIX TANGGAL SAAT LOAD DATA (Hapus jam/menit ISO)
  useEffect(() => {
    if (student) {
      let cleanDate = student.tanggal_lahir;
      if (cleanDate && cleanDate.includes("T")) {
        cleanDate = cleanDate.split("T")[0];
      }
      setFormData({
        ...student,
        tanggal_lahir: cleanDate,
      });
    }
  }, [student]);

  // Handler Change Umum
  const handleChange = (key: keyof StudentForm, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Handler Date Picker
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (event.type === "dismissed") return;

    const date = selectedDate || new Date();
    const iso = date.toISOString().split("T")[0];
    handleChange("tanggal_lahir", iso);
  };

  // ==========================================
  // 2. LOGIKA VALIDASI LENGKAP
  // ==========================================
  const validateForm = (): boolean => {
    // A. Daftar field yang Wajib Diisi
    const requiredFields: { key: keyof StudentForm; label: string }[] = [
      { key: "nama_lengkap", label: "Nama Lengkap" },
      { key: "tempat_lahir", label: "Tempat Lahir" },
      { key: "tanggal_lahir", label: "Tanggal Lahir" },
      { key: "jenis_kelamin", label: "Jenis Kelamin" },
      { key: "agama", label: "Agama" },
      { key: "alamat", label: "Alamat Domisili" },
      { key: "email", label: "Email" },
      { key: "telepon", label: "No. Telepon" },
      { key: "nama_ayah", label: "Nama Ayah" },
      { key: "nama_ibu", label: "Nama Ibu" },
      { key: "sekolah_asal", label: "Sekolah Asal" },
      { key: "jurusan_dipilih", label: "Jurusan" },
    ];

    // B. Loop cek kekosongan
    for (const field of requiredFields) {
      const value = formData[field.key];
      // Cek jika undefined, null, atau string kosong setelah di-trim
      if (!value || (typeof value === "string" && value.trim() === "")) {
        Alert.alert(
          "Data Belum Lengkap",
          `Mohon isi bagian "${field.label}" terlebih dahulu.`
        );
        return false; // Validasi gagal
      }
    }

    // C. Validasi Format Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      Alert.alert(
        "Format Salah",
        "Format email tidak valid. Harap periksa kembali."
      );
      return false; // Validasi gagal
    }

    return true; // Semua lolos
  };

  // ==========================================
  // 3. SIMPAN DATA
  // ==========================================
  const handleSave = async () => {
    // Jalankan validasi sebelum simpan
    if (!validateForm()) {
      return; // Stop jika validasi gagal
    }

    setLoadingSave(true);
    try {
      await updateStudent(formData);
      Alert.alert("Sukses", "Data berhasil diperbarui!");
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Gagal", "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {isEditing ? "Edit Formulir" : "Data Formulir"}
        </Text>

        <TouchableOpacity
          onPress={() => {
            if (isEditing) handleSave();
            else setIsEditing(true);
          }}
          disabled={loadingSave}
        >
          {loadingSave ? (
            <ActivityIndicator size="small" color="#b91c1c" />
          ) : (
            <Text
              style={[
                styles.actionText,
                { color: isEditing ? "#b91c1c" : "#d97706" },
              ]}
            >
              {isEditing ? "Simpan" : "Edit"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 50 }}>
        {/* === IDENTITAS DIRI === */}
        <Text style={styles.sectionTitle}>Identitas Diri</Text>

        <FormField
          label="Nama Lengkap"
          value={formData.nama_lengkap}
          editable={isEditing}
          onChangeText={(text) => handleChange("nama_lengkap", text)}
        />

        {/* Row Tempat & Tanggal Lahir */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <FormField
              label="Tempat Lahir"
              value={formData.tempat_lahir}
              editable={isEditing}
              onChangeText={(text) => handleChange("tempat_lahir", text)}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Tgl Lahir</Text>
            {isEditing ? (
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: "#1f2937" }}>
                  {formData.tanggal_lahir || "Pilih Tanggal"}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.readOnlyBox}>
                <Text style={styles.readOnlyText}>
                  {formData.tanggal_lahir || "-"}
                </Text>
              </View>
            )}
          </View>
        </View>

        <FormSelect
          label="Jenis Kelamin"
          selectedValue={formData.jenis_kelamin}
          editable={isEditing}
          onValueChange={(val) => handleChange("jenis_kelamin", val)}
          options={[
            { label: "Laki-laki", value: "LAKI-LAKI" },
            { label: "Perempuan", value: "PEREMPUAN" },
          ]}
        />

        <FormSelect
          label="Agama"
          selectedValue={formData.agama}
          editable={isEditing}
          onValueChange={(val) => handleChange("agama", val)}
          options={[
            { label: "Islam", value: "ISLAM" },
            { label: "Kristen Protestan", value: "KRISTEN PROTESTAN" },
            { label: "Kristen Katolik", value: "KRISTEN KATOLIK" },
            { label: "Hindu", value: "HINDU" },
            { label: "Buddha", value: "BUDDHA" },
            { label: "Konghucu", value: "KONGHUCU" },
          ]}
        />

        <FormField
          label="Alamat Domisili"
          value={formData.alamat}
          editable={isEditing}
          multiline
          onChangeText={(text) => handleChange("alamat", text)}
        />

        <FormField
          label="Email"
          value={formData.email}
          editable={isEditing}
          keyboardType="email-address"
          onChangeText={(text) => handleChange("email", text)}
        />

        <FormField
          label="No. Telepon / WA"
          value={formData.telepon}
          editable={isEditing}
          keyboardType="phone-pad"
          onChangeText={(text) => handleChange("telepon", text)}
        />

        {/* === DATA ORANG TUA === */}
        <View style={{ height: 24 }} />
        <Text style={styles.sectionTitle}>Data Orang Tua</Text>

        <FormField
          label="Nama Ayah"
          value={formData.nama_ayah}
          editable={isEditing}
          onChangeText={(text) => handleChange("nama_ayah", text)}
        />

        <FormField
          label="Nama Ibu"
          value={formData.nama_ibu}
          editable={isEditing}
          onChangeText={(text) => handleChange("nama_ibu", text)}
        />

        {/* === DATA AKADEMIK === */}
        <View style={{ height: 24 }} />
        <Text style={styles.sectionTitle}>Data Akademik</Text>

        <FormSelect
          label="Jurusan Pilihan"
          selectedValue={formData.jurusan_dipilih}
          editable={isEditing}
          onValueChange={(val) => handleChange("jurusan_dipilih", val)}
          options={[
            {
              label: "AKUNTANSI KEUANGAN LEMBAGA",
              value: "AKUNTANSI KEUANGAN LEMBAGA",
            },
            {
              label: "BISNIS DARING PEMASARAN",
              value: "BISNIS DARING PEMASARAN",
            },
            {
              label: "OTOMATISASI TATA KELOLA PERKANTORAN",
              value: "OTOMATISASI TATA KELOLA PERKANTORAN",
            },
            { label: "MULTIMEDIA", value: "MULTIMEDIA" },
            {
              label: "REKAYASA PERANGKAT LUNAK",
              value: "REKAYASA PERANGKAT LUNAK",
            },
            {
              label: "TEKNIK KOMPUTER DAN JARINGAN",
              value: "TEKNIK KOMPUTER DAN JARINGAN",
            },
          ]}
        />

        <FormField
          label="Sekolah Asal"
          value={formData.sekolah_asal}
          editable={isEditing}
          onChangeText={(text) => handleChange("sekolah_asal", text)}
        />

        {/* READ ONLY: NOMOR FORMULIR */}
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Nomor Pendaftaran (Tetap)</Text>
          <View
            style={[
              styles.readOnlyBox,
              { backgroundColor: "#f3f4f6", borderColor: "#e5e7eb" },
            ]}
          >
            <Text style={[styles.readOnlyText, { color: "#9ca3af" }]}>
              {formData.nomor_formulir || "-"}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* COMPONENT: DATE PICKER MODAL */}
      {showDatePicker && (
        <DateTimePicker
          value={
            formData.tanggal_lahir
              ? new Date(formData.tanggal_lahir)
              : new Date()
          }
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
}

// HELPER COMPONENTS

const FormField = ({
  label,
  value,
  editable,
  onChangeText,
  multiline = false,
  keyboardType = "default",
}: any) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={styles.label}>{label}</Text>
    {editable ? (
      <TextInput
        style={[
          styles.input,
          multiline && { height: 80, textAlignVertical: "top" },
        ]}
        value={value || ""}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        placeholder={`Masukkan ${label}`}
        placeholderTextColor="#9ca3af"
      />
    ) : (
      <View style={styles.readOnlyBox}>
        <Text style={styles.readOnlyText}>{value || "-"}</Text>
      </View>
    )}
  </View>
);

const FormSelect = ({
  label,
  selectedValue,
  editable,
  onValueChange,
  options,
}: {
  label: string;
  selectedValue: any;
  editable: boolean;
  onValueChange: (val: any) => void;
  options: { label: string; value: string }[];
}) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>
      {editable ? (
        <View style={[styles.input, { padding: 0, justifyContent: "center" }]}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            style={{ height: 50, width: "100%" }}
            dropdownIconColor="#1f2937"
          >
            <Picker.Item label={`Pilih ${label}`} value="" color="#9ca3af" />
            {options.map((opt, index) => (
              <Picker.Item
                key={index}
                label={opt.label}
                value={opt.value}
                style={{ fontSize: 14 }}
              />
            ))}
          </Picker>
        </View>
      ) : (
        <View style={styles.readOnlyBox}>
          <Text style={styles.readOnlyText}>{selectedValue || "-"}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1f2937" },
  backButton: { padding: 4 },
  actionText: { fontSize: 16, fontWeight: "700" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#b91c1c",
  },
  label: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#1f2937",
    backgroundColor: "#fff",
  },
  readOnlyBox: {
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    minHeight: 48,
    justifyContent: "center",
  },
  readOnlyText: { fontSize: 16, color: "#4b5563", fontWeight: "500" },
});
