import React, { useContext } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ThemeContext } from "../utility/themeContext";
import { Colors } from "../../../constants/Colors";

const Settings = () => {
  const { theme, changeTheme, themeColors } = useContext(ThemeContext);
  const router = useRouter();

  const handleLogout = () => {
    router.replace("/screens/login"); // Redirect to Login page
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}> 
      <Text style={[styles.title, { color: themeColors.text }]}>Settings</Text>
      
      <Text style={[styles.optionText, { color: themeColors.text }]}>Select Theme</Text>
      <View style={styles.themeOptionsContainer}>
        {Object.keys(Colors).map((mode) => (
          <Pressable 
            key={mode} 
            style={[styles.themeButton, theme === mode && styles.selectedThemeButton]} 
            onPress={() => changeTheme(mode)}
          >
            <Text style={[styles.themeButtonText, { color: themeColors.text }]}> 
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
      
      <Pressable style={[styles.button, { backgroundColor: themeColors.button }]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
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
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Settings;
