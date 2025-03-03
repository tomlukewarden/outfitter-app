import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, FlatList, TouchableOpacity, Modal, TouchableHighlight } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const Wardrobe = () => {
  const [wardrobe, setWardrobe] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemType, setNewItemType] = useState('');
  const [newItemImage, setNewItemImage] = useState(null);
  
  const handleAddItem = (source) => {
    source === 'camera' ? launchCamera(options, handleResponse) : launchImageLibrary(options, handleResponse);
  };

  const options = {
    mediaType: 'photo',
    includeBase64: false,
    quality: 0.5,
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
      id: wardrobe.length + 1,
      title: `Clothing Item ${wardrobe.length + 1}`,
      imageUri: newItemImage,
      type: type,
    };
    setWardrobe([...wardrobe, newItem]);  
    setModalVisible(false); 
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  itemContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
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
