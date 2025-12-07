// app/(auth)/index.tsx
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import AppButton from "../../components/ui/AppButton";

export default function AuthLanding() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
        Sistem PPDB SMK Letris 2
      </Text>
      <Text style={{ marginBottom: 32 }}>
        Apakah kamu sudah pernah mendaftar sebelumnya?
      </Text>

      <AppButton
        title="Belum, saya mau daftar"
        onPress={() => router.push("/(auth)/register")}
      />

      <View style={{ height: 12 }} />

      <AppButton
        title="Sudah punya nomor pendaftaran"
        onPress={() => router.push("/(auth)/login")}
      />
    </View>
  );
}
