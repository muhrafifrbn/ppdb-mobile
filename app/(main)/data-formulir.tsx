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

// Konfigurasi opsi sesuai Enum Database
const JURUSAN_OPTIONS = [
  "AKUNTANSI KEUANGAN LEMBAGA",
  "BISNIS DARING PEMASARAN",
  "DESAIN KOMUNIKASI VISUAL",
  "MANAJEMEN PERKANTORAN DAN LAYANAN BISNIS",
  "PENGEMBANGAN PERANGKAT LUNAK DAN GIM",
  "TEKNIK JARINGAN KOMPUTER DAN TELEKOMUNIKASI",
];

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

export default function DataFormulirScreen() {
  const { student, updateStudent } = useStudentData();

  const [isEditing, setIsEditing] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // State Form Data
  const [formData, setFormData] = useState<Partial<StudentForm>>({});

  // Sinkronisasi data dari context ke state lokal
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

  const handleChange = (key: keyof StudentForm, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (event.type === "dismissed") return;

    const date = selectedDate || new Date();
    const iso = date.toISOString().split("T")[0];
    handleChange("tanggal_lahir", iso);
  };

  // Validasi Form sebelum simpan
  const validateForm = (): boolean => {
    const requiredFields: { key: keyof StudentForm; label: string }[] = [
      { key: "jurusan_dipilih", label: "Jurusan" },
      { key: "nama_lengkap", label: "Nama Lengkap" },
      { key: "tempat_lahir", label: "Tempat Lahir" },
      { key: "tanggal_lahir", label: "Tanggal Lahir" },
      { key: "jenis_kelamin", label: "Jenis Kelamin" },
      { key: "agama", label: "Agama" },
      { key: "alamat", label: "Alamat" },
      { key: "telepon", label: "No. Telepon" },
    ];

    for (const field of requiredFields) {
      const value = formData[field.key];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        Alert.alert("Validasi", `${field.label} wajib diisi.`);
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      Alert.alert("Format Salah", "Email tidak valid.");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoadingSave(true);
    try {
      await updateStudent(formData);
      Alert.alert("Sukses", "Data formulir berhasil diperbarui!");
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
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
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
        {/* === DATA AKADEMIK === */}
        <Text style={styles.sectionTitle}>Pilihan Jurusan</Text>
        <FormSelect
          label="Jurusan"
          selectedValue={formData.jurusan_dipilih}
          editable={isEditing}
          onValueChange={(val) => handleChange("jurusan_dipilih", val)}
          options={JURUSAN_OPTIONS.map((j) => ({ label: j, value: j }))}
        />

        <FormField
          label="Sekolah Asal"
          value={formData.sekolah_asal}
          editable={isEditing}
          onChangeText={(text) => handleChange("sekolah_asal", text)}
        />

        {/* === IDENTITAS DIRI === */}
        <View style={{ height: 16 }} />
        <Text style={styles.sectionTitle}>Identitas Diri</Text>

        <FormField
          label="Nama Lengkap"
          value={formData.nama_lengkap}
          editable={isEditing}
          onChangeText={(text) => handleChange("nama_lengkap", text)}
        />

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
                  {formData.tanggal_lahir || "YYYY-MM-DD"}
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
            { label: "LAKI-LAKI", value: "LAKI-LAKI" },
            { label: "PEREMPUAN", value: "PEREMPUAN" },
          ]}
        />

        <FormSelect
          label="Agama"
          selectedValue={formData.agama}
          editable={isEditing}
          onValueChange={(val) => handleChange("agama", val)}
          options={AGAMA_OPTIONS.map((a) => ({ label: a, value: a }))}
        />

        {/* === KONTAK & ALAMAT === */}
        <View style={{ height: 16 }} />
        <Text style={styles.sectionTitle}>Alamat & Kontak</Text>

        <FormField
          label="Alamat Lengkap"
          value={formData.alamat}
          editable={isEditing}
          multiline
          onChangeText={(text) => handleChange("alamat", text)}
        />

        <FormField
          label="No. Telepon / WA"
          value={formData.telepon}
          editable={isEditing}
          keyboardType="phone-pad"
          onChangeText={(text) => handleChange("telepon", text)}
        />

        <FormField
          label="Email"
          value={formData.email}
          editable={isEditing}
          keyboardType="email-address"
          onChangeText={(text) => handleChange("email", text)}
        />

        {/* === DATA ORANG TUA === */}
        <View style={{ height: 16 }} />
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

        {/* NOMOR FORMULIR (HIDDEN EDIT) */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>Nomor Formulir (Otomatis)</Text>
          <View style={[styles.readOnlyBox, { backgroundColor: "#f3f4f6" }]}>
            <Text style={[styles.readOnlyText, { color: "#9ca3af" }]}>
              {formData.nomor_formulir || "-"}
            </Text>
          </View>
        </View>
      </ScrollView>

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

// --- SUB-COMPONENTS ---

const FormField = ({
  label,
  value,
  editable,
  onChangeText,
  multiline,
  keyboardType,
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
        placeholder={`Isi ${label}`}
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
}: any) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={styles.label}>{label}</Text>
    {editable ? (
      <View style={[styles.input, { padding: 0 }]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={{ height: 50 }}
        >
          <Picker.Item label={`Pilih ${label}`} value="" color="#9ca3af" />
          {options.map((opt: any, i: number) => (
            <Picker.Item key={i} label={opt.label} value={opt.value} />
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
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#b91c1c",
    textTransform: "uppercase",
  },
  label: { fontSize: 13, color: "#6b7280", marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: "#1f2937",
  },
  readOnlyBox: {
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    minHeight: 45,
    justifyContent: "center",
  },
  readOnlyText: { fontSize: 15, color: "#4b5563" },
});
