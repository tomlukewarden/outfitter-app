import React from "react";
import { StyleSheet, Text, View, SafeAreaView, Pressable } from "react-native";
import { useRouter } from "expo-router";

import Carousel from "./components/cardCarousel";

const data = [
  { id: "1", title: "Beanie", type: "headwear" },
  { id: "2", title: "Baseball Cap", type: "headwear" },
  { id: "3", title: "Leather Jacket", type: "tops" },
  { id: "4", title: "Hoodie", type: "tops" },
  { id: "5", title: "Graphic T-Shirt", type: "tops" },
  { id: "6", title: "Denim Jeans", type: "bottoms" },
  { id: "7", title: "Chinos", type: "bottoms" },
  { id: "8", title: "Joggers", type: "bottoms" },
  { id: "9", title: "Sneakers", type: "shoes" },
  { id: "10", title: "Chelsea Boots", type: "shoes" },
  { id: "11", title: "Running Shoes", type: "shoes" },
  { id: "12", title: "Wristwatch", type: "accessories" },
  { id: "13", title: "Sunglasses", type: "accessories" },
  { id: "14", title: "Leather Belt", type: "accessories" },
  { id: "15", title: "Snapback Hat", type: "headwear" },
  { id: "16", title: "Cardigan", type: "tops" },
  { id: "17", title: "Cargo Pants", type: "bottoms" },
  { id: "18", title: "Loafers", type: "shoes" },
  { id: "19", title: "Bracelet", type: "accessories" },
  { id: "20", title: "Bucket Hat", type: "headwear" },
];

const groupedData = data.reduce((acc, item) => {
  if (!acc[item.type]) {
    acc[item.type] = [];
  }
  acc[item.type].push(item);
  return acc;
}, {}); 

export default function Swipe() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick Today's Outfit</Text>
      <SafeAreaView style={styles.carouselContainer}>
        <Carousel data={groupedData["headwear"]} />
        <Carousel data={groupedData["tops"]} />
        <Carousel data={groupedData["bottoms"]} />
        <Carousel data={groupedData["shoes"]} />
        <Carousel data={groupedData["accessories"]} />
      </SafeAreaView>

      {/* Bottom Menu */}
      <View style={styles.menu}>
        <Pressable onPress={() => router.push('/screens/profile')} style={styles.menuItem}>
          <Text style={styles.menuText}>Profile</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/screens/heart')} style={styles.menuItem}>
          <Text style={styles.menuText}>❤️</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/screens/shuffle')} style={styles.menuItem}>
          <Text style={styles.menuText}>🔀</Text>
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
