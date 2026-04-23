import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Creamos el componente del Header personalizado
function CustomHeader() {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.brand}>
          <MaterialCommunityIcons name="robot-outline" size={28} color="#98FFD8" />
          <Text style={styles.brandText}>Buddy</Text>
        </View>
        <View style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={24} color="#334155" style={{ marginRight: 15 }} />
          <Image 
            source={{ uri: 'https://i.pravatar.cc/100' }} 
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
      tabBarActiveTintColor: '#98FFD8',
      tabBarInactiveTintColor: '#94A3B8',
      headerShown: true, // <-- Ahora lo activamos
      header: () => <CustomHeader />, // <-- Usamos nuestro componente
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
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="pill" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'Chatbot',
          tabBarIcon: ({ color }) => <Ionicons name="chatbubble-ellipses" size={24} color={color} />,
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
  brandText: { fontSize: 22, fontWeight: 'bold', marginLeft: 8, color: '#0F172A' },
  avatar: { width: 38, height: 38, borderRadius: 19 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
});