import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';
import { supabase } from './utility/supabaseClient'; 

export default function SignUp() {
  const router = useRouter();
  const [theme, setTheme] = useState(Colors.light);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

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
    if (!email || !password || !confirmPassword || !fullName || !username) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const { user, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        throw new Error(error.message);
      }
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: user.id,
          full_name: fullName.trim(),
          username: username.trim(),
          bio: bio.trim() || 'Hello! I am using OutFittr.',
          avatar_url: avatarUrl.trim() || 'https://via.placeholder.com/100',
        },
      ]);

      if (profileError) {
        throw new Error(profileError.message);
      }

      Alert.alert('Sign Up Successful', 'Please check your email to confirm your account.');
      router.push('/screens/login'); // Redirect to login page
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
        placeholder="Full Name"
        placeholderTextColor={theme.icon}
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.icon, color: theme.text, backgroundColor: theme.inputBackground }]}
        placeholder="Username"
        placeholderTextColor={theme.icon}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.icon, color: theme.text, backgroundColor: theme.inputBackground }]}
        placeholder="Bio (Optional)"
        placeholderTextColor={theme.icon}
        value={bio}
        onChangeText={setBio}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.icon, color: theme.text, backgroundColor: theme.inputBackground }]}
        placeholder="Avatar URL (Optional)"
        placeholderTextColor={theme.icon}
        value={avatarUrl}
        onChangeText={setAvatarUrl}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.icon, color: theme.text, backgroundColor: theme.inputBackground }]}
        placeholder="Email"
        placeholderTextColor={theme.icon}
        keyboardType="email-address"
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
      <TextInput
        style={[styles.input, { borderColor: theme.icon, color: theme.text, backgroundColor: theme.inputBackground }]}
        placeholder="Confirm Password"
        placeholderTextColor={theme.icon}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.tint }]} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={{ color: theme.text }}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/screens/login')}>
          <Text style={{ color: theme.tint }}>Login</Text>
        </TouchableOpacity>
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
