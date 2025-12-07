// components/ui/AppButton.tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
};

export default function AppButton({ title, onPress, loading }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, loading && { opacity: 0.7 }]}
      onPress={onPress}
      disabled={loading}
    >
      <Text style={styles.text}>{loading ? "Loading..." : title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: "#dc2626",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
