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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../utility/supabaseClient";
import { ThemeContext } from "../utility/themeContext";

const CLOTHING_TYPES = ["Headwear", "Tops", "Bottoms", "Shoes"];

const Wardrobe = () => {
  const [wardrobe, setWardrobe] = useState([]);
  const [newItemImage, setNewItemImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemType, setNewItemType] = useState("");
  const { themeColors } = useContext(ThemeContext);

  useEffect(() => {
    fetchWardrobe();
  }, []);

  const fetchWardrobe = async () => {
    try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.user) {
        Alert.alert("Error", "No user logged in.");
        return;
      }

      const userId = user.user.id;

      const { data, error } = await supabase
        .from("wardrobe")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching wardrobe:", error);
      } else {
        setWardrobe(data);
      }
    } catch (error) {
      console.error("Error fetching wardrobe:", error);
    }
  };

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
        setNewItemImage(result.assets[0].uri);
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error handling image selection:", error);
      Alert.alert("Error", "Something went wrong while selecting the image.");
    }
  };

  const uploadImage = async (imageUri) => {
    try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.user) {
        Alert.alert("Error", "No user logged in.");
        return null;
      }

      const userId = user.user.id;
      const fileName = `wardrobe/${userId}_${Date.now()}.jpg`;

      const response = await fetch(imageUri);
      const blob = await response.blob();

      const { data, error } = await supabase.storage
        .from("wardrobeimages")
        .upload(fileName, blob, { upsert: true });

      if (error) {
        Alert.alert("Upload Error", error.message);
        return null;
      }

      const { data: publicUrl } = supabase.storage
        .from("wardrobeimages")
        .getPublicUrl(fileName);

      return publicUrl.publicUrl;
    } catch (error) {
      console.error("Image upload error:", error);
      Alert.alert("Error", "Failed to upload image.");
      return null;
    }
  };

  const handleSaveItem = async () => {
    if (!newItemImage || !newItemType) {
      Alert.alert("Missing Information", "Please select a clothing type.");
      return;
    }
  
    const imageUrl = await uploadImage(newItemImage);
    if (!imageUrl) return;
  
    try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.user) {
        Alert.alert("Error", "No user logged in.");
        return;
      }
  
      const userId = user.user.id;
  
      const newItem = {
        user_id: userId,
        image_url: imageUrl,
        type: newItemType,
        id: Date.now(), // Temporary ID for instant update
      };
  
      // Optimistically update the UI before fetching new data
      setWardrobe((prevWardrobe) => [newItem, ...prevWardrobe]);
  
      const { error } = await supabase.from("wardrobe").insert([
        {
          user_id: userId,
          image_url: imageUrl,
          type: newItemType,
        },
      ]);
  
      if (error) {
        console.error("Error saving item:", error);
        Alert.alert("Error", "Could not save item.");
        return;
      }
  
      Alert.alert("Success", "Item added to wardrobe!");
      fetchWardrobe(); // Fetch updated wardrobe from DB
    } catch (error) {
      console.error("Error saving item:", error);
    }
  
    setModalVisible(false);
    setNewItemImage(null);
    setNewItemType("");
  };
  
  const handleDeleteItem = async (id) => {
    try {
      const { error } = await supabase.from("wardrobe").delete().eq("id", id);
      if (error) {
        console.error("Error deleting item:", error);
        Alert.alert("Error", "Could not delete item.");
      } else {
        setWardrobe(wardrobe.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
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
            <Image source={{ uri: item.image_url }} style={styles.image} />
            <Text style={[styles.itemText, { color: themeColors.text }]}>{item.type}</Text>
            <Pressable onPress={() => handleDeleteItem(item.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Clothing Type</Text>
          {CLOTHING_TYPES.map((type) => (
            <Pressable key={type} onPress={() => setNewItemType(type)}>
              <Text style={[styles.modalOption, newItemType === type && styles.selectedOption]}>
                {type}
              </Text>
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
