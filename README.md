# Buddy AI 🤖💊
### *Inteligencia Artificial al servicio del cuidado de nuestros mayores*

**Buddy AI** es un asistente integral de salud diseñado para cuidadores de adultos mayores. El proyecto nace de la necesidad de reducir los errores en la medicación y mejorar el seguimiento del bienestar mediante el uso de IA Generativa y visión computacional, permitiendo una gestión humana y técnica del cuidado.

---

## 🚀 Propuesta de Valor
En el contexto de la **Google Cloud Hackathon 2026**, **Buddy AI** redefine la gestión del cuidado mediante:
* **Visión Computacional:** Escaneo y análisis en tiempo real de empaques de medicinas para evitar errores de transcripción manual.
* **Chatbot Empático:** Un asistente conversacional que no solo registra datos, sino que entiende el contexto del cuidador y alerta sobre interacciones medicamentosas peligrosas.
* **Gestión Basada en Datos:** Centralización de horarios y dosis en una nube reactiva para un control total del historial médico.

---

## 🛠️ Stack Tecnológico
* **Frontend:** [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/) (SDK 51)
* **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
* **IA Generativa:** [Google Gemini 1.5 Flash](https://aistudio.google.com/) (Análisis de imágenes y lógica de procesamiento de lenguaje natural)
* **Backend & DB:** [Firebase](https://firebase.google.com/) (Cloud Firestore para persistencia y actualización en tiempo real)
* **Estilos:** [React Native Paper](https://reactnativepaper.com/) & Material Design

---

## ✨ Funcionalidades Actuales (MVP Hackatón)

### 📸 Módulo de Visión (Buddy Scan)
* **Reconocimiento Automático:** Al tomar una foto a una medicina, la IA extrae el nombre, la dosis y las instrucciones de uso.
* **Validación de Seguridad:** Buddy analiza si el medicamento detectado es apto para el paciente según su historial registrado.
* **UX de Escáner:** Interfaz visual con overlay de escaneo para guiar al usuario en la captura de la imagen.

### 💬 Chatbot de Asistencia (Buddy Chat)
* **Gestión Natural:** Permite agregar o eliminar medicamentos de la lista mediante lenguaje natural (ej: *"Buddy, ya no le des Ibuprofeno a Don Carlos"*).
* **Detección de Interacciones:** Si el usuario intenta agregar un medicamento que presenta riesgos con los actuales, la IA advierte sobre el peligro farmacológico antes de guardar.
* **Interfaz de Chat Avanzada:** Soporte para múltiples líneas de texto y diseño responsivo para una comunicación fluida.

### 📋 Dashboard de Medicamentos
* **Lista de Seguimiento:** Visualización clara de los medicamentos programados, dosis y frecuencias.
* **Próxima Dosis:** Card inteligente que resalta el medicamento más cercano a ser administrado.

---

## 📅 Roadmap (Futuras Implementaciones)
* **Sistema de Notificaciones Push:** Alertas en tiempo real para recordar las tomas exactas.
* **Módulo de Ubicación:** Rastreo GPS y creación de geocercas para la seguridad del paciente fuera de casa.
* **Reportes para Médicos:** Generación de resúmenes de cumplimiento en PDF para consultas profesionales.

---

## 📦 Instalación y Configuración

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/juanfe7/Buddy-AI.git](https://github.com/juanfe7/Buddy-AI.git)
    cd Buddy-AI
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Variables de Entorno:**
    Crea un archivo `.env` en la raíz con tu API Key de Google:
    ```env
    EXPO_PUBLIC_API_KEY=TU_API_KEY_AQUI
    ```

4.  **Ejecutar el proyecto:**
    ```bash
    npx expo start
    ```

---

## 👥 Equipo - Universidad de La Sabana
* **Juan Felipe Cárdenas** - *Lead Full Stack Developer & AI Integration*
* **Samuel Ortiz** - *Product Research & Technical Support*
* **Santiago Saboya** - *Data & Cloud Strategy*
* **Ana Vega** - *Pharmaceutical Logic & QA*
* **Zhaira Paredes** - *Business Strategy & Pitch*

---
**Desarrollado para la Google Cloud Hackathon 2026.**
