import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';

// Importamos el logo igual que en el login
import logoImg from '../assets/images/logo.png';

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const fadeAnim = new Animated.Value(0); // Para un efecto de entrada suave

  useEffect(() => {
    // Animación de entrada del logo
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Tiempo de espera para mostrar el logo (ej: 2 segundos)
    // Esto da una sensación más profesional de "Cargando..."
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <View style={styles.container}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.logoContainer}>
            <Image 
              source={logoImg} 
              style={styles.logo} 
              resizeMode="contain" 
            />
          </View>
        </Animated.View>
      </View>
    );
  }

  // IMPORTANTE: Redirigimos al LOGIN primero, no al home.
  // Así el flujo es: Splash -> Login -> Dashboard
  return <Redirect href={"/(auth)/login" as any} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9F6', // El mismo fondo de tu paleta
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    backgroundColor: 'white',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    // Sombras para que se vea premium
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  logo: {
    width: '70%',
    height: '70%',
  },
});