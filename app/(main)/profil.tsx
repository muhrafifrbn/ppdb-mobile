import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useStudentData } from "../../context/StudentContext";

export default function ProfilScreen() {
  const { logout } = useAuth();
  const { student } = useStudentData();

  const handleLogout = () => {
    Alert.alert("Konfirmasi", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      { text: "Ya, Keluar", onPress: logout, style: "destructive" },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 24,
          paddingTop: 60,
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#1f2937" }}>
          Akun
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
        {/* INFO USER */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <View
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              backgroundColor: "#f3f4f6",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 16,
              borderWidth: 1,
              borderColor: "#d1d5db",
            }}
          >
            <Ionicons name="person" size={32} color="#9ca3af" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ color: "#9ca3af", fontSize: 14 }}>
              Selamat Datang,
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#1f2937",
                marginTop: 2,
              }}
              numberOfLines={2}
            >
              {student?.nama_lengkap || "Siswa"}
            </Text>
            <Text
              style={{
                color: "#b91c1c",
                fontSize: 13,
                marginTop: 4,
                fontWeight: "600",
              }}
            >
              {student?.jurusan_dipilih || "-"}
            </Text>
          </View>
        </View>

        {/* LIST MENU */}
        <View>
          {/* Menu 1: Data Formulir */}
          <MenuItem
            icon="document-text-outline"
            label="Data Formulir"
            onPress={() => router.push("/(main)/data-formulir")}
            color="#d97706" // Amber
          />

          <View
            style={{ height: 1, backgroundColor: "#f3f4f6", marginVertical: 8 }}
          />

          {/* Menu 2: Visi Misi */}
          <MenuItem
            icon="rocket-outline"
            label="Visi dan Misi"
            onPress={() =>
              Alert.alert("Info", "Fitur Visi Misi akan segera hadir.")
            }
            color="#6366f1" // Indigo
          />

          <View
            style={{ height: 1, backgroundColor: "#f3f4f6", marginVertical: 8 }}
          />

          {/* Menu 3: Keluar */}
          <MenuItem
            icon="log-out-outline"
            label="Keluar Aplikasi"
            onPress={handleLogout}
            color="#ef4444"
          />
        </View>
      </ScrollView>
    </View>
  );
}

// Komponen Item Menu
function MenuItem({
  icon,
  label,
  onPress,
  color = "#333",
}: {
  icon: any;
  label: string;
  onPress: () => void;
  color?: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 18,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: color + "15",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 16,
        }}
      >
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text
        style={{ flex: 1, fontSize: 16, fontWeight: "600", color: "#374151" }}
      >
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
    </TouchableOpacity>
  );
}
