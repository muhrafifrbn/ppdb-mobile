// app/(auth)/register-success.tsx
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, Text, View } from "react-native";
import AppButton from "../../components/ui/AppButton";

export default function RegisterSuccess() {
  const { noPendaftaran } = useLocalSearchParams<{ noPendaftaran?: string }>();
  const router = useRouter();

  const handleCopy = async () => {
    if (!noPendaftaran) return;
    await Clipboard.setStringAsync(String(noPendaftaran));
    Alert.alert("Disalin", "Nomor pendaftaran sudah disalin ke clipboard.");
  };

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
        <Text
          selectable
          style={{ fontSize: 24, fontWeight: "800", textAlign: "center" }}
        >
          {noPendaftaran ?? "-"}
        </Text>

        {noPendaftaran && (
          <Pressable
            onPress={handleCopy}
            style={{
              marginTop: 10,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: "#2563eb",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
              Salin Nomor
            </Text>
          </Pressable>
        )}
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
