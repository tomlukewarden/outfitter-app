import React, { useContext } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from "react-native";
import { ThemeContext } from "../screens/utility/themeContext";
import { useRouter } from "expo-router";

export default function EditProfile() {
  const { themeColors } = useContext(ThemeContext);
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.header, { color: themeColors.text }]}>Edit Profile</Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.tint }]} onPress={() => router.back()}>
        <Text style={[styles.buttonText, { color: themeColors.background }]}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  button: { padding: 10, borderRadius: 8, marginTop: 10 },
  buttonText: { fontSize: 16, fontWeight: "bold" },
});
