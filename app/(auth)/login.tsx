// app/(auth)/login.tsx
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import AppButton from "../../components/ui/AppButton";
import AppInput from "../../components/ui/AppInput";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const params = useLocalSearchParams<{ noPendaftaran?: string }>();
  const [noPendaftaran, setNoPendaftaran] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.noPendaftaran) {
      setNoPendaftaran(String(params.noPendaftaran));
    }
  }, [params.noPendaftaran]);

  const handleLogin = async () => {
    if (!noPendaftaran) {
      Alert.alert("Validasi", "Isi nomor pendaftaran terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);
      await login(noPendaftaran.trim());
    } catch (e: any) {
      Alert.alert("Login gagal", e.message ?? "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
        Login PPDB
      </Text>

      <Text>Nomor Pendaftaran</Text>
      <AppInput
        value={noPendaftaran}
        onChangeText={setNoPendaftaran}
        keyboardType="default"
      />

      <AppButton title="Masuk" onPress={handleLogin} loading={loading} />
    </View>
  );
}
