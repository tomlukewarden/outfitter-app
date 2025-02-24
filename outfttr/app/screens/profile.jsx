import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.profileImage} />
      <Text style={styles.name}>John Doe</Text>
      <Text style={styles.bio}>Software Developer | Fashion Enthusiast | Tech Lover</Text>
      
      <TouchableOpacity style={styles.button} onPress={() => router.push('/edit-profile')}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <View style={styles.container2}>
        <Text style={styles.title}>My Saved Outfits</Text>
      </View>
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
  profileImage: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container2: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    width: '90%',
    height: '50%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
