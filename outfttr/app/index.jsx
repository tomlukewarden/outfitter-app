import { View, Text, Button, StyleSheet, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors'; 


export default function Home() {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  console.log("Rendering Home Screen");

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Floating Circles for Decoration */}
      <View style={[styles.circle, styles.circleTop]} />
      <View style={[styles.circle, styles.circleBottom]} />

      <Text style={[styles.title, { color: theme.text }]}>Welcome to OUTFTTR</Text>
      <Text style={[styles.subtitle, { color: theme.subText }]}>
        Your very own wardrobe in your hand!
      </Text>

      <View style={styles.buttonContainer}>
        <Text style={[styles.text, { color: theme.subText }]}>Already registered with us?</Text>
        <View style={styles.bubbleButton}>
          <Button title="Sign In" color={theme.button} onPress={() => router.push('/screens/login')} />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Text style={[styles.text, { color: theme.subText }]}>New to OutFittr?</Text>
        <View style={styles.bubbleButton}>
          <Button title="Sign Up" color={theme.button} onPress={() => router.push('/screens/signup')} />
        </View>
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
    position: 'relative',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
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
  },
  bubbleButton: {
    width: 160,
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  circle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
  },
  circleTop: {
    top: 50,
    left: -30,
  },
  circleBottom: {
    bottom: 50,
    right: -30,
  },
});
