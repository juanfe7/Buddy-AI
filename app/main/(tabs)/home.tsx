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

import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../services/firebaseConfig';


const { width } = Dimensions.get('window');

export default function BuddyDashboard() {
  const router = useRouter();
  const [medicamentos, setMedicamentos] = useState<any[]>([]);

  // Escuchar la base de datos en tiempo real
  useEffect(() => {
    const q = query(collection(db, "Schedules"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMedicamentos(docs);
    });

    return () => unsubscribe();
  }, []);

  // Función para marcar como tomada (haciendo click en el badge)
  const toggleEstado = async (id: string, estadoActual: string) => {
    const nuevoEstado = estadoActual === 'tomada' ? 'pendiente' : 'tomada';
    await updateDoc(doc(db, "Schedules", id), { estado: nuevoEstado });
  };

  const irAlChatConSugerencia = (pregunta?: string) => {
    // Podrías pasar la pregunta como parámetro si configuraras el chat para recibir params,
    // por ahora, simplemente navegamos a la tab del chatbot.
    router.push('/main/chatbot' as any);
  };

  

  // Cálculo de adherencia dinámico
  const tomadas = medicamentos.filter(m => m.estado === 'tomada').length;
  const porcentaje = medicamentos.length > 0 ? Math.round((tomadas / medicamentos.length) * 100) : 0;
  const pendientes = medicamentos.filter(m => m.estado !== 'tomada');

  return (
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

        {/* Card: Adherencia DINÁMICA */}
        <View style={styles.cardRow}>
           <View style={{flex: 1}}>
              <Text style={styles.cardTitle}>Adherencia Hoy</Text>
              <View style={styles.adherenciaData}>
                {/* Aquí usamos el porcentaje calculado */}
                <Text style={styles.percentageText}>{porcentaje}%</Text>
                <Text style={styles.subText}>{tomadas} de {medicamentos.length} dosis</Text>
              </View>
              <TouchableOpacity><Text style={styles.linkText}>Ver detalle →</Text></TouchableOpacity>
           </View>
           <View style={styles.progressCircle}>
              <MaterialCommunityIcons name="pill" size={24} color="#065f46" />
           </View>
        </View>

        {/* Card: Medicamentos del Día DINÁMICA */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Medicamentos de Hoy</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {medicamentos.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#64748B', marginVertical: 10 }}>
              No hay medicamentos para mostrar.
            </Text>
          ) : (
            medicamentos.map((item) => (
              <View key={item.id} style={styles.medItem}>
                <View style={[
                  styles.medIcon, 
                  { backgroundColor: item.estado === 'tomada' ? '#F0FDF4' : '#FFF7ED' }
                ]}>
                  <MaterialCommunityIcons 
                    name="pill" 
                    size={22} 
                    color={item.estado === 'tomada' ? '#22C55E' : '#F97316'} 
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.medName}>{item.nombre}</Text>
                  <Text style={styles.medDetails}>{item.hora} • {item.dosis}</Text>
                </View>
                
                {/* Botón para cambiar estado al tocar el badge */}
                <TouchableOpacity 
                  style={[
                    styles.statusBadge, 
                    { backgroundColor: item.estado === 'tomada' ? '#DCFCE7' : '#FEE2E2' }
                  ]}
                  onPress={() => toggleEstado(item.id, item.estado)}
                >
                  <Text style={[
                    styles.statusText, 
                    { color: item.estado === 'tomada' ? '#166534' : '#991B1B' }
                  ]}>
                    {item.estado?.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Card: Sugerencias IA INTERACTIVA */}
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => irAlChatConSugerencia()}
            style={[styles.card, styles.aiCardShadow]}
          >
            <View style={styles.aiHeader}>
              <View style={styles.botIconSmall}>
                <MaterialCommunityIcons name="robot-outline" size={18} color="#065f46" />
              </View>
              <Text style={styles.aiTitle}>Buddy te sugiere</Text>
              <View style={styles.liveIndicator} />
            </View>

            <View style={styles.aiContent}>
              {pendientes.length > 0 ? (
                <Text style={styles.aiItemText}>
                  • Don Carlos tiene <Text style={{fontWeight: 'bold'}}>{pendientes.length} dosis pendientes</Text>. ¿Quieres que le envíe un recordatorio de voz?
                </Text>
              ) : (
                <Text style={styles.aiItemText}>
                  • ¡Excelente! Don Carlos va al día. He notado que caminar 10 min más mejoró su sueño ayer.
                </Text>
              )}
              <Text style={styles.aiItemText}>
                • La <Text style={{fontWeight: 'bold'}}>Atorvastatina</Text> está por terminarse (quedan 2 dosis).
              </Text>
            </View>

            <View style={styles.aiFooter}>
              <Text style={styles.aiActionText}>Preguntar a Buddy sobre esto</Text>
              <Ionicons name="chevron-forward" size={16} color="#2D3436" />
            </View>
          </TouchableOpacity>
          
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
  container: { flex: 1, backgroundColor: '#F5F5F5' },
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
  medItem: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 10, elevation: 1 },
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

  // NUEVOS ESTILOS PARA LA AI CARD
  aiCardShadow: {
    borderLeftWidth: 5,
    borderLeftColor: '#98FFD8',
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  botIconSmall: {
    backgroundColor: '#98FFD8',
    padding: 6,
    borderRadius: 8,
    marginRight: 10,
  },
  aiTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#98FFD8',
  },
  aiContent: {
    marginBottom: 15,
  },
  aiItemText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 8,
  },
  aiFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  aiActionText: {
    color: '#2D3436',
    fontSize: 13,
    fontWeight: 'bold',
  },
});