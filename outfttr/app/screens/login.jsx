import React, { useState, useEffect } from 'react'
import { Alert, StyleSheet, View, TextInput, TouchableOpacity, Text, AppState } from 'react-native'
import { supabase } from './utility/supabaseClient'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Colors } from '../../constants/Colors'

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Login() {
  const router = useRouter()
  const [theme, setTheme] = useState(Colors.light)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('theme')
      if (storedTheme && Colors[storedTheme]) {
        setTheme(Colors[storedTheme])
      }
    }
    loadTheme()
  }, [])

  async function signInWithEmail() {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      Alert.alert(error.message)
      setLoading(false)
      return
    }

    if (data?.user) {
      router.push('/screens/swipe') 
    }
    setLoading(false)
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.logo, { color: theme.text }]}>OUTFTTR</Text>
      <Text style={[styles.header, { color: theme.text }]}>Login</Text>

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

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.tint }]}
        onPress={signInWithEmail}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={{ color: theme.text }}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/screens/signup')}>
          <Text style={{ color: theme.tint }}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
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
})
