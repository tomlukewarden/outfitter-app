import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  TouchableHighlight,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Wardrobe = () => {
  const [wardrobe, setWardrobe] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemImage, setNewItemImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera access is needed to add items."
        );
      }
    })();

    const loadWardrobe = async () => {
      try {
        const storedWardrobe = await AsyncStorage.getItem("wardrobe");
        if (storedWardrobe) {
          setWardrobe(JSON.parse(storedWardrobe));
        }
      } catch (error) {
        console.error("Error loading wardrobe:", error);
      }
    };

    loadWardrobe();
  }, []);

  const saveWardrobe = async (updatedWardrobe) => {
    try {
      await AsyncStorage.setItem("wardrobe", JSON.stringify(updatedWardrobe));
    } catch (error) {
      console.error("Error saving wardrobe:", error);
    }
  };

  const handleAddItem = async (source) => {
    let result;
    if (source === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "You need to grant camera permission."
        );
        return;
      }
      result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    } else {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "You need to grant gallery permission."
        );
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
    }

    if (!result.canceled) {
      setNewItemImage(result.assets[0].uri);
      setModalVisible(true);
    }
  };

  const handleTypeSelection = async (type) => {
    const newItem = {
      id: Date.now(),
      title: `Item ${wardrobe.length + 1}`,
      imageUri: newItemImage,
      type,
    };
    const updatedWardrobe = [...wardrobe, newItem];
    setWardrobe(updatedWardrobe);
    await saveWardrobe(updatedWardrobe);
    setModalVisible(false);
  };

  const handleDeleteItem = async (id) => {
    const updatedWardrobe = wardrobe.filter((item) => item.id !== id);
    setWardrobe(updatedWardrobe);
    await saveWardrobe(updatedWardrobe);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Wardrobe</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Add New Item (Camera)"
          onPress={() => handleAddItem("camera")}
        />
        <Button
          title="Add New Item (Gallery)"
          onPress={() => handleAddItem("gallery")}
        />
      </View>
      <FlatList
        data={wardrobe}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.imageUri }} style={styles.image} />
            <Text>{item.title}</Text>
            <Text>{item.type}</Text>
            <Pressable
              onPress={() => handleDeleteItem(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>X</Text>
            </Pressable>
          </View>
        )}
      />
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Item Type</Text>
            {["Headwear", "Tops", "Bottoms", "Shoes", "Accessories"].map(
              (type) => (
                <TouchableHighlight
                  key={type}
                  onPress={() => handleTypeSelection(type)}
                >
                  <Text style={styles.modalOption}>{type}</Text>
                </TouchableHighlight>
              )
            )}
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  itemContainer: {
    alignItems: "center",
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: { width: 100, height: 100, borderRadius: 10, marginRight: 10 },
  deleteButton: { backgroundColor: "red", padding: 5, borderRadius: 5 },
  deleteText: { color: "white", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  modalOption: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

export default Wardrobe;
