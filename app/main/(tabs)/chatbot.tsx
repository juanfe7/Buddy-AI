import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../../services/firebaseConfig';

export default function ChatbotScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentMeds, setCurrentMeds] = useState<any[]>([]); // Aquí guardaremos objetos {id, nombre}

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    const q = query(collection(db, "Schedules"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const medsData = snapshot.docs.map(doc => ({
        id: doc.id,
        nombre: doc.data().nombre
      }));
      setCurrentMeds(medsData);

      if (messages.length === 0) {
        setMessages([{
          id: '1',
          text: medsData.length > 0 
            ? `Hola María, soy Buddy. Estoy pendiente de Don Carlos (veo que toma ${medsData[0].nombre}). ¿En qué puedo apoyarte?`
            : 'Hola María, soy Buddy. ¿En qué puedo apoyarte con el cuidado de Don Carlos hoy?',
          sender: 'ai',
          time: getCurrentTime()
        }]);
      }
    });
    return () => unsubscribe();
  }, [messages.length]);

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage = { id: Date.now().toString(), text: inputText, sender: 'user', time: getCurrentTime() };
    setMessages(prev => [...prev, userMessage]);
    const textToAnalyze = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const nombresMeds = currentMeds.map(m => m.nombre).join(', ');
      const context = `Eres Buddy, un asistente de IA empático para cuidadores. Paciente: Don Carlos. 
        Medicamentos actuales: ${nombresMeds || 'Ninguno'}.

        REGLAS CRÍTICAS DE SEGURIDAD:
        1. Si el usuario intenta agregar un medicamento que pueda tener interacciones negativas con los actuales (ej: mezclar anticoagulantes, duplicar dosis, o contraindicaciones comunes), advierte a María amablemente pero con claridad ANTES de confirmar la acción.
        2. Si el medicamento es seguro, procede normalmente.

        ACCIONES ESPECIALES:
        1. Para AGREGAR: [ACCION:AGREGAR:Nombre:Dosis:Frecuencia]
        2. Para BORRAR: [ACCION:BORRAR:NombreExacto]

        Responde siempre de forma corta y humana y sé muy estricto con la seguridad farmacológica`;

      const apiKey = process.env.EXPO_PUBLIC_API_KEY;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `${context}\n\nUsuario: ${textToAnalyze}` }] }] })
      });

      const data = await response.json();
      let aiResponseText = data.candidates[0].content.parts[0].text;

      // LÓGICA DE AGREGAR
      if (aiResponseText.includes('[ACCION:AGREGAR:')) {
        const parts = aiResponseText.split('[ACCION:AGREGAR:')[1].split(']')[0].split(':');
        await addDoc(collection(db, "Schedules"), {
          nombre: parts[0] || "Nuevo Med",
          dosis: parts[1] || "N/A",
          frecuencia: parts[2] || "N/A",
          estado: 'pendiente',
          hora: '08:00 AM',
          createdAt: serverTimestamp(),
        });
        aiResponseText = aiResponseText.split('[ACCION:')[0] + "\n\n✅ ¡Hecho! Ya lo agregué a la lista.";
      }

      // LÓGICA DE BORRAR (Blindada)
      if (aiResponseText.includes('[ACCION:BORRAR:')) {
        // 1. Extraemos el nombre y lo limpiamos de posibles puntos o espacios que ponga la IA
        const rawMatch = aiResponseText.split('[ACCION:BORRAR:')[1].split(']')[0];
        const medNameToDelete = rawMatch.replace(/[.,]/g, '').trim().toLowerCase();
        
        // 2. Buscamos el medicamento ignorando mayúsculas/minúsculas
        const targetMed = currentMeds.find(m => 
          m.nombre.toLowerCase().trim() === medNameToDelete
        );

        if (targetMed) {
          try {
            await deleteDoc(doc(db, "Schedules", targetMed.id));
            // Limpiamos el texto de la respuesta para que no se vea el comando técnico
            aiResponseText = aiResponseText.split('[ACCION:')[0].trim() + `\n\n🗑️ Hecho, María. He eliminado ${targetMed.nombre} de la lista de Don Carlos.`;
          } catch (dbError) {
            console.error("Error eliminando:", dbError);
            aiResponseText = "Tuve un problema técnico al intentar borrar el medicamento.";
          }
        } else {
          // Si no lo encuentra, le damos una respuesta coherente
          aiResponseText = `No encontré ningún medicamento llamado "${rawMatch}" en mi lista actual. ¿Seguro que está registrado?`;
        }
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), text: aiResponseText, sender: 'ai', time: getCurrentTime() }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), text: 'Error de conexión.', sender: 'ai', time: getCurrentTime() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container} keyboardVerticalOffset={90}>
      <ScrollView contentContainerStyle={styles.chatList} showsVerticalScrollIndicator={false}>
        <View style={styles.dateDivider}><Text style={styles.dateText}>Hoy</Text></View>
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.messageWrapper, msg.sender === 'user' ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }]}>
            <View style={styles.senderHeader}>
              {msg.sender === 'ai' && <View style={styles.smallBotIcon}><MaterialCommunityIcons name="robot" size={14} color="#065F46" /></View>}
              <Text style={styles.senderName}>{msg.sender === 'ai' ? 'Buddy AI' : 'Tu'}</Text>
            </View>
            <View style={[styles.messageBubble, msg.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
              <Text style={[styles.messageText, msg.sender === 'user' ? styles.userText : styles.aiText]}>{msg.text}</Text>
            </View>
            <Text style={styles.timeText}>{msg.time}</Text>
          </View>
        ))}
        {isTyping && <ActivityIndicator color="#065F46" style={{ alignSelf: 'flex-start', marginLeft: 20 }} />}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachBtn} onPress={() => router.push('/main/camera/cameraScreen' as any)}>
          <Ionicons name="add" size={28} color="#64748B" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          placeholderTextColor="#94A3B8"
          value={inputText}
          onChangeText={setInputText}
          multiline={true} // Permite múltiples líneas
          maxLength={500}   // Limite opcional de caracteres
          blurOnSubmit={false} // Evita que se cierre el teclado al dar enter
        />
        <TouchableOpacity style={styles.micBtn}><Ionicons name="mic" size={24} color="#64748B" /></TouchableOpacity>
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Ionicons name="send" size={20} color="#065F46" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  botIcon: { width: 35, height: 35, borderRadius: 10, backgroundColor: '#065F46', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  headerSub: { fontSize: 12, color: '#64748B' },
  
  chatList: { padding: 20 },
  dateDivider: { alignItems: 'center', marginVertical: 10 },
  dateText: { backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, fontSize: 12, color: '#64748B', overflow: 'hidden' },
  
  messageWrapper: { marginBottom: 20 },
  senderHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, marginLeft: 5 },
  smallBotIcon: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#98FFD8', justifyContent: 'center', alignItems: 'center', marginRight: 5 },
  senderName: { fontSize: 13, fontWeight: 'bold', color: '#1E293B' },
  
  messageBubble: { padding: 15, borderRadius: 18, maxWidth: '85%' },
  aiBubble: { backgroundColor: 'white', borderTopLeftRadius: 0, borderBottomLeftRadius: 18 },
  userBubble: { backgroundColor: '#98FFD8', borderTopRightRadius: 0, borderBottomRightRadius: 18 },
  messageText: { fontSize: 15, lineHeight: 22 },
  aiText: { color: '#1E293B' },
  userText: { color: '#065F46' },
  timeText: { fontSize: 11, color: '#94A3B8', marginTop: 4, marginHorizontal: 5 },

  inputContainer: { flexDirection: 'row', padding: 15, backgroundColor: 'white', alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 30 : 15 },
  attachBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: '#1E293B' },
  micBtn: { padding: 10 },
  sendBtn: { backgroundColor: '#98FFD8', width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginLeft: 5 }
});