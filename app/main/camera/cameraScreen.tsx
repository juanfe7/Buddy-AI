import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker'; // Importamos el picker
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
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

  // FUNCIÓN PARA TOMAR FOTO
  async function takePicture() {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          base64: true,
        });
        setPhoto(data.uri);
      } catch (e) {
        console.log(e);
        Alert.alert("Error", "No se pudo tomar la foto");
      }
    }
  }

  // FUNCIÓN PARA ABRIR GALERÍA
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

  return (
    <View style={styles.container}>
      {!photo ? (
        <CameraView style={styles.camera} ref={cameraRef} facing="back">
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
            
            {/* Contenedor de acciones inferiores */}
            <View style={styles.controlsRow}>
              {/* Botón Galería */}
              <TouchableOpacity style={styles.secondaryBtn} onPress={pickImage}>
                <Ionicons name="images" size={28} color="white" />
              </TouchableOpacity>

              {/* Botón Disparo (BOOM) */}
              <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
                <View style={styles.innerCircle} />
              </TouchableOpacity>

              {/* Espacio para equilibrio visual o botón de girar cámara si quieres */}
              <View style={styles.secondaryBtn}>
                 <Ionicons name="camera-reverse-outline" size={28} color="transparent" />
              </View>
            </View>
          </View>
        </CameraView>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.retryBtn} onPress={() => setPhoto(null)}>
              <Text style={styles.btn1Text}>Repetir</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.confirmBtn} 
              onPress={() => Alert.alert("Buddy AI", "Analizando medicina...")}
            >
              <Text style={styles.btnText}>Analizar Medicina</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // ... Tus estilos anteriores se mantienen ...
  container: { flex: 1, backgroundColor: 'black' },
  permissionContainer: { flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', padding: 20 },
  permissionText: { textAlign: 'center', fontSize: 16, color: '#334155', marginVertical: 20, lineHeight: 22 },
  camera: { flex: 1 },
  buttonContainer: { flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-end', paddingBottom: 40 },
  
  // NUEVO: Fila de controles
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  
  secondaryBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: { backgroundColor: '#98FFD8', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  text: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  captureBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  innerCircle: { width: 65, height: 65, borderRadius: 32.5, backgroundColor: 'white' },
  closeBtn: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  previewContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' },
  preview: { width: '90%', height: '70%', borderRadius: 20, resizeMode: 'contain' },
  actionButtons: { flexDirection: 'row', marginTop: 30, gap: 20 },
  retryBtn: { backgroundColor: '#64748B', paddingHorizontal: 25, paddingVertical: 15, borderRadius: 12 },
  confirmBtn: { backgroundColor: '#98FFD8', paddingHorizontal: 25, paddingVertical: 15, borderRadius: 12 },
  btnText: { color: '#065f46', fontWeight: 'bold', fontSize: 15 },
  btn1Text: { color: 'white', fontWeight: 'bold', fontSize: 15 }
});