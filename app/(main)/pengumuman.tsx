// app/(main)/pengumuman.tsx
import React from "react";
import { Text, View, Image } from "react-native";

export default function Pengumuman() {
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

      <View style={{ flex: 1, padding: 16 }}>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 16,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 8 }}>
            Pengumuman Kelulusan
          </Text>
          <Text style={{ color: "#6b7280", marginBottom: 12 }}>
            20 Januari 2025
          </Text>
          <Text>
            Pengumuman kelulusan akan diumumkan melalui aplikasi ini dan website resmi sekolah.
          </Text>
        </View>
      </View>
    </View>
  );
}
