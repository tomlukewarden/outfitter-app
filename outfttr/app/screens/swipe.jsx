import React, { useState, useEffect, useContext } from "react";
import { 
  StyleSheet, Text, Image, View, SafeAreaView, Pressable, ActivityIndicator, Platform 
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import Carousel from "./components/cardCarousel";
import { getWardrobe } from "./utility/storage";
import { ThemeContext } from "./utility/themeContext";

export default function Swipe() {
  const router = useRouter();
  const { themeColors } = useContext(ThemeContext);
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchWardrobe = async () => {
      try {
        const wardrobe = await getWardrobe();
        const grouped = wardrobe.reduce((acc, item) => {
          if (!item.type || !item.imageUri) {
            console.error("Item missing 'type' or 'imageUri':", item);
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

    fetchWardrobe();
  }, []);

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  title: {
    fontSize: 18, 
    fontWeight: "bold",
    marginVertical: 10,
  },
  carouselContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  previewImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginVertical: 10,
  },
  uploadButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  menu: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderTopWidth: 1,
  },
  menuItem: {
    padding: 10,
  },
  menuIcon: {
    width: 30,
    height: 30,
  },
});