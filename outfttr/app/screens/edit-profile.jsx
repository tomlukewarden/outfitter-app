import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ThemeContext } from "../screens/utility/themeContext";
import { supabase } from "../screens/utility/supabaseClient"; 
import { useRouter } from "expo-router";

export default function EditProfile() {
  const { themeColors } = useContext(ThemeContext);
  const router = useRouter();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.user) {
        Alert.alert("Error", "User not found.");
        setLoading(false);
        return;
      }

      const userId = user.user.id;

      const { data, error } = await supabase
        .from("profiles") 
        .select("full_name, bio, avatar_url")
        .eq("id", userId)
        .single();

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        setName(data.full_name || "");
        setBio(data.bio || "");
        setProfileImage(data.avatar_url || "");
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
  
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.user) {
      Alert.alert("Error", "No user logged in.");
      setLoading(false);
      return;
    }
  
    const userId = user.user.id;
  
    // Update only the profiles table (remove users table update)
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        full_name: name,
        bio: bio,
        avatar_url: profileImage,
      });
  
    if (profileError) {
      console.error("Profile Update Error:", profileError);
      Alert.alert("Error", `Profile Update Error: ${profileError.message}`);
    } else {
      Alert.alert("Success", "Profile updated successfully!");
      router.push("/screens/profile");
    }
  
    setLoading(false);
  };
  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (imageUri) => {
    setUploading(true);

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.user) {
      Alert.alert("Error", "User not found.");
      setUploading(false);
      return;
    }

    const userId = user.user.id;
    const fileName = `avatars/${userId}.jpg`;

    const response = await fetch(imageUri);
    const blob = await response.blob();

    const { data, error } = await supabase.storage
      .from("profile_pictures")
      .upload(fileName, blob, { upsert: true });

    if (error) {
      Alert.alert("Upload Error", error.message);
    } else {
      const { data: publicUrl } = supabase.storage
        .from("profile_pictures")
        .getPublicUrl(fileName);

      setProfileImage(publicUrl.publicUrl);
    }

    setUploading(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.header, { color: themeColors.text }]}>Edit Profile</Text>

      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{ uri: profileImage || 'https://via.placeholder.com/100' }}
          style={[styles.profileImage, { borderColor: themeColors.tint }]}
        />
        {uploading && <ActivityIndicator size="small" color={themeColors.tint} />}
      </TouchableOpacity>

      <TextInput
        style={[styles.input, { borderColor: themeColors.icon, color: themeColors.text, backgroundColor: themeColors.inputBackground }]}
        value={name}
        onChangeText={setName}
        placeholder="Name"
        placeholderTextColor={themeColors.icon}
      />

      <TextInput
        style={[styles.input, { borderColor: themeColors.icon, color: themeColors.text, backgroundColor: themeColors.inputBackground }]}
        value={bio}
        onChangeText={setBio}
        placeholder="Bio"
        placeholderTextColor={themeColors.icon}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: themeColors.tint }]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={[styles.buttonText, { color: themeColors.background }]}>
          {loading ? "Saving..." : "Save"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 15,
    fontSize: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
  },
  button: {
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});