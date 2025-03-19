import React, { useState, useContext, useCallback } from "react";
import { 
  StyleSheet, Text, Image, View, SafeAreaView, Pressable, ActivityIndicator, Alert 
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native"; // ✅ Ensure wardrobe updates on screen focus
import Carousel from "./components/cardCarousel";
import { getWardrobe, saveOutfitToStorage } from "./utility/storage"; 
import { ThemeContext } from "./utility/themeContext";

export default function Swipe() {
  const router = useRouter();
  const { themeColors } = useContext(ThemeContext);
  
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false); // ✅ Added refresh state
  const [outfit, setOutfit] = useState({
    headwear: null,
    top: null,
    bottom: null,
    shoes: null
  });

  // ✅ Fetch wardrobe items whenever the screen comes into focus or refresh state changes
  useFocusEffect(
    useCallback(() => {
      const fetchWardrobe = async () => {
        try {
          setLoading(true);
          const wardrobe = await getWardrobe();
          const grouped = wardrobe.reduce((acc, item) => {
            if (!item.type || !item.imageUri) return acc;
            if (!acc[item.type]) acc[item.type] = [];
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
    }, [refresh]) // ✅ Refresh when wardrobe changes
  );

  const handleSelectItem = (type, item) => {
    setOutfit((prevOutfit) => ({
      ...prevOutfit,
      [type]: item,
    }));
  };

  const saveOutfit = async () => {
    if (!outfit.headwear || !outfit.top || !outfit.bottom || !outfit.shoes) {
      Alert.alert("Incomplete Outfit", "Please select all items for your outfit.");
      return;
    }

    const newOutfit = { ...outfit, date: new Date().toISOString() };
    await saveOutfitToStorage(newOutfit);

    Alert.alert("Outfit Saved", "Your outfit has been saved!");
    setOutfit({ headwear: null, top: null, bottom: null, shoes: null });
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
        {groupedData["Headwear"] && (
          <Carousel 
            data={groupedData["Headwear"]} 
            onItemSelect={(item) => handleSelectItem('headwear', item)} 
            selectedItem={outfit.headwear}
          />
        )}
        {groupedData["Tops"] && (
          <Carousel 
            data={groupedData["Tops"]} 
            onItemSelect={(item) => handleSelectItem('top', item)} 
            selectedItem={outfit.top}
          />
        )}
        {groupedData["Bottoms"] && (
          <Carousel 
            data={groupedData["Bottoms"]} 
            onItemSelect={(item) => handleSelectItem('bottom', item)} 
            selectedItem={outfit.bottom}
          />
        )}
        {groupedData["Shoes"] && (
          <Carousel 
            data={groupedData["Shoes"]} 
            onItemSelect={(item) => handleSelectItem('shoes', item)} 
            selectedItem={outfit.shoes}
          />
        )}
      </SafeAreaView>

      {/* Bottom Menu */}
      <View style={[styles.menu, { backgroundColor: themeColors.tint, borderColor: themeColors.icon }]}>
        <Pressable onPress={() => router.push('/screens/profile')} style={styles.menuItem}>
          <Image source={require('./assets/user.png')} style={styles.menuIcon} />
        </Pressable>
        <Pressable onPress={saveOutfit} style={styles.menuItem}>
          <Image source={require('./assets/heart.png')} style={styles.menuIcon} />
        </Pressable>
        <Pressable onPress={() => router.push('/screens/components/saved')} style={styles.menuItem}>
          <Image source={require('./assets/save.png')} style={styles.menuIcon} />
        </Pressable>
        <Pressable onPress={() => router.push('/screens/components/settings')} style={styles.menuItem}>
          <Image source={require('./assets/settings.png')} style={styles.menuIcon} />
        </Pressable>
        <Pressable onPress={() => router.push('/screens/components/wardrobe')} style={styles.menuItem}>
          <Image source={require('./assets/clothes-hanger.png')} style={styles.menuIcon} />
        </Pressable>
      </View>
    </View>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 10 },
  title: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  carouselContainer: { flex: 1, width: "100%", alignItems: "center" },
  menu: { position: "absolute", bottom: 0, width: "100%", flexDirection: "row", justifyContent: "space-around", paddingVertical: 15, borderTopWidth: 1 },
  menuItem: { padding: 10 },
  menuIcon: { width: 30, height: 30 },
});

