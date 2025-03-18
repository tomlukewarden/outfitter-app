import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import useAuthSession from '../app/screens/utility/useAuthSession';
import Home from './home' 

export default function Index() {
  const router = useRouter();
  const session = useAuthSession(); 

  if (session === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (session) {
    router.replace('/screens/swipe');
    return null; 
  }
  return <Home />;
}
