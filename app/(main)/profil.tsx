// app/(main)/profil.tsx
import React from "react";
import { Text, View } from "react-native";
import AppButton from "../../components/ui/AppButton";
import { useAuth } from "../../context/AuthContext";

export default function Profil() {
  const { user, logout } = useAuth();

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 16 }}>
        Profil Calon Siswa
      </Text>

      <Text>Nama: {user?.nama}</Text>
      <Text>Nomor Pendaftaran: {user?.nomor_formulir}</Text>
      <Text>Jurusan: {user?.jurusan ?? "-"}</Text>

      <View style={{ marginTop: 24 }}>
        <AppButton title="Logout" onPress={logout} />
      </View>
    </View>
  );
}
