import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#22C55E', // El verde de tu diseño
      tabBarInactiveTintColor: '#94A3B8',
      headerShown: false,
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