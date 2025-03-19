import * as MediaLibrary from "expo-media-library";
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { saveWardrobe, getWardrobe } from "../utility/storage";
import { ThemeContext } from "../utility/themeContext";

const CLOTHING_TYPES = ["Headwear", "Tops", "Bottoms", "Shoes"];

const Wardrobe = () => {
  const [wardrobe, setWardrobe] = useState([]);
  const [newItemImage, setNewItemImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemType, setNewItemType] = useState("");
  const { themeColors } = useContext(ThemeContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedWardrobe = await getWardrobe();
        setWardrobe(storedWardrobe || []);
      } catch (error) {
        console.error("Error fetching wardrobe:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddItem = async (source) => {
    try {
      let result;
      if (source === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "You need to grant camera permission.");
          return;
        }
        result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "You need to grant gallery permission.");
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
      }

      if (!result.canceled) {
        let imageUri = result.assets[0].uri;
        if (imageUri.startsWith("ph://")) {
          const asset = await MediaLibrary.createAssetAsync(imageUri);
          const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);
          imageUri = assetInfo.localUri;
        }

        setNewItemImage(imageUri);
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error handling image selection:", error);
      Alert.alert("Error", "Something went wrong while selecting the image.");
    }
  };

  const handleSaveItem = async () => {
    if (!newItemImage || !newItemType) {
      Alert.alert("Missing Information", "Please select a clothing type.");
      return;
    }

    const newItem = {
      id: Date.now(),
      title: `Item ${wardrobe.length + 1}`,
      imageUri: newItemImage,
      type: newItemType,
    };

    const updatedWardrobe = [...wardrobe, newItem];
    setWardrobe(updatedWardrobe);
    await saveWardrobe(updatedWardrobe);
    setModalVisible(false);
    setNewItemImage(null);
    setNewItemType("");
  };

  const handleDeleteItem = async (id) => {
    const updatedWardrobe = wardrobe.filter((item) => item.id !== id);
    setWardrobe(updatedWardrobe);
    await saveWardrobe(updatedWardrobe);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}> 
      <Text style={[styles.title, { color: themeColors.text }]}>My Wardrobe</Text>
      <Button title="Add Item from Gallery" onPress={() => handleAddItem("gallery")} />
      <Button title="Add Item from Camera" onPress={() => handleAddItem("camera")} />
      
      <FlatList
        data={wardrobe}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.itemContainer, { backgroundColor: themeColors.card }]}> 
            <Image source={{ uri: item.imageUri }} style={styles.image} />
            <Text style={[styles.itemText, { color: themeColors.text }]}>{item.title}</Text>
            <Text style={[styles.itemText, { color: themeColors.text }]}>{item.type}</Text>
            <Pressable onPress={() => handleDeleteItem(item.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Clothing Type </Text>
          {CLOTHING_TYPES.map((type) => (
            <Pressable key={type} onPress={() => setNewItemType(type)}>
              <Text style={[styles.modalOption, newItemType === type && styles.selectedOption]}>{type}</Text>
            </Pressable>
          ))}
          <Button title="Save Item" onPress={handleSaveItem} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  itemContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "90%", padding: 10, borderRadius: 10 },
  image: { width: 100, height: 100, borderRadius: 10, marginRight: 10 },
  itemText: { fontSize: 16 },
  deleteText: { color: "red", marginLeft: 10 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "white" },
  modalOption: { fontSize: 18, color: "white", padding: 10 },
  selectedOption: { fontWeight: "bold", textDecorationLine: "underline" },
});

export default Wardrobe;