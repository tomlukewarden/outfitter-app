import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@wardrobe_items';

// Save the wardrobe data to AsyncStorage
export const saveWardrobe = async (wardrobe) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(wardrobe));
  } catch (error) {
    console.error('Error saving wardrobe:', error);
  }
};

// Get the wardrobe data from AsyncStorage
export const getWardrobe = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];  
  } catch (error) {
    console.error('Error getting wardrobe:', error);
    return []; 
  }
};

export const deleteWardrobe = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error deleting wardrobe:', error);
  }
};
