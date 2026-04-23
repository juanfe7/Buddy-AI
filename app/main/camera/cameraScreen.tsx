import { Ionicons } from '@expo/vector-icons';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Inicialización de la IA
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_API_KEY || "");

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<any>(null);
  const router = useRouter();

  if (!permission) return <View style={styles.container} />; 

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color="#64748B" />
        <Text style={styles.permissionText}>Buddy necesita acceso a tu cámara para analizar las medicinas.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.text}>Dar Permiso</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: '#64748B' }}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync({
          quality: 0.5,
        });
        setPhoto(data.uri);
      } catch (e) {
        console.log(e);
        Alert.alert("Error", "No se pudo tomar la foto");
      }
    }
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  }

  async function analyzeMedicine() {
    if (!photo) return;
    
    setIsAnalyzing(true);
    try {
      const base64Photo = await FileSystem.readAsStringAsync(photo, {
        encoding: 'base64',
      });

      const apiKey = process.env.EXPO_PUBLIC_API_KEY;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

      const body = {
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Photo
                }
              },
              { 
                text: `Analiza la imagen detalladamente. 
                Si es un medicamento, extrae su información. 
                Si NO es un medicamento, describe qué estás viendo (por ejemplo: "veo una pantalla de computador con código", "veo una persona", etc.).
                
                Responde ÚNICAMENTE con este formato JSON:
                {
                  "nombre": "Nombre del medicamento o descripción de lo que ves",
                  "dosis": "Dosis o 'N/A'",
                  "instrucciones": "Instrucciones de uso o descripción detallada de la escena",
                  "alerta": "Advertencia médica o comentario sobre el objeto detectado",
                  "esSeguro": true (solo si es un medicamento identificado) / false (si no lo es)
                }` 
              }
            ]
          }
        ]
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Error en el servidor");
      }

      let responseText = data.candidates[0].content.parts[0].text;
      
      // LOG PARA VER QUÉ ESTÁ DICIENDO LA IA REALMENTE
      console.log("Respuesta cruda de la IA:", responseText);

      // LIMPIEZA EXTREMA: Quitamos bloques de código y espacios raros
      const cleanedText = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        console.log("No se pudo extraer JSON de:", cleanedText);
        throw new Error("Formato de respuesta inválido");
      }
      
      const medicineData = JSON.parse(jsonMatch[0]);

      Alert.alert(
        medicineData.esSeguro ? "✅ Medicamento Identificado" : "⚠️ Alerta Buddy",
        `${medicineData.nombre}\n\nInstrucciones: ${medicineData.instrucciones}\n\nNota: ${medicineData.alerta}`,
        [{ text: "Entendido", onPress: () => {
          setPhoto(null);
          router.back();
        }}]
      );

    } catch (error: any) {
      console.error("Error analizando:", error);
      Alert.alert("Buddy AI", "No se pudo procesar la respuesta. Intenta con una foto más clara de la caja.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <View style={styles.container}>
      {!photo ? (
        <View style={{ flex: 1 }}>
          <CameraView style={styles.camera} ref={cameraRef} facing="back" />
          <View style={StyleSheet.absoluteFillObject}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>
              <View style={styles.controlsRow}>
                <TouchableOpacity style={styles.secondaryBtn} onPress={pickImage}>
                  <Ionicons name="images" size={28} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
                  <View style={styles.innerCircle} />
                </TouchableOpacity>
                <View style={styles.secondaryBtn}>
                   <Ionicons name="camera-reverse-outline" size={28} color="transparent" />
                </View>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.retryBtn} 
              onPress={() => setPhoto(null)}
              disabled={isAnalyzing}
            >
              <Text style={styles.btn1Text}>Repetir</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.confirmBtn, isAnalyzing && { opacity: 0.7 }]} 
              onPress={analyzeMedicine}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <ActivityIndicator color="#065f46" />
              ) : (
                <Text style={styles.btnText}>Analizar Medicina</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  permissionContainer: { flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', padding: 20 },
  permissionText: { textAlign: 'center', fontSize: 16, color: '#334155', marginVertical: 20, lineHeight: 22 },
  camera: { flex: 1 },
  buttonContainer: { flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-end', paddingBottom: 40 },
  controlsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' },
  secondaryBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  button: { backgroundColor: '#98FFD8', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  text: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  captureBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  innerCircle: { width: 65, height: 65, borderRadius: 32.5, backgroundColor: 'white' },
  closeBtn: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  previewContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' },
  preview: { width: '90%', height: '65%', borderRadius: 20, resizeMode: 'contain' },
  actionButtons: { flexDirection: 'row', marginTop: 30, gap: 15 },
  retryBtn: { backgroundColor: '#64748B', paddingHorizontal: 25, paddingVertical: 15, borderRadius: 12, minWidth: 100, alignItems: 'center' },
  confirmBtn: { backgroundColor: '#98FFD8', paddingHorizontal: 25, paddingVertical: 15, borderRadius: 12, minWidth: 180, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#065f46', fontWeight: 'bold', fontSize: 15 },
  btn1Text: { color: 'white', fontWeight: 'bold', fontSize: 15 }
});