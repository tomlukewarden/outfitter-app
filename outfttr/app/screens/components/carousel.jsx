import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import Carousel from "react-native-snap-carousel";

const data = [
  { id: "1", title: "Card 1", image: "https://via.placeholder.com/300" },
  { id: "2", title: "Card 2", image: "https://via.placeholder.com/300" },
  { id: "3", title: "Card 3", image: "https://via.placeholder.com/300" },
];

const { width } = Dimensions.get("window");

const renderItem = ({ item }) => (
  <View style={styles.card}>
    <Image source={{ uri: item.image }} style={styles.image} />
    <Text style={styles.title}>{item.title}</Text>
  </View>
);

const CardCarousel = () => {
  return (
    <View style={styles.container}>
      <Carousel
        data={data}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width * 0.8}
        layout="default"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  image: { width: 250, height: 150, borderRadius: 10 },
  title: { marginTop: 10, fontSize: 18, fontWeight: "bold" },
});

export default CardCarousel;
