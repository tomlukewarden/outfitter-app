import React, { useState, useEffect, useContext, useCallback } from "react";
import { 
  StyleSheet, Text, Image, View, SafeAreaView, Pressable, ActivityIndicator, Platform 
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native"; 
import * as ImagePicker from 'expo-image-picker';
import Carousel from "./components/cardCarousel";
import { supabase } from "../utility/supabaseClient"; 
import { useAuth } from "../utility/useAuthSession"; 
import { ThemeContext } from "./utility/themeContext";

export default function Swipe() {
  const router = useRouter();
  const { themeColors } = useContext(ThemeContext);
  const { user } = useAuth(); // Access the authenticated user
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchWardrobe = async () => {
    if (!user) return; // If user is not authenticated, do nothing
    try {
      const { data, error } = await supabase
        .from("wardrobe")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      const grouped = data.reduce((acc, item) => {
        if (!item.type || !item.image_url) {
          console.error("Item missing 'type' or 'image_url':", item);
          return acc;
        }
        if (!acc[item.type]) {
          acc[item.type] = [];
        }
        acc[item.type].push(item);
        return acc;
      }, {});

      setGroupedData(grouped);
    } catch (error) {
      console.error("Error fetching wardrobe:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWardrobe();
    }, [user]) // Fetch wardrobe whenever the user changes
  );

  useEffect(() => {
    fetchWardrobe();
  }, [user]); // Ensure fetch happens on user change

  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("We need permission to access your photos.");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      console.log("Selected image URI:", result.assets[0].uri);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.tint} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>Pick Today's Outfit</Text>
      <SafeAreaView style={styles.carouselContainer}>
        {groupedData["Headwear"] && <Carousel data={groupedData["Headwear"]} />}
        {groupedData["Tops"] && <Carousel data={groupedData["Tops"]} />}
        {groupedData["Bottoms"] && <Carousel data={groupedData["Bottoms"]} />}
        {groupedData["Shoes"] && <Carousel data={groupedData["Shoes"]} />}
        {groupedData["Accessories"] && <Carousel data={groupedData["Accessories"]} />}
      </SafeAreaView>

      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.previewImage} />
      )}

      <Pressable onPress={pickImage} style={styles.uploadButton}>
        <Text style={{ color: "white" }}>Upload Image</Text>
      </Pressable>

      {/* Bottom Menu */}
      <View style={[styles.menu, { backgroundColor: themeColors.tint, borderColor: themeColors.icon }]}>
        <Pressable onPress={() => router.push('/screens/profile')} style={styles.menuItem}>
          <Image size={30} source={require('./assets/user.png')} style={styles.menuIcon} />
        </Pressable>
        <Pressable onPress={() => router.push('/screens/components/saved')} style={styles.menuItem}>
          <Image size={30} source={require('./assets/heart.png')} style={styles.menuIcon} />
        </Pressable>
        <Pressable onPress={() => router.push('/screens/components/settings')} style={styles.menuItem}>
          <Image size={30} source={require('./assets/settings.png')} style={styles.menuIcon} />
        </Pressable>
        <Pressable onPress={() => router.push('/screens/components/wardrobe')} style={styles.menuItem}>
          <Image size={30} source={require('./assets/clothes-hanger.png')} style={styles.menuIcon} />
        </Pressable>
      </View>
    </View>
  );
}
