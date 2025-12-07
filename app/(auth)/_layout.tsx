// app/(auth)/_layout.tsx
import { Redirect, Stack } from "expo-router";
import React from "react";
import Loading from "../../components/Loading";
import { useAuth } from "../../context/AuthContext";

export default function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading />;

  if (isAuthenticated) {
    return <Redirect href="/(main)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="register-success" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
