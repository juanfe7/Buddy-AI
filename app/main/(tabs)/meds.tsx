import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../../services/firebaseConfig';


export default function MedsScreen() {
  const [search, setSearch] = useState('');
  const [allMeds, setAllMeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Escuchar la base de datos
  useEffect(() => {
    const q = query(collection(db, "Schedules"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Definimos la estructura para que TS no se queje
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        nombre: doc.data().nombre,
        dosis: doc.data().dosis,
        frecuencia: doc.data().frecuencia,
        hora: doc.data().hora,
        createdAt: doc.data().createdAt,
      })) as any[]; // Usamos any[] aquí para simplificar el filtro de abajo

      // Ahora TS permitirá acceder a .nombre sin errores
      const uniqueMeds = docs.filter((v, i, a) => 
        a.findIndex(t => t.nombre === v.nombre) === i 
      );

      setAllMeds(uniqueMeds);
      setLoading(false);
    });

  return () => unsubscribe();
}, []);

  // 2. Lógica de búsqueda
  const filteredMeds = allMeds.filter(med => 
    med.nombre?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header Estilo Buddy */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medicamentos</Text>
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#64748B" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholderTextColor="#94A3B8"
          placeholder="Buscar medicina..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollList}>
        
        {/* Card: Próxima Dosis (Resaltada como en tu diseño) */}
        {filteredMeds.length > 0 && !search && (
          <View style={styles.nextDoseCard}>
            <View style={styles.nextDoseIcon}>
              <MaterialCommunityIcons name="alarm-check" size={24} color="#065F46" />
            </View>
            <View style={{marginLeft: 12}}>
              <Text style={styles.nextDoseLabel}>PRÓXIMA DOSIS</Text>
              <Text style={styles.nextDoseText}>{filteredMeds[0].nombre} • {filteredMeds[0].hora || "14:00"}</Text>
            </View>
          </View>
        )}

        {/* Lista de Medicamentos */}
        {loading ? (
          <ActivityIndicator size="large" color="#98FFD8" style={{marginTop: 50}} />
        ) : filteredMeds.length === 0 ? (
          <Text style={styles.emptyText}>No se encontraron medicamentos.</Text>
        ) : (
          filteredMeds.map((med) => (
            <TouchableOpacity key={med.id} style={styles.medCard}>
              <View style={styles.medIconBg}>
                <MaterialCommunityIcons name="pill" size={24} color="#64748B" />
              </View>
              <View style={{flex: 1, marginLeft: 15}}>
                <Text style={styles.medName}>{med.nombre}</Text>
                <Text style={styles.medSub}>{med.dosis} • {med.frecuencia || 'Cada 8h'}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Botón Flotante + Agregar */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={24} color="#065F46" />
        <Text style={styles.fabText}>+ Agregar Nueva Medicina</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { paddingHorizontal: 25, paddingTop: 15, marginBottom: 20 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#1E293B' },
  
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#ebf2f9', 
    marginHorizontal: 25, 
    paddingHorizontal: 15, 
    borderRadius: 15,
    height: 50,
    marginBottom: 20
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#1E293B' },

  scrollList: { paddingHorizontal: 25, paddingBottom: 120 },

  nextDoseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0FDF4',
    padding: 20,
    borderRadius: 20,
    marginBottom: 25
  },
  nextDoseIcon: { 
    width: 45, height: 45, borderRadius: 22.5, 
    backgroundColor: '#98FFD8', justifyContent: 'center', alignItems: 'center' 
  },
  nextDoseLabel: { fontSize: 12, fontWeight: 'bold', color: '#059669', letterSpacing: 1 },
  nextDoseText: { fontSize: 18, fontWeight: 'bold', color: '#064E3B' },

  medCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    // Sombra suave
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  medIconBg: { 
    width: 50, height: 50, borderRadius: 15, 
    backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' 
  },
  medName: { fontSize: 17, fontWeight: 'bold', color: '#1E293B' },
  medSub: { fontSize: 14, color: '#64748B', marginTop: 2 },

  emptyText: { textAlign: 'center', color: '#94A3B8', marginTop: 40 },

  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#98FFD8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10
  },
  fabText: { marginLeft: 8, fontWeight: 'bold', color: '#065F46', fontSize: 16 }
});