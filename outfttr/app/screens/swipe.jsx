import React, { useState, useEffect, useContext } from "react";
import { 
  StyleSheet, Text, Image, View, SafeAreaView, Pressable, ActivityIndicator 
} from "react-native";
import { useRouter } from "expo-router";
import Carousel from "./components/cardCarousel";
import { getWardrobe } from "./utility/storage";
import { ThemeContext } from "./utility/themeContext";

export default function Swipe() {
  const router = useRouter();
  const { themeColors } = useContext(ThemeContext);
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWardrobe = async () => {
      try {
        const wardrobe = await getWardrobe();

        // Group wardrobe items by type
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

      {/* Bottom Menu */}
      <View style={[styles.menu, { backgroundColor: themeColors.tint, borderColor: themeColors.icon }]}>
        <Pressable onPress={() => router.push('/screens/profile')} style={styles.menuItem}>
          <Image size={30} source={require('./assets/user.png')} style={styles.menuIcon} />
        </Pressable>
        <Pressable onPress={() => router.push('/screens/heart')} style={styles.menuItem}>
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

