// app/(main)/jadwal-tes.tsx
import React from "react";
import { Text, View } from "react-native";

export default function JadwalTes() {
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
        Jadwal Tes PPDB
      </Text>

      <Text>• Tes Akademik - 12 Januari 2025 - Ruang RPL 1</Text>
      <Text>• Wawancara - 13 Januari 2025 - Ruang BK</Text>
      <Text>• Psikotes - 14 Januari 2025 - Ruang Multimedia</Text>
    </View>
  );
}
