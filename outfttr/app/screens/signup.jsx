import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, TextInput, TouchableOpacity, Alert, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './utility/supabaseClient'; 
import { Colors } from '../../constants/Colors';

export default function SignUp() {
  const router = useRouter();
  const [theme, setTheme] = useState(Colors.light);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedTheme && Colors[storedTheme]) {
        setTheme(Colors[storedTheme]);
      }
    };
    loadTheme();
  }, []);

  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        throw new Error(error.message);
      }

      // Alert and navigate to login page
      Alert.alert('Sign Up Successful', 'Please check your email to confirm your account.');
      router.push('/screens/login');
    } catch (error) {
      Alert.alert('Sign Up Failed', error.message || 'Something went wrong.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.logo, { color: theme.text }]}>OUTFTTR</Text>
      <Text style={[styles.welcome, { color: theme.text }]}>Welcome to OutFittr</Text>
      <Text style={[styles.header, { color: theme.text }]}>Sign Up</Text>

      <TextInput
        style={[styles.input, { borderColor: theme.icon, color: theme.text, backgroundColor: theme.inputBackground }]}
        placeholder="Email"
        placeholderTextColor={theme.icon}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.icon, color: theme.text, backgroundColor: theme.inputBackground }]}
        placeholder="Password"
        placeholderTextColor={theme.icon}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.tint }]} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={{ color: theme.text }}>Already have an account?</Text>
        <Button onPress={() => router.push('/screens/login')} title="Login" color={theme.tint} />
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
