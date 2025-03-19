import React, { useState, useEffect, useContext, useRef } from "react";
import { 
  StyleSheet, Text, Image, View, SafeAreaView, Pressable, ActivityIndicator, Platform, Alert 
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import Carousel from "./components/cardCarousel";
import { getWardrobe } from "./utility/storage";
import { ThemeContext } from "./utility/themeContext";
import * as ViewShot from "react-native-view-shot";

export default function Swipe() {
  const router = useRouter();
  const { themeColors } = useContext(ThemeContext);
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [savedOutfits, setSavedOutfits] = useState([]);
  const outfitRef = useRef();

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

  const saveOutfit = () => {
    outfitRef.current.capture().then(uri => {
      console.log("Saved outfit as image:", uri);
      setSavedOutfits([...savedOutfits, uri]);

      Alert.alert("Outfit Saved", "Your outfit has been successfully saved!");
    }).catch(error => {
      console.error("Error saving outfit:", error);
      Alert.alert("Save Failed", "There was an error saving your outfit. Please try again.");
    });
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

      <View style={styles.saveButtonContainer}>
        <Pressable style={styles.saveButton} onPress={saveOutfit}>
          <Text style={styles.saveButtonText}>Save Outfit</Text>
        </Pressable>
      </View>

      <View style={styles.outfitContainer} ref={outfitRef}>
        {/* Here you would create a combined view of the selected outfit */}
        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.previewImage} />}
        {/* Add other selected outfit components (Headwear, Tops, Bottoms, Shoes) here */}
      </View>

      {/* Bottom Menu */}
      <View style={[styles.menu, { backgroundColor: themeColors.tint, borderColor: themeColors.icon }]}>
        <Pressable onPress={() => router.push('/screens/profile')} style={styles.menuItem}>
          <Image size={30} source={require('./assets/user.png')} style={styles.menuIcon} />
        </Pressable>
        <Pressable onPress={saveOutfit} style={styles.menuItem}>
          <Image size={30} source={require('./assets/heart.png')} style={styles.menuIcon} />
        </Pressable>
        <Pressable onPress={() => router.push('/screens/components/saved')} style={styles.menuItem}>
          <Image size={30} source={require('./assets/save.png')} style={styles.menuIcon} />
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
    width: 410,
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
  saveButtonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20, 
  },
  
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30, 
    alignItems: "center",
    justifyContent: "center",
  },
  
  saveButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  }
  
});
