import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Please enter both a username and password');
      return;
    }

    Alert.alert('Registration Successful', 'You can now sign in!');
    router.push('/login'); // Redirect to login page
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>OUTFTTR</Text>
      <Text style={styles.welcome}>Welcome to OutFittr</Text>
      <Text style={styles.header}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      {/* Navigate to Login */}
      <Text style={styles.footer}>
        Already have an account?  
        <Text style={styles.footerLink} onPress={() => router.push('/login')}> Sign In</Text>
      </Text>
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
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
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
  footer: {
    fontSize: 14,
    color: '#666',
    marginTop: 20,
  },
  footerLink: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});
