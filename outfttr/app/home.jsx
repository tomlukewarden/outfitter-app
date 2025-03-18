import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { ThemeContext } from './screens/utility/themeContext';

export default function Home() {
  const router = useRouter();
  const { themeColors } = useContext(ThemeContext);

  console.log("Rendering Home Screen");

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Floating Circles for Decoration */}
      <View style={[styles.circle, styles.circleTop, { backgroundColor: themeColors.tint }]} />
      <View style={[styles.circle, styles.circleBottom, { backgroundColor: themeColors.tint }]} />

      <Text style={[styles.title, { color: themeColors.text }]}>Welcome to OUTFTTR</Text>
      <Text style={[styles.subtitle, { color: themeColors.text }]}>
        Your very own wardrobe in your hand!
      </Text>

      <View style={styles.buttonContainer}>
        <Text style={[styles.text, { color: themeColors.text }]}>Already registered with us?</Text>
        <View style={[styles.bubbleButton, { backgroundColor: themeColors.button }]}>
          <Button title="Sign In" color={themeColors.background} onPress={() => router.push('/screens/login')} />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Text style={[styles.text, { color: themeColors.text }]}>New to OutFittr?</Text>
        <View style={[styles.bubbleButton, { backgroundColor: themeColors.button }]}>
          <Button title="Sign Up" color={themeColors.background} onPress={() => router.push('/screens/signup')} />
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
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  circle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 60,
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

