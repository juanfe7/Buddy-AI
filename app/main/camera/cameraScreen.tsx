import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { addDoc, collection, onSnapshot, query, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../services/firebaseConfig';

const { width, height } = Dimensions.get('window');

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentMeds, setCurrentMeds] = useState<string[]>([]);
  
  const [showModal, setShowModal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [selectedFreq, setSelectedFreq] = useState('Cada 8h');

  const cameraRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, "Schedules"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const meds = snapshot.docs.map(doc => doc.data().nombre);
      setCurrentMeds(meds);
    });
    return () => unsubscribe();
  }, []);

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="camera" size={40} color="#065f46" />
        </View>
        <Text style={styles.permissionTitle}>Acceso a la Cámara</Text>
        <Text style={styles.permissionText}>Buddy necesita ver las medicinas para ayudarte a cuidarlas mejor.</Text>
        <TouchableOpacity style={styles.mainBtn} onPress={requestPermission}>
          <Text style={styles.mainBtnText}>Permitir Cámara</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync({ quality: 0.5 });
        setPhoto(data.uri);
      } catch (e) { console.error(e); }
    }
  }
  
  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhoto(result.assets[0].uri);
    }
  }

  async function analyzeMedicine() {
    if (!photo) return;
    setIsAnalyzing(true);
    try {
      const base64Photo = await FileSystem.readAsStringAsync(photo, { encoding: 'base64' });
      const apiKey = process.env.EXPO_PUBLIC_API_KEY;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

      const body = {
        contents: [{
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: base64Photo } },
            { text: `Eres Buddy, asistente médico de Don Carlos. 
            Analiza la imagen y los medicamentos que ya toma: ${currentMeds.join(', ')}.
            Reglas:
            1. "esSeguro" solo es false si la imagen NO es un medicamento.
            2. "alerta" debe ser un string VACÍO "" si no hay interacciones peligrosas o advertencias críticas.
            3. Si hay conflicto con lo que ya toma, descríbelo en "alerta".

            Responde SOLO JSON: {"nombre": "...", "dosis": "...", "instrucciones": "...", "alerta": "...", "esSeguro": true/false}` }
          ]
        }]
      };

      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text.replace(/```json/g, "").replace(/```/g, "").trim();
      const result = JSON.parse(text);
      setAnalysisResult(result);
      setShowModal(true);
    } catch (error) {
      setAnalysisResult({ nombre: "Error", alerta: "No pude procesar la imagen.", esSeguro: false });
      setShowModal(true);
    } finally { setIsAnalyzing(false); }
  }

  const saveToFirebase = async () => {
    try {
      await addDoc(collection(db, "Schedules"), {
        nombre: analysisResult.nombre,
        dosis: analysisResult.dosis,
        frecuencia: selectedFreq,
        estado: 'pendiente',
        hora: "08:00 AM",
        createdAt: serverTimestamp(),
      });
      setShowModal(false);
      setPhoto(null);
      router.back();
    } catch (e) { console.error(e); }
  };

 return (
    <View style={styles.container}>
      {!photo ? (
        <View style={{ flex: 1 }}>
          <CameraView style={styles.camera} ref={cameraRef}>
            {/* ESCÁNER OVERLAY SIMPLIFICADO */}
            <View style={styles.scannerOverlay}>
              <View style={styles.scannerFrame}>
                <View style={[styles.corner, styles.topL]} />
                <View style={[styles.corner, styles.topR]} />
                <View style={[styles.corner, styles.botL]} />
                <View style={[styles.corner, styles.botR]} />
              </View>
              <Text style={styles.scanText}>Ubica la medicina aquí</Text>
            </View>
          </CameraView>

          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <View style={styles.controlsRow}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={pickImage}>
                <Ionicons name="images" size={28} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
                <View style={styles.innerCircle} />
              </TouchableOpacity>
              <View style={styles.secondaryBtn} />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.fullPreview} />
          <View style={styles.previewOverlay}>
            <Text style={styles.previewTitle}>¿Se ve clara la medicina?</Text>
            <View style={styles.previewActions}>
              <TouchableOpacity style={styles.secondaryAction} onPress={() => setPhoto(null)}>
                <Text style={styles.secondaryActionText}>Repetir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryAction} onPress={analyzeMedicine} disabled={isAnalyzing}>
                {isAnalyzing ? <ActivityIndicator color="#065f46" /> : <Text style={styles.primaryActionText}>Analizar con Buddy</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* MODAL BUDDY UI */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIndicator} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={styles.modalHeader}>
                <View style={[styles.iconBox, { backgroundColor: analysisResult?.esSeguro ? '#98FFD8' : '#FEE2E2' }]}>
                  <MaterialCommunityIcons name={analysisResult?.esSeguro ? "pill" : "alert-rhombus"} size={28} color={analysisResult?.esSeguro ? "#065f46" : "#991B1B"} />
                </View>
                <Text style={styles.modalTitle}>{analysisResult?.esSeguro ? "Medicina Detectada" : "Atención"}</Text>
              </View>

              <View style={styles.resultCard}>
                <Text style={styles.resLabel}>NOMBRE</Text>
                <Text style={styles.resValue}>{analysisResult?.nombre}</Text>
                {analysisResult?.esSeguro && (
                  <>
                    <Text style={styles.resLabel}>DOSIS</Text>
                    <Text style={styles.resValue}>{analysisResult?.dosis}</Text>
                  </>
                )}
              </View>

              {analysisResult?.alerta && (
                <View style={[styles.alertBar, { borderLeftColor: analysisResult?.esSeguro ? '#F59E0B' : '#EF4444' }]}>
                  <Ionicons name="information-circle" size={20} color={analysisResult?.esSeguro ? "#B45309" : "#991B1B"} />
                  <Text style={styles.alertContent}>{analysisResult.alerta}</Text>
                </View>
              )}

              {analysisResult?.esSeguro && (
                <View style={{ marginTop: 15 }}>
                  <Text style={styles.resLabel}>FRECUENCIA</Text>
                  <View style={styles.chipGroup}>
                    {['Cada 8h', 'Cada 12h', 'Cada 24h'].map(f => (
                      <TouchableOpacity key={f} style={[styles.chip, selectedFreq === f && styles.chipActive]} onPress={() => setSelectedFreq(f)}>
                        <Text style={[styles.chipText, selectedFreq === f && styles.chipTextActive]}>{f}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              <Text style={styles.legal}>Buddy AI es un asistente, no un médico. Verifica con el profesional de salud.</Text>

              <View style={styles.finalActions}>
                <TouchableOpacity style={styles.btnOutline} onPress={() => setShowModal(false)}>
                  <Text style={styles.btnOutlineText}>Cancelar</Text>
                </TouchableOpacity>
                {analysisResult?.esSeguro && (
                  <TouchableOpacity style={styles.btnFull} onPress={saveToFirebase}>
                    <Text style={styles.btnFullText}>Guardar en Buddy</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
  // ESCÁNER
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // Crucial para que se vea la cámara
  },
  scannerFrame: {
    width: width * 0.75, // Recuadro al 75% del ancho de la pantalla
    height: width * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#98FFD8', // Color de Buddy
  },
  topL: { top: 0, left: 0, borderTopWidth: 5, borderLeftWidth: 5, borderTopLeftRadius: 20 },
  topR: { top: 0, right: 0, borderTopWidth: 5, borderRightWidth: 5, borderTopRightRadius: 20 },
  botL: { bottom: 0, left: 0, borderBottomWidth: 5, borderLeftWidth: 5, borderBottomLeftRadius: 20 },
  botR: { bottom: 0, right: 0, borderBottomWidth: 5, borderRightWidth: 5, borderBottomRightRadius: 20 },
  scanText: {
    color: 'white',
    marginTop: 30, // Separación del texto
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'black', // Sombra para que se lea sobre cualquier fondo
    textShadowRadius: 8,
  },
  
  // CONTROLES
  bottomControls: { position: 'absolute', bottom: 50, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 30 },
  glassBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  outerCapture: { width: 84, height: 84, borderRadius: 42, borderWidth: 4, borderColor: '#98FFD8', justifyContent: 'center', alignItems: 'center' },
  innerCapture: { width: 68, height: 68, borderRadius: 34, backgroundColor: 'white' },
  backFab: { position: 'absolute', top: 60, left: 25, width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },

  // PREVIEW
  previewContainer: { flex: 1, backgroundColor: '#0F172A' },
  fullPreview: { ...StyleSheet.absoluteFillObject, resizeMode: 'cover' },
  previewOverlay: { position: 'absolute', bottom: 0, width: '100%', padding: 30, backgroundColor: 'rgba(15,23,42,0.85)', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  previewTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 25 },
  previewActions: { flexDirection: 'row', gap: 15 },
  primaryAction: { flex: 2, backgroundColor: '#98FFD8', padding: 18, borderRadius: 20, alignItems: 'center' },
  primaryActionText: { color: '#065f46', fontWeight: 'bold', fontSize: 16 },
  secondaryAction: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', padding: 18, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  secondaryActionText: { color: 'white', fontWeight: '600' },

  // MODAL
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 25, height: '80%' },
  modalIndicator: { width: 50, height: 5, backgroundColor: '#E2E8F0', borderRadius: 10, alignSelf: 'center', marginBottom: 20 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  iconBox: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#1E293B', marginLeft: 15 },
  resultCard: { backgroundColor: '#F8FAFC', padding: 20, borderRadius: 25, marginBottom: 15 },
  resLabel: { fontSize: 10, color: '#64748B', fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 5 },
  resValue: { fontSize: 18, fontWeight: '600', color: '#1E293B', marginBottom: 15 },
  alertBar: { backgroundColor: '#FFFBEB', padding: 15, borderRadius: 15, flexDirection: 'row', gap: 12, borderLeftWidth: 5 },
  alertContent: { flex: 1, color: '#92400E', fontSize: 13, lineHeight: 18 },
  chipGroup: { flexDirection: 'row', gap: 10, marginTop: 10 },
  chip: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  chipActive: { backgroundColor: '#065f46', borderColor: '#065f46' },
  chipText: { color: '#64748B', fontWeight: '600' },
  chipTextActive: { color: 'white' },
  legal: { fontSize: 11, color: '#94A3B8', textAlign: 'center', marginVertical: 25, fontStyle: 'italic' },
  finalActions: { flexDirection: 'row', gap: 15 },
  btnOutline: { flex: 1, padding: 18, alignItems: 'center' },
  btnOutlineText: { color: '#64748B', fontWeight: 'bold' },
  btnFull: { flex: 2, backgroundColor: '#98FFD8', padding: 18, borderRadius: 20, alignItems: 'center', elevation: 4 },
  btnFullText: { color: '#065f46', fontWeight: 'bold', fontSize: 16 },

  // PERMISSION
  permissionContainer: { flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', padding: 40 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#98FFD8', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  permissionTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 10 },
  permissionText: { textAlign: 'center', color: '#64748B', lineHeight: 22, marginBottom: 30 },
  mainBtn: { backgroundColor: '#065f46', paddingHorizontal: 40, paddingVertical: 18, borderRadius: 20 },
  mainBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },


  buttonContainer: { position: 'absolute', bottom: 40, width: '100%' },
  controlsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' },
  captureBtn: { width: 75, height: 75, borderRadius: 37.5, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  innerCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'white' },
  secondaryBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  closeBtn: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  
});