import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { Tabs } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importamos tu logo real (ajustamos la ruta para salir de main/(tabs)/ )
import logoImg from '../../../assets/images/logo-without-text.png';

function CustomHeader() {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.brand}>
          {/* Cambiamos el icono por tu logo real */}
          <Image 
            source={logoImg} 
            style={styles.headerLogo} 
            resizeMode="contain" 
          />
          <Text style={styles.brandText}>Buddy</Text>
        </View>
        <View style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={24} color="#334155" style={{ marginRight: 15 }} />
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop' }} // Avatar de María
            style={styles.avatar} 
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#2D3436',
      tabBarInactiveTintColor: '#94A3B8',
      headerShown: true,
      header: () => <CustomHeader />, 
      tabBarStyle: {
        height: 70,
        paddingBottom: 10,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
      }
    }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Estado',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="chart-bar" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="meds"
        options={{
          title: 'Medicamentos',
          tabBarIcon: ({ color }) => <AntDesign name="medicine-box" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'Chatbot',
          tabBarIcon: ({ color }) => <Entypo name="chat" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 20, 
    paddingBottom: 15, 
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  brand: { flexDirection: 'row', alignItems: 'center' },
  headerLogo: {
    width: 32,  // Tamaño compacto para el header
    height: 32,
  },
  brandText: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginLeft: 10, // Un poco más de espacio para que no respire encima del logo
    color: '#0F172A' 
  },
  avatar: { width: 38, height: 38, borderRadius: 19 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
});