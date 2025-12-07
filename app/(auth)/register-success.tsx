// app/(auth)/register-success.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import AppButton from "../../components/ui/AppButton";

export default function RegisterSuccess() {
  const { noPendaftaran } = useLocalSearchParams<{ noPendaftaran?: string }>();
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 8 }}>
        Pendaftaran Berhasil
      </Text>
      <Text style={{ marginBottom: 16 }}>Nomor pendaftaran Anda adalah:</Text>

      <View
        style={{
          padding: 16,
          borderRadius: 12,
          backgroundColor: "#fff",
          elevation: 3,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "800" }}>
          {noPendaftaran ?? "-"}
        </Text>
      </View>

      <Text style={{ textAlign: "center", marginBottom: 24 }}>
        Simpan nomor ini dan gunakan untuk login.
      </Text>

      <AppButton
        title="Login"
        onPress={() =>
          router.push({
            pathname: "/(auth)/login",
            params: { noPendaftaran },
          })
        }
      />
    </View>
  );
}
