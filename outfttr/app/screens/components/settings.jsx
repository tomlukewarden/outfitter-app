import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";
import { Colors } from "../../../constants/Colors";

const Settings = () => {
  const [selectedTheme, setSelectedTheme] = useState("light");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme) {
        setSelectedTheme(storedTheme);
      }
    };
    loadTheme();
  }, []);

  const changeTheme = async (theme) => {
    setSelectedTheme(theme);
    await AsyncStorage.setItem("theme", theme);
  };

  const handleLogout = () => {
    router.replace("/screens/login");
  };

  const themeColors = Colors[selectedTheme] || Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>Settings</Text>

      <Text style={[styles.optionText, { color: themeColors.text }]}>Select Theme</Text>
      <DropDownPicker
        open={open}
        value={selectedTheme}
        items={Object.keys(Colors).map((theme) => ({
          label: theme.charAt(0).toUpperCase() + theme.slice(1),
          value: theme,
        }))}
        setOpen={setOpen}
        setValue={setSelectedTheme}
        onChangeValue={changeTheme}
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        textStyle={{ color: themeColors.text }}
      />

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
  dropdownContainer: {
    width: 200,
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: "#fff",
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
