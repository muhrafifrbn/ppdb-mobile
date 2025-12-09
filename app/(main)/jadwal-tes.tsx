// app/(main)/jadwal-tes.tsx
import React from "react";
import { Text, View, Image } from "react-native";

export default function JadwalTes() {
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
        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
          Jadwal Tes PPDB
        </Text>
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
          
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>Tes Akademik</Text>
            <Text style={{ color: "#6b7280" }}>12 Januari 2025 • Ruang RPL 1</Text>
          </View>
          <View style={{ height: 1, backgroundColor: "#e5e7eb", marginVertical: 8 }} />
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>Wawancara</Text>
            <Text style={{ color: "#6b7280" }}>13 Januari 2025 • Ruang BK</Text>
          </View>
          <View style={{ height: 1, backgroundColor: "#e5e7eb", marginVertical: 8 }} />
          <View>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>Psikotes</Text>
            <Text style={{ color: "#6b7280" }}>14 Januari 2025 • Ruang Multimedia</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
