import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  console.log("Rendering Home Screen");

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Welcome to OUTFTTR</Text>
      <Text style={styles.subtitle}>Your very own wardrobe in your hand!</Text>
      
      <View style={styles.buttonContainer}>
        <Text style={styles.text}>Already registered with us?</Text>
        <Button title="Sign In" onPress={() => router.push('/login')} />
      </View>

      <View style={styles.buttonContainer}>
        <Text style={styles.text}>New to OutFittr?</Text>
        <Button title="Sign Up" onPress={() => router.push('/signup')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
});
