import { useState } from 'react';
import { Button, StyleSheet, TextInput, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function Login() {
  const router = useRouter();
  const colorScheme = useColorScheme(); 
  const theme = Colors[colorScheme] || Colors.light;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'Admin' && password === 'Password1') {
      Alert.alert('Login Successful', 'Welcome back!');
      router.push('/screens/swipe');
    } else {
      Alert.alert('Login Failed', 'Invalid username or password');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.logo, { color: theme.text }]}>OUTFTTR</Text>
      <Text style={[styles.welcome, { color: theme.text }]}>Welcome to OutFittr</Text>
      <Text style={[styles.header, { color: theme.text }]}>Sign In</Text>

      <TextInput
        style={[styles.input, { borderColor: theme.icon, color: theme.text }]}
        placeholder="Username"
        placeholderTextColor={theme.icon}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.icon, color: theme.text }]}
        placeholder="Password"
        placeholderTextColor={theme.icon}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.tint }]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={{ color: theme.text }}>Don't have an account?</Text>
        <Button onPress={() => router.push('/screens/signup')} title="Sign up" color={theme.tint} />
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
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 15,
    fontSize: 16,
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
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
