import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Definición de tipos para las props de MenuOption
interface MenuOptionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  isLast?: boolean; // El signo '?' lo hace opcional para evitar el error ts(2741)
}

const ProfileScreen = () => {
  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop' }} 
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={16} color="#065f46" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>María C.</Text>
          <Text style={styles.userRole}>Cuidadora Principal</Text>
        </View>

        {/* Menu Options */}
        <View style={styles.menuCard}>
          <MenuOption icon="notifications-outline" title="Configurar Notificaciones" />
          <MenuOption icon="link-outline" title="Vincular a Don Carlos" isLast />
          <MenuOption icon="lock-closed-outline" title="Seguridad y PIN" />
          <MenuOption icon="help-circle-outline" title="Ayuda y Soporte" isLast />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="exit-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>ACTIVIDAD</Text>
            <Text style={styles.statValue}>12h</Text>
            <Text style={styles.statSub}>Cuidado hoy</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>ALERTAS</Text>
            <Text style={[styles.statValue, { color: '#065f46' }]}>02</Text>
            <Text style={styles.statSub}>Atendidas</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const MenuOption = ({ icon, title, isLast }: MenuOptionProps) => (
  <TouchableOpacity style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]}>
    <View style={styles.iconBackground}>
      <Ionicons name={icon} size={22} color="#1e293b" />
    </View>
    <Text style={styles.menuTitle}>{title}</Text>
    <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15, backgroundColor: '#fff' 
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#1e293b', flex: 1, marginLeft: 10 },
  buddyIcon: { width: 30, height: 30, tintColor: '#98ffd8' },
  scrollContent: { padding: 20 },
  profileSection: { alignItems: 'center', marginBottom: 30 },
  imageContainer: { position: 'relative' },
  profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#fff' },
  editButton: { 
    position: 'absolute', bottom: 5, right: 5, backgroundColor: '#98ffd8', 
    padding: 8, borderRadius: 20, borderWidth: 3, borderColor: '#fff' 
  },
  userName: { fontSize: 28, fontWeight: '800', color: '#1e293b', marginTop: 15 },
  userRole: { fontSize: 16, color: '#64748b' },
  menuCard: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 15, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  menuItem: { 
    flexDirection: 'row', alignItems: 'center', paddingVertical: 20, 
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9' 
  },
  iconBackground: { 
    width: 45, height: 45, backgroundColor: '#f1f5f9', 
    borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 
  },
  menuTitle: { flex: 1, fontSize: 18, color: '#1e293b', fontWeight: '500' },
  logoutButton: { 
    backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'center', 
    alignItems: 'center', padding: 18, borderRadius: 15, marginBottom: 30 
  },
  logoutText: { color: '#ef4444', fontWeight: '700', fontSize: 18, marginLeft: 10 },
  statsRow: { flexDirection: 'row', gap: 15 },
  statBox: { 
    flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 20, 
    borderLeftWidth: 5, borderLeftColor: '#98ffd8' 
  },
  statLabel: { fontSize: 12, fontWeight: '700', color: '#64748b', letterSpacing: 1 },
  statValue: { fontSize: 32, fontWeight: '800', color: '#065f46', marginVertical: 5 },
  statSub: { fontSize: 14, color: '#94a3b8' }
});

export default ProfileScreen;