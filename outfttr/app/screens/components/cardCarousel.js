import { View, Image, FlatList, StyleSheet, Pressable } from "react-native";

export default function Carousel({ data, onItemSelect, selectedItem }) {
  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <Pressable onPress={() => onItemSelect(item)}>
          <View
            style={[
              styles.imageContainer,
              selectedItem?.id === item.id && styles.selected, // Highlight selected item
            ]}
          >
            <Image source={{ uri: item.imageUri }} style={styles.image} />
          </View>
        </Pressable>
      )}
      showsHorizontalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    marginHorizontal: 10,
    alignItems: "center",
    padding: 5,
    borderRadius: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  selected: {
    borderWidth: 3,
  },
});
