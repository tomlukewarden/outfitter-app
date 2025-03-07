import { View, Image, FlatList, StyleSheet } from "react-native";

export default function Carousel({ data }) {
  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.imageUri }} style={styles.image} />
        </View>
      )}
      showsHorizontalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    marginHorizontal: 10,
    alignItems: "center",
  },
  image: {
    width: 100, 
    height: 100,
    borderRadius: 10,
  },
});
