// app/(auth)/index.tsx
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import AppButton from "../../components/ui/AppButton";

export default function AuthLanding() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "#b91c1c",
          height: 120,
          borderBottomLeftRadius: 120,
          borderBottomRightRadius: 120,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>
          SISTEM PPDB SMK LETRIS 2
        </Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 16, justifyContent: "center" }}>
        <Text style={{ textAlign: "center", marginBottom: 24 }}>
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
    </View>
  );
}
