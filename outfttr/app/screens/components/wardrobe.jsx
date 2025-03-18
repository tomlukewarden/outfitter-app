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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../utility/supabaseClient"; 
import { useAuth } from "../utility/authContext"; 
import { ThemeContext } from "../utility/themeContext";

const CLOTHING_TYPES = ["Headwear", "Tops", "Bottoms", "Shoes", "Accessories"];

const Wardrobe = () => {
  const { user } = useAuth();
  const [wardrobe, setWardrobe] = useState([]);
  const [newItemImage, setNewItemImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemType, setNewItemType] = useState("");
  const { themeColors } = useContext(ThemeContext);

  useEffect(() => {
    const fetchWardrobe = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("wardrobe")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        setWardrobe(data || []);
      } catch (error) {
        console.error("Error fetching wardrobe:", error.message);
      }
    };

    fetchWardrobe();
  }, [user]);

  const uploadImageToSupabase = async (uri) => {
    try {
      const fileName = `wardrobe/${user.id}/${Date.now()}.jpg`;
      const { data, error } = await supabase.storage
        .from("wardrobe")
        .upload(fileName, {
          uri,
          type: "image/jpeg",
          name: fileName,
        });
      
      if (error) throw error;
      return `${supabase.storage.from("wardrobe").getPublicUrl(fileName).data.publicUrl}`;
    } catch (error) {
      console.error("Error uploading image:", error.message);
      Alert.alert("Upload Error", "Could not upload image.");
      return null;
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

  const handleSaveItem = async () => {
    if (!newItemImage || !newItemType || !user) {
      Alert.alert("Missing Information", "Please select a clothing type.");
      return;
    }

    const uploadedImageUrl = await uploadImageToSupabase(newItemImage);
    if (!uploadedImageUrl) return;

    try {
      const { data, error } = await supabase
        .from("wardrobe")
        .insert([{ user_id: user.id, image_url: uploadedImageUrl, type: newItemType }])
        .select();

      if (error) throw error;

      setWardrobe([...wardrobe, ...data]);
      setModalVisible(false);
      setNewItemImage(null);
      setNewItemType("");
    } catch (error) {
      console.error("Error saving wardrobe item:", error.message);
      Alert.alert("Error", "Could not save wardrobe item.");
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const { error } = await supabase.from("wardrobe").delete().eq("id", id);
      if (error) throw error;
      setWardrobe(wardrobe.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting wardrobe item:", error.message);
      Alert.alert("Error", "Could not delete wardrobe item.");
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

export default Wardrobe;