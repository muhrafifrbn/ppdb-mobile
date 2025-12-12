// app/(main)/index.tsx
import Loading from "@/components/Loading";
import React from "react";
import { Image, RefreshControl, ScrollView, Text, View } from "react-native";
import { useStudentData } from "../../context/StudentContext"; // 1. Import Context

export default function Dashboard() {
  // 2. Ambil data, loading status, dan fungsi refresh dari Context
  const { student, loading, refreshStudent } = useStudentData();

  // Jika sedang loading awal dan data belum ada, tampilkan spinner
  if (loading && !student) {
    return <Loading />;
  }

  return (
    // 3. Gunakan ScrollView agar bisa Pull-to-Refresh
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refreshStudent} />
      }
    >
      {/* HEADER */}
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
            source={require("@/assets/images/logo-letris-removebg.png")}
            style={{ width: 48, height: 48, marginRight: 10 }}
            resizeMode="contain"
          />
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            SISTEM PPDB SMK LETRIS 2
          </Text>
        </View>
      </View>

      {/* CONTENT */}
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
            Selamat datang
          </Text>

          {/* 4. Tampilkan Data dari Context */}
          <Text style={{ fontSize: 18, marginBottom: 16 }}>
            {student?.nama_lengkap ?? "Calon Siswa"}
          </Text>

          <View
            style={{ height: 1, backgroundColor: "#e5e7eb", marginVertical: 8 }}
          />

          <Text style={{ color: "#6b7280" }}>Nomor Pendaftaran</Text>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>
            {student?.nomor_formulir ?? "-"}
          </Text>

          <Text style={{ color: "#6b7280" }}>Jurusan</Text>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            {student?.jurusan_dipilih ?? "-"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
