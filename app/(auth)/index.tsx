// app/(auth)/index.tsx
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import AppButton from "../../components/ui/AppButton";

export default function AuthLanding() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
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
            SISTEM PPDB SMK LETRIS 2
          </Text>
        </View>
      </View>

      <View
        style={{ flex: 1, paddingHorizontal: 16, justifyContent: "center" }}
      >
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
