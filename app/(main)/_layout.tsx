// app/(main)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import Loading from "../../components/Loading";
import { useAuth } from "../../context/AuthContext";
// 1. IMPORT STUDENT PROVIDER
import { StudentProvider } from "../../context/StudentContext";

export default function MainLayout() {
  const { isAuthenticated, loading } = useAuth();

  // Loading cek token (Auth)
  if (loading) return <Loading />;

  // Jika tidak ada token/login, tendang ke folder auth
  if (!isAuthenticated) return <Redirect href="/(auth)" />;

  return (
    // 2. BUNGKUS TABS DENGAN PROVIDER
    <StudentProvider>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Beranda",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="jadwal-tes"
          options={{
            title: "Jadwal Tes",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profil"
          options={{
            title: "Profil",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="person-circle-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="data-formulir"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </StudentProvider>
  );
}
