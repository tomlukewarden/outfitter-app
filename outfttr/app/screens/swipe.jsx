import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import Carousel from "./components/cardCarousel";
import { getWardrobe } from "./utility/storage";

export default function Swipe() {
  const router = useRouter();
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWardrobe = async () => {
      try {
        const wardrobe = await getWardrobe();
        console.log("Fetched wardrobe data:", wardrobe);

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

        console.log("Grouped wardrobe data:", grouped); 
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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick Today's Outfit</Text>
      <SafeAreaView style={styles.carouselContainer}>
        {groupedData["headwear"] && <Carousel data={groupedData["headwear"]} />}
        {groupedData["tops"] && <Carousel data={groupedData["tops"]} />}
        {groupedData["bottoms"] && <Carousel data={groupedData["bottoms"]} />}
        {groupedData["shoes"] && <Carousel data={groupedData["shoes"]} />}
        {groupedData["accessories"] && <Carousel data={groupedData["accessories"]} />}
      </SafeAreaView>

      {/* Bottom Menu */}
      <View style={styles.menu}>
        <Pressable onPress={() => router.push('/screens/profile')} style={styles.menuItem}>
          <Text style={styles.menuText}>👤</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/screens/heart')} style={styles.menuItem}>
          <Text style={styles.menuText}>❤️</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/screens/settings')} style={styles.menuItem}>
          <Text style={styles.menuText}>⚙️</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/screens/components/wardrobe')} style={styles.menuItem}>
          <Text style={styles.menuText}>👔</Text>
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
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 18, 
    fontWeight: "bold",
    marginVertical: 10,
  },
  carouselContainer: {
    flex: 1,
    width: "100%",
  },
  menu: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  menuItem: {
    padding: 10,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
