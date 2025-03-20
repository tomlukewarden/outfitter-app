import React, { useContext, useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { ThemeContext } from "../utility/themeContext";
import { Colors } from "../../../constants/Colors";
import { supabase } from "../utility/supabaseClient"; 

const fonts = ["System", "Arial", "Courier New", "Times New Roman"];
const fontSizes = [14, 18, 22, 26];

const Settings = () => {
  const { theme, changeTheme, themeColors } = useContext(ThemeContext);
  const [font, setFont] = useState("System");
  const [fontSize, setFontSize] = useState(18);
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Logout Failed", error.message);
    } else {
      router.replace("/screens/login"); 
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
           <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Image source={require('../assets/back.png')} style={styles.icon} />
            </Pressable>
      <Text style={[styles.title, { color: themeColors.text, fontFamily: font, fontSize }]}>Settings</Text>

      {/* Theme Selection */}
      <Text style={[styles.optionText, { color: themeColors.text, fontFamily: font, fontSize }]}>
        Select Theme
      </Text>
      <View style={styles.themeOptionsContainer}>
        {Object.keys(Colors).map((mode) => (
          <Pressable 
            key={mode} 
            style={[styles.themeButton, theme === mode && styles.selectedThemeButton]} 
            onPress={() => changeTheme(mode)}
          >
            <Text style={[styles.themeButtonText, { color: themeColors.text, fontFamily: font, fontSize }]}> 
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Font Selection */}
      <Text style={[styles.optionText, { color: themeColors.text, fontFamily: font, fontSize }]}>
        Select Font
      </Text>
      <View style={styles.fontOptionsContainer}>
        {fonts.map((f) => (
          <Pressable key={f} style={styles.fontButton} onPress={() => setFont(f)}>
            <Text style={[styles.fontButtonText, { fontFamily: f, fontSize }]}>
              {f}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Font Size Selection */}
      <Text style={[styles.optionText, { color: themeColors.text, fontFamily: font, fontSize }]}>
        Select Font Size
      </Text>
      <View style={styles.fontOptionsContainer}>
        {fontSizes.map((size) => (
          <Pressable key={size} style={styles.fontSizeButton} onPress={() => setFontSize(size)}>
            <Text style={[styles.fontSizeButtonText, { fontSize: size }]}>
              {size}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Logout Button */}
      <Pressable style={[styles.button, { backgroundColor: themeColors.button }]} onPress={handleLogout}>
        <Text style={[styles.buttonText, { fontFamily: font, fontSize }]}>Log Out</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionText: {
    fontSize: 18,
    marginBottom: 10,
  },
  themeOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  themeButton: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: "#ddd",
  },
  selectedThemeButton: {
    backgroundColor: "#aaa",
  },
  themeButtonText: {
    fontSize: 16,
  },
  fontOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  fontButton: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: "#eee",
  },
  fontButtonText: {
    fontSize: 16,
  },
  fontSizeButton: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: "#ccc",
  },
  fontSizeButtonText: {
    fontSize: 16,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  icon: {
    width: 24,
    height: 24,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
});

export default Settings;
