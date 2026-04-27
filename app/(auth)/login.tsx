import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Importamos tu logo real
import logoImg from '../../assets/images/logo.png';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Lógica de "Bypass" para la Hackatón:
    // Nos manda directamente al home de los tabs
    router.replace('/main/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Header con Logo Real */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
              <Image 
                source={logoImg} 
                style={styles.logoImage} 
                resizeMode="contain" 
              />
          </View>
          <Text style={styles.title}>Bienvenido a Buddy AI</Text>
          <Text style={styles.subtitle}>Tu asistente inteligente para cuidar a Don Carlos</Text>
        </View>

        {/* Card de Formulario */}
        <View style={styles.formCard}>
          <Text style={styles.label}>Acceso de Cuidador</Text>
          
          <View style={styles.inputWrapper}>
            <Ionicons name="mail" size={20} color="#64748B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo del Cuidador"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed" size={20} color="#64748B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity>
            <Text style={styles.forgotText}>¿Olvidaste la contraseña?</Text>
          </TouchableOpacity>

          {/* Botón de Demo */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Iniciar Demo Directa</Text>
            <Ionicons name="arrow-forward" size={20} color="#065F46" />
          </TouchableOpacity>

          <View style={styles.footerLinks}>
            <Text style={styles.noAccountText}>¿No tienes una cuenta instalada?</Text>
            <TouchableOpacity>
              <Text style={styles.contactSupport}>Contactar Soporte Médico</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer de Seguridad */}
        <View style={styles.footer}>
          <View style={styles.securityIcons}>
            <MaterialCommunityIcons name="shield-check" size={20} color="#64748B" style={{marginRight: 10}} />
            <MaterialCommunityIcons name="google-cloud" size={20} color="#64748B" />
          </View>
          <Text style={styles.securityText}>PROTECCIÓN DE DATOS MÉDICOS DE GRADO CLÍNICO</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F9F6' },
  content: { flex: 1, paddingHorizontal: 30, justifyContent: 'center' },
  
  header: { alignItems: 'center', marginBottom: 40 },
  logoContainer: { 
    width: 80, height: 80, borderRadius: 22, 
    backgroundColor: 'white', justifyContent: 'center', 
    alignItems: 'center', marginBottom: 20,
    elevation: 6, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12,
    overflow: 'hidden' // Para que la imagen no se salga de los bordes redondeados
  },
  logoImage: {
    width: '80%',
    height: '80%',
  },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#64748B', textAlign: 'center', paddingHorizontal: 20 },

  formCard: { 
    backgroundColor: 'white', padding: 25, borderRadius: 30,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15
  },
  label: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 20 },
  
  inputWrapper: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#F8FAFC', borderRadius: 15, 
    paddingHorizontal: 15, marginBottom: 15, height: 55,
    borderWidth: 1, borderColor: '#F1F5F9'
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#1E293B' },
  
  forgotText: { 
    textAlign: 'right', color: '#059669', 
    fontSize: 13, fontWeight: '600', marginBottom: 25 
  },

  loginButton: { 
    backgroundColor: '#98FFD8', flexDirection: 'row', 
    justifyContent: 'center', alignItems: 'center', 
    height: 60, borderRadius: 30, marginBottom: 25
  },
  loginButtonText: { 
    fontSize: 18, fontWeight: 'bold', 
    color: '#065F46', marginRight: 10 
  },

  footerLinks: { alignItems: 'center' },
  noAccountText: { fontSize: 13, color: '#64748B', marginBottom: 5 },
  contactSupport: { fontSize: 14, fontWeight: 'bold', color: '#065F46' },

  footer: { alignItems: 'center', marginTop: 40 },
  securityIcons: { flexDirection: 'row', marginBottom: 8 },
  securityText: { 
    fontSize: 10, color: '#94A3B8', 
    letterSpacing: 1, textAlign: 'center' 
  }
});