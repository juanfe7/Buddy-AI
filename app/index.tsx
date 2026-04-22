import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulamos una carga pequeña para que el Router se asiente
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4ADE80" />
      </View>
    );
  }
  // Redirigimos directo a tu nueva estructura de tabs
  // En tu app/index.tsx
  return <Redirect href={"/main/(tabs)/home" as any} />;
}