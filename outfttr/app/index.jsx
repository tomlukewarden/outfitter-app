import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import useAuthSession from '../app/screens/utility/useAuthSession';
import Home from './home';

export default function Index() {
  const router = useRouter();
  const session = useAuthSession(); 

  useEffect(() => {
    if (session) {
      router.replace('/screens/swipe');
    }
  }, [session]);

  if (session === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return session ? null : <Home />;
}
