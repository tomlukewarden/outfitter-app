import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, FlatList, Pressable, Modal, TouchableHighlight, Alert, Platform } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const Wardrobe = () => {
  const [wardrobe, setWardrobe] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemImage, setNewItemImage] = useState(null);

  const options = {
    mediaType: 'photo',
    includeBase64: false,
    quality: 0.5,
  };

  const requestCameraPermission = async () => {
    const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
    const result = await request(permission);
    return result === RESULTS.GRANTED;
  };

  const requestGalleryPermission = async () => {
    const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    const result = await request(permission);
    return result === RESULTS.GRANTED;
  };

  const handleAddItem = async (source) => {
    let hasPermission = false;
    if (source === 'camera') {
      hasPermission = await requestCameraPermission();
      if (hasPermission) launchCamera(options, handleResponse);
    } else {
      hasPermission = await requestGalleryPermission();
      if (hasPermission) launchImageLibrary(options, handleResponse);
    }

    if (!hasPermission) {
      Alert.alert('Permission Denied', `You need to grant permission to access your ${source === 'camera' ? 'camera' : 'gallery'}.`);
    }
  };

  const handleResponse = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.log('Image Picker Error: ', response.errorMessage);
    } else {
      setNewItemImage(response.assets[0].uri); // Store the image URI temporarily
      setModalVisible(true); // Show the modal to choose the type
    }
  };

  const handleTypeSelection = (type) => {
    const newItem = {
      id: Date.now(),
      title: `Clothing Item ${wardrobe.length + 1}`,
      imageUri: newItemImage,
      type: type,
    };
    setWardrobe([...wardrobe, newItem]);
    setModalVisible(false);
  };

  const handleDeleteItem = (id) => {
    setWardrobe(wardrobe.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Wardrobe</Text>

      <View style={styles.buttonContainer}>
        <Button title="Add New Item (Camera)" onPress={() => handleAddItem('camera')} />
        <Button title="Add New Item (Gallery)" onPress={() => handleAddItem('gallery')} />
      </View>

      <FlatList
        data={wardrobe}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.imageUri }} style={styles.image} />
            <Text>{item.title}</Text>
            <Text>{item.type}</Text>
            <Pressable onPress={() => handleDeleteItem(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>X</Text>
            </Pressable>
          </View>
        )}
      />

      <Modal transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Item Type</Text>
            {['Headwear', 'Tops', 'Bottoms', 'Shoes', 'Accessories'].map((type) => (
              <TouchableHighlight key={type} onPress={() => handleTypeSelection(type)}>
                <Text style={styles.modalOption}>{type}</Text>
              </TouchableHighlight>
            ))}
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    alignItems: 'center',
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalOption: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default Wardrobe;
