import { useState } from 'react';
import { 
  StyleSheet, TextInput, TouchableOpacity, Alert, useColorScheme 
} from 'react-native';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors'; 

export default function Signup() {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light'; 
  const theme = Colors[colorScheme];

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Please enter both a username and password');
      return;
    }

    Alert.alert('Registration Successful', 'You can now sign in!');
    router.push('/login'); 
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.logo, { color: theme.text }]}>OUTFTTR</Text>
      <Text style={[styles.welcome, { color: theme.subText }]}>Welcome to OutFittr</Text>
      <Text style={[styles.header, { color: theme.text }]}>Sign Up</Text>

      <TextInput
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
        placeholder="Username"
        placeholderTextColor={theme.placeholder}
        value={username}
        onChangeText={setUsername}
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
        placeholder="Password"
        placeholderTextColor={theme.placeholder}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.button }]} onPress={handleSignup}>
        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Register</Text>
      </TouchableOpacity>

      {/* Navigate to Login */}
      <Text style={[styles.footer, { color: theme.subText }]}>
        Already have an account?  
        <Text style={[styles.footerLink, { color: theme.link }]} onPress={() => router.push('/login')}> Sign In</Text>
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 14,
    marginTop: 20,
  },
  footerLink: {
    textDecorationLine: 'underline',
  },
});
