import DateTimePicker from "@react-native-community/datetimepicker"; // Menggunakan DateTimePicker biasa
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const { noPendaftaran } = useLocalSearchParams<{ noPendaftaran?: string }>();

  const [nomorFormulir, setNomorFormulir] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState(""); // Tanggal lahir dalam format string
  const [loading, setLoading] = useState(false);

  // For Date Picker
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Prefill dari register-success
  useEffect(() => {
    if (noPendaftaran && typeof noPendaftaran === "string") {
      setNomorFormulir(noPendaftaran);
    }
  }, [noPendaftaran]);

  const handleSubmit = async () => {
    if (!nomorFormulir.trim()) {
      Alert.alert("Validasi", "Masukkan nomor formulir PPDB.");
      return;
    }
    if (!tanggalLahir.trim()) {
      Alert.alert("Validasi", "Masukkan tanggal lahir.");
      return;
    }

    try {
      setLoading(true);
      await login(nomorFormulir.trim(), tanggalLahir.trim());
      // Redirect ditangani di (auth)/_layout.tsx
    } catch (e: any) {
      Alert.alert(
        "Login Gagal",
        "Nomor formulir atau tanggal lahir tidak ditemukan."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === "dismissed") return;
    const date = selectedDate || new Date();
    setTanggalLahir(date.toISOString().split("T")[0]); // Format tanggal menjadi 'yyyy-mm-dd'
    setShowDatePicker(false); // Close the picker
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        style={{ flex: 1, padding: 24 }}
        contentContainerStyle={{
          paddingBottom: 40,
          justifyContent: "center",
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 8 }}>
            Login PPDB
          </Text>
          <Text style={{ color: "#6b7280" }}>
            Masukkan nomor formulir yang sudah diberikan saat pendaftaran.
          </Text>
        </View>

        <Text>Nomor Formulir PPDB</Text>
        <AppInput
          value={nomorFormulir}
          onChangeText={setNomorFormulir}
          autoCapitalize="characters"
          placeholder="Contoh: PPDB202412070001"
        />

        <Text>Tanggal Lahir</Text>
        <Pressable onPress={() => setShowDatePicker(true)}>
          <AppInput
            value={tanggalLahir}
            placeholder="YYYY-MM-DD"
            editable={false} // Disable typing, but allow selection
            pointerEvents="none" // Prevent manual typing but allow focus
            style={{ backgroundColor: "#f3f4f6" }}
          />
        </Pressable>

        {/* DateTimePicker yang muncul ketika kolom input difokuskan */}
        {showDatePicker && (
          <DateTimePicker
            value={new Date(tanggalLahir || Date.now())} // Default to current date if no date is selected
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <AppButton title="Masuk" onPress={handleSubmit} loading={loading} />

        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 12, color: "#6b7280" }}>
            Jika belum memiliki nomor formulir, silakan lakukan pendaftaran
            terlebih dahulu.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
