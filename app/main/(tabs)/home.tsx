import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function BuddyDashboard() {
  const router = useRouter();

  return (
    // Usamos View en lugar de SafeAreaView porque el layout ya maneja el espacio superior
    <View style={styles.container}>
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

          <View style={styles.mapContainer}> 
            <Image 
              source={require('../../../assets/images/mapaUsaquen.jpg')}
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

        {/* Card: Medicamentos del Día */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Medicamentos de Hoy</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {/* Ítem del Medicamento */}
          <View style={styles.medItem}>
            <View style={[styles.medIcon, { backgroundColor: '#F0FDF4' }]}>
              <MaterialCommunityIcons name="pill" size={22} color="#22C55E" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.medName}>Metformina</Text>
              <Text style={styles.medDetails}>08:00 AM • 500mg</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>TOMADA</Text>
            </View>
          </View>
          
          {/* Si quisieras agregar otro medicamento, iría aquí abajo del anterior */}
        </View>

        {/* Card: Sugerencias IA */}
        <View style={[styles.card, {borderLeftWidth: 4, borderLeftColor: '#98FFD8'}]}>
          <View style={styles.aiHeader}>
            <MaterialCommunityIcons name="robot" size={24} color="#065f46" />
            <Text style={[styles.cardTitle, {marginLeft: 8}]}>Sugerencias de IA para Don Carlos</Text>
          </View>
          <Text style={styles.aiItem}>• <Text style={{fontWeight: 'bold'}}>Recordatorio:</Text> Cita médica a las 3 PM.</Text>
          <Text style={styles.aiItem}>• <Text style={{fontWeight: 'bold'}}>Nota:</Text> Olvidó la Atorvastatina hoy.</Text>
          <TouchableOpacity style={styles.btnAnalisis}>
            <Text style={styles.btnAnalisisText}>Ver análisis</Text>
          </TouchableOpacity>
        </View>
        
        {/* Espacio final para que el FAB no tape el contenido */}
        <View style={{height: 120}} /> 
      </ScrollView>

      {/* BOTÓN BOOM - Cámara */}
      <TouchableOpacity 
        style={styles.fabBoom} 
        onPress={() => router.push('/main/camera/cameraScreen' as any)}
      >
        <Ionicons name="camera" size={30} color="#065f46" />
      </TouchableOpacity>
    </View>
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
  cardRow: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 15, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  badgeSafe: { backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeSafeText: { color: '#065f46', fontSize: 10, fontWeight: 'bold' },
  mapPlaceholder: { height: 150, backgroundColor: '#E2E8F0', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  mapText: { color: '#64748B', fontSize: 12 },
  mapFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, alignItems: 'center' },
  locName: { fontSize: 14, fontWeight: 'bold', color: '#1E293B' },
  locTime: { fontSize: 12, color: '#64748B' },
  btnRastrear: { backgroundColor: '#98FFD8', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  btnText: { color: '#065f46', fontWeight: 'bold', fontSize: 13 },
  adherenciaData: { flexDirection: 'row', alignItems: 'baseline', marginVertical: 5 },
  percentageText: { fontSize: 28, fontWeight: 'bold', color: '#065F46' },
  subText: { fontSize: 12, color: '#64748B', marginLeft: 8 },
  linkText: { color: '#065f46', fontSize: 13, fontWeight: 'bold' },
  progressCircle: { width: 60, height: 60, borderRadius: 30, borderWidth: 5, borderColor: '#98FFD8', justifyContent: 'center', alignItems: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  medItem: { backgroundColor: '#f3f3f3', padding: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 10, elevation: 1 },
  medIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  medName: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
  medDetails: { fontSize: 12, color: '#64748B' },
  statusBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: '#166534', fontSize: 10, fontWeight: 'bold' },
  fabBoom: { 
    position: 'absolute', bottom: 30, right: 20, backgroundColor: '#98FFD8',
    width: 75, height: 75, borderRadius: 40, justifyContent: 'center', alignItems: 'center',
    elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5
  },
  fabBoomText: { color: '#065f46', fontSize: 10, fontWeight: 'bold', marginTop: 2 },
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