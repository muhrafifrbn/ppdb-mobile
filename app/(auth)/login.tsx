// app/(auth)/login.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";

import AppButton from "../../components/ui/AppButton";
import AppInput from "../../components/ui/AppInput";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { noPendaftaran } = useLocalSearchParams<{ noPendaftaran?: string }>();

  const [nomorFormulir, setNomorFormulir] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");

  const [loading, setLoading] = useState(false);

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

    try {
      setLoading(true);
      await login(nomorFormulir.trim(), tanggalLahir.trim());
      // Redirect ditangani di (auth)/_layout.tsx
    } catch (e: any) {
      Alert.alert("Login Gagal", e.message || "Nomor formulir tidak ditemukan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
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
          <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 8 }}>Login PPDB</Text>
          <Text style={{ color: "#6b7280" }}>Masukkan nomor formulir yang sudah diberikan saat pendaftaran.</Text>
        </View>

        <Text>Nomor Formulir PPDB</Text>
        <AppInput value={nomorFormulir} onChangeText={setNomorFormulir} autoCapitalize="characters" placeholder="Contoh: PPDB202412070001" />
        <Text>Tanngal Lahir</Text>
        <AppInput value={tanggalLahir} onChangeText={setTanggalLahir} autoCapitalize="characters" placeholder="2025-08-10" />

        <AppButton title="Masuk" onPress={handleSubmit} loading={loading} />

        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 12, color: "#6b7280" }}>Jika belum memiliki nomor formulir, silakan lakukan pendaftaran terlebih dahulu.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
