// app/(main)/pengumuman.tsx
import React from "react";
import { Text, View } from "react-native";

export default function Pengumuman() {
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
        Pengumuman
      </Text>

      <Text>
        Pengumuman kelulusan akan diumumkan pada 20 Januari 2025 melalui
        aplikasi ini dan website resmi sekolah.
      </Text>
    </View>
  );
}
