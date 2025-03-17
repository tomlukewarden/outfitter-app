import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, TouchableOpacity, View, Text, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './utility/supabaseClient'; 
import { Colors } from '../../constants/Colors';

export default function Profile() {
  const router = useRouter();
  const [theme, setTheme] = useState(Colors.light);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedTheme && Colors[storedTheme]) {
        setTheme(Colors[storedTheme]);
      }
    };

    loadTheme();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);

    const { data: user, error: userError } = await supabase.auth.getUser();
    console.log('Current user:', user);

    if (userError || !user?.user) {
      console.log('Error fetching user:', userError);
      Alert.alert('User not found', 'Please log in again.');
      setLoading(false);
      return;
    }

    const userId = user.user.id;

    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, bio')
      .eq('id', userId)
      .single();

    console.log('Fetched profile data:', data);
    console.log('Fetch error:', error);

    if (error) {
      Alert.alert('Error fetching user data', error.message);
    } else {
      setUserProfile(data);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.tint} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {userProfile ? (
        <>
          <Image
            source={{ uri: userProfile.avatar_url || 'https://via.placeholder.com/100' }}
            style={[styles.profileImage, { borderColor: theme.tint }]}
          />
          <Text style={[styles.name, { color: theme.text }]}>{userProfile.full_name || 'No Name'}</Text>
          <Text style={[styles.bio, { color: theme.text }]}>Bio: {userProfile.bio || 'No bio available'}</Text>
        </>
      ) : (
        <Text style={[styles.name, { color: theme.text }]}>No user data found</Text>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.tint }]}
        onPress={() => router.push('/screens/edit-profile')}
      >
        <Text style={[styles.buttonText, { color: theme.background }]}>Edit Profile</Text>
      </TouchableOpacity>
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
});
