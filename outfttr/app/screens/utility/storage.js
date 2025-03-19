import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@wardrobe_items';


export const saveWardrobe = async (wardrobe) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(wardrobe));
  } catch (error) {
    console.error('Error saving wardrobe:', error);
  }
};

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

const OUTFIT_KEY = '@saved_outfits';

export const saveOutfitToStorage = async (outfit) => {
  try {
    const existingOutfits = await getSavedOutfits();
    const newOutfits = [...existingOutfits, outfit]; 
    await AsyncStorage.setItem(OUTFIT_KEY, JSON.stringify(newOutfits));
  } catch (error) {
    console.error('Error saving outfit:', error);
  }
};

export const getSavedOutfits = async () => {
  try {
    const data = await AsyncStorage.getItem(OUTFIT_KEY);
    return data ? JSON.parse(data) : [];  
  } catch (error) {
    console.error('Error getting saved outfits:', error);
    return []; 
  }
};

export const deleteSavedOutfits = async () => {
  try {
    await AsyncStorage.removeItem(OUTFIT_KEY);
  } catch (error) {
    console.error('Error deleting saved outfits:', error);
  }
};

