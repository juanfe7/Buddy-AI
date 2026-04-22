import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function BuddyDashboard() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brand}>
          <MaterialCommunityIcons name="robot-outline" size={28} color="#4ADE80" />
          <Text style={styles.brandText}>Buddy</Text>
        </View>
        <View style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={24} color="#334155" style={{marginRight: 10}} />
          <Image 
            source={{ uri: 'https://i.pravatar.cc/100' }} 
            style={styles.avatar} 
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
        {/* Saludo */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Buenos días, María C.</Text>
          <Text style={styles.welcomeSub}>Panel de Control de Don Carlos</Text>
        </View>

        {/* Card: Ubicación */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Ubicación en Vivo</Text>
            <View style={styles.badgeSafe}>
              <Text style={styles.badgeSafeText}>● ZONA SEGURA ACTIVA</Text>
            </View>
          </View>

          {/* Aquí va la imagen del mapa */}
          <View style={styles.mapContainer}> 
            <Image 
              source={require('../assets/images/mapaUsaquen.jpg')}
              style={styles.mapImage} 
            />
          </View>

          <View style={styles.mapFooter}>
            <View>
              <Text style={styles.locName}>Parque Usaquén, Bogotá</Text>
              <Text style={styles.locTime}>Actualizado hace 8 min</Text>
            </View>
            <TouchableOpacity style={styles.btnRastrear}>
              <Text style={styles.btnText}>Rastrear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card: Adherencia */}
        <View style={styles.cardRow}>
           <View style={{flex: 1}}>
              <Text style={styles.cardTitle}>Adherencia Hoy</Text>
              <View style={styles.adherenciaData}>
                <Text style={styles.percentageText}>85%</Text>
                <Text style={styles.subText}>5 de 6 dosis</Text>
              </View>
              <TouchableOpacity><Text style={styles.linkText}>Ver detalle →</Text></TouchableOpacity>
           </View>
           <View style={styles.progressCircle}>
              <MaterialCommunityIcons name="pill" size={24} color="#065f46" />
           </View>
        </View>

        {/* Sección: Medicamentos */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Medicamentos de Hoy</Text>
          <TouchableOpacity><Text style={styles.linkText}>Ver todos</Text></TouchableOpacity>
        </View>

        {/* Ejemplo Medicamento Tomado */}
        <View style={styles.medItem}>
          <View style={[styles.medIcon, {backgroundColor: '#f0fdf4'}]}>
             <MaterialCommunityIcons name="pill" size={20} color="#22c55e" />
          </View>
          <View style={{flex: 1, marginLeft: 12}}>
            <Text style={styles.medName}>Metformina</Text>
            <Text style={styles.medDetails}>08:00 AM • 500mg</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>TOMADA</Text>
          </View>
        </View>

        {/* Card: Sugerencias IA */}
        <View style={[styles.card, {borderLeftWidth: 4, borderLeftColor: '#4ADE80'}]}>
          <View style={styles.aiHeader}>
            <MaterialCommunityIcons name="robot" size={24} color="#4ADE80" />
            <Text style={[styles.cardTitle, {marginLeft: 8}]}>Sugerencias de IA</Text>
          </View>
          <Text style={styles.aiItem}>• <Text style={{fontWeight: 'bold'}}>Recordatorio:</Text> Cita médica a las 3 PM.</Text>
          <Text style={styles.aiItem}>• <Text style={{fontWeight: 'bold'}}>Nota:</Text> Olvidó la Atorvastatina hoy.</Text>
          <TouchableOpacity style={styles.btnAnalisis}>
            <Text style={styles.btnAnalisisText}>Ver análisis</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{height: 100}} /> 
      </ScrollView>

      {/* BOTÓN BOOM - Cámara */}
      <TouchableOpacity style={styles.fabBoom}>
        <Ionicons name="camera" size={30} color="white" />
        <Text style={styles.fabBoomText}>BOOM</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10, backgroundColor: 'white'
  },
  brand: { flexDirection: 'row', alignItems: 'center' },
  brandText: { fontSize: 20, fontWeight: 'bold', marginLeft: 5, color: '#0F172A' },
  avatar: { width: 35, height: 35, borderRadius: 17 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20 },
  welcomeSection: { marginVertical: 20 },
  welcomeTitle: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
  welcomeSub: { fontSize: 14, color: '#64748B' },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  cardRow: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 15, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  badgeSafe: { backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeSafeText: { color: '#22C55E', fontSize: 10, fontWeight: 'bold' },
  mapPlaceholder: { height: 150, backgroundColor: '#E2E8F0', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  mapText: { color: '#64748B', fontSize: 12 },
  mapFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, alignItems: 'center' },
  locName: { fontSize: 14, fontWeight: 'bold', color: '#1E293B' },
  locTime: { fontSize: 12, color: '#64748B' },
  btnRastrear: { backgroundColor: '#4ADE80', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  adherenciaData: { flexDirection: 'row', alignItems: 'baseline', marginVertical: 5 },
  percentageText: { fontSize: 28, fontWeight: 'bold', color: '#065F46' },
  subText: { fontSize: 12, color: '#64748B', marginLeft: 8 },
  linkText: { color: '#22C55E', fontSize: 13, fontWeight: 'bold' },
  progressCircle: { width: 60, height: 60, borderRadius: 30, borderWidth: 5, borderColor: '#4ADE80', justifyContent: 'center', alignItems: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  medItem: { backgroundColor: 'white', padding: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 10, elevation: 1 },
  medIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  medName: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
  medDetails: { fontSize: 12, color: '#64748B' },
  statusBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: '#166534', fontSize: 10, fontWeight: 'bold' },
  fabBoom: { 
    position: 'absolute', bottom: 30, right: 20, backgroundColor: '#4ADE80',
    width: 75, height: 75, borderRadius: 40, justifyContent: 'center', alignItems: 'center',
    elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5
  },
  fabBoomText: { color: 'white', fontSize: 10, fontWeight: 'bold', marginTop: 2 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  aiItem: { fontSize: 13, marginBottom: 5, color: '#334155' },
  btnAnalisis: { backgroundColor: '#F1F5F9', padding: 10, borderRadius: 10, marginTop: 10, alignItems: 'center' },
  btnAnalisisText: { color: '#334155', fontWeight: 'bold', fontSize: 13 },
  mapContainer: {
    width: '100%',
    height: 180,              // Ajusta esta altura a tu gusto
    backgroundColor: '#e0e0e0', // Un gris claro por si la imagen tarda en cargar
    marginVertical: 10,       // Espacio arriba y abajo de la imagen
    overflow: 'hidden',       // Esto hace que la imagen respete los bordes si decides redondearlos
  },

  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',      // Hace que la imagen cubra todo el espacio sin deformarse
  },
});