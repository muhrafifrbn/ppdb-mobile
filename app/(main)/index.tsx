// app/(main)/index.tsx
import React from "react";
import { Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 8 }}>
        Selamat datang,
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>
        {user?.nama ?? "Calon Siswa"}
      </Text>

      <Text style={{ marginBottom: 4 }}>
        Nomor Pendaftaran: {user?.noPendaftaran}
      </Text>
      <Text>Jurusan: {user?.jurusan ?? "-"}</Text>
    </View>
  );
}
