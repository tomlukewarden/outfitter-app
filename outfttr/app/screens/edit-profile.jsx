import { useState } from 'react';
import { StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function EditProfile() {
  const router = useRouter();
  
  // Prefilled user data
  const [name, setName] = useState('John Doe');
  const [bio, setBio] = useState('Software Developer | Fashion Enthusiast | Tech Lover');
  const [imageUrl, setImageUrl] = useState('https://via.placeholder.com/100');

  const handleSave = () => {
    console.log("Saved Profile:", { name, bio, imageUrl });
    router.back(); // Navigate back to profile
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      {/* Profile Image */}
      <Image source={{ uri: imageUrl }} style={styles.profileImage} />
      <TextInput 
        style={styles.input} 
        placeholder="Profile Image URL" 
        value={imageUrl} 
        onChangeText={setImageUrl} 
      />

      {/* Name Input */}
      <TextInput 
        style={styles.input} 
        placeholder="Full Name" 
        value={name} 
        onChangeText={setName} 
      />

      {/* Bio Input */}
      <TextInput 
        style={[styles.input, styles.bioInput]} 
        placeholder="Bio" 
        value={bio} 
        onChangeText={setBio} 
        multiline 
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Cancel</Text>
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
    backgroundColor: '#f5f5f5',
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
    borderColor: 'black',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});
