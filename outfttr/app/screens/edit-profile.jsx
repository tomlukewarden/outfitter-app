import { useState } from 'react';
import { StyleSheet, TextInput, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors'; 

export default function EditProfile() {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  // Prefilled user data
  const [name, setName] = useState('John Doe');
  const [bio, setBio] = useState('Software Developer | Fashion Enthusiast | Tech Lover');
  const [imageUrl, setImageUrl] = useState('https://via.placeholder.com/100');

  const handleSave = () => {
    console.log("Saved Profile:", { name, bio, imageUrl });
    router.back(); // Navigate back to profile
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Edit Profile</Text>

      {/* Profile Image */}
      <Image source={{ uri: imageUrl }} style={[styles.profileImage, { borderColor: theme.tint }]} />
      <TextInput 
        style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.icon }]} 
        placeholder="Profile Image URL" 
        placeholderTextColor={theme.icon}
        value={imageUrl} 
        onChangeText={setImageUrl} 
      />

      {/* Name Input */}
      <TextInput 
        style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.icon }]} 
        placeholder="Full Name" 
        placeholderTextColor={theme.icon}
        value={name} 
        onChangeText={setName} 
      />

      {/* Bio Input */}
      <TextInput 
        style={[styles.input, styles.bioInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.icon }]} 
        placeholder="Bio" 
        placeholderTextColor={theme.icon}
        value={bio} 
        onChangeText={setBio} 
        multiline 
      />

      {/* Save Button */}
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.tint }]} onPress={handleSave}>
        <Text style={[styles.buttonText, { color: theme.background }]}>Save</Text>
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={[styles.backButtonText, { color: theme.tint }]}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 15,
    fontSize: 16,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

