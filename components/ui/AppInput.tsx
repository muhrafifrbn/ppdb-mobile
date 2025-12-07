// components/ui/AppInput.tsx
import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

export default function AppInput(props: TextInputProps) {
  return (
    <TextInput
      {...props}
      style={[styles.input, props.multiline && styles.multiline, props.style]}
      placeholderTextColor="#9ca3af"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: "white",
    fontSize: 14,
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: "top",
  },
});
