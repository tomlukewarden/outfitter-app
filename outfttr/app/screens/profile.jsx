import { StyleSheet, Image, TouchableOpacity, View, Text, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import {Colors} from '../../constants/Colors';

export default function Profile() {
  const router = useRouter();
  const colorScheme = useColorScheme(); 
  const theme = Colors[colorScheme] || Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Image source={{ uri: 'https://via.placeholder.com/100' }} style={[styles.profileImage, { borderColor: theme.tint }]} />
      <Text style={[styles.name, { color: theme.text }]}>John Doe</Text>
      <Text style={[styles.bio, { color: theme.text }]}>Software Developer | Fashion Enthusiast | Tech Lover</Text>
      
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.tint }]} onPress={() => router.push('/screens/edit-profile')}>
        <Text style={[styles.buttonText, { color: theme.background }]}>Edit Profile</Text>
      </TouchableOpacity>

      <View style={[styles.container2, { borderColor: theme.icon }]}>
        <Text style={[styles.title, { color: theme.text }]}>My Saved Outfits</Text>
        <View style={styles.savedOutfits}>
          {['Outfit 1', 'Outfit 2', 'Outfit 3', 'Outfit 4', 'Outfit 5', 'Outfit 6'].map((outfit, index) => (
            <Text key={index} style={[styles.saved, { borderColor: theme.icon, color: theme.text }]}>
              {outfit}
            </Text>
          ))}
        </View>
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
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  container2: {
    borderWidth: 2,
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
    borderRadius: 20,
  },
  savedOutfits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  saved: {
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderRadius: 5,
    padding: 5,
    width: '30%',
    textAlign: 'center', 
  },
});
