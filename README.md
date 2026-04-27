# Buddy AI 🤖💊
### *Ecosistema de Salud Inteligente: Elevando el cuidado de nuestros mayores con Google Cloud*

**Buddy AI** es una plataforma de salud reactiva diseñada para cerrar la brecha entre el cuidador y el adulto mayor. Mediante el uso de **IA Generativa de última generación** y **computación en la nube**, transformamos el cuidado doméstico en una gestión de precisión, reduciendo errores de medicación y proporcionando tranquilidad a las familias.

---

## 🚀 Propuesta de Valor Estratégica
En el marco de la **Google Cloud Hackathon 2026**, Buddy AI presenta una solución integral basada en tres pilares:

* **Interoperabilidad Reactiva:** Arquitectura basada en eventos que sincroniza la gestión del cuidador con una interfaz simplificada para el paciente en tiempo real.
* **Seguridad Farmacológica Proactiva:** Análisis instantáneo de interacciones medicamentosas utilizando **Gemini 1.5 Flash**, con una arquitectura lista para escalar a **Vertex AI**.
* **Visión Computacional Predictiva:** Extracción de datos críticos de empaques médicos mediante OCR inteligente para eliminar el error humano en el registro.

---

## 🛠️ Stack Tecnológico de Nivel Empresarial
* **Core Engine:** [Google Gemini 1.5 Flash](https://aistudio.google.com/) (Preparado para despliegue en **Vertex AI** para control avanzado de parámetros y seguridad de datos).
* **Frontend:** [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/) (SDK 51 - Arquitectura multiplataforma de alto rendimiento).
* **Data Layer:** [Firebase](https://firebase.google.com/) (Cloud Firestore para una base de datos NoSQL con sincronización bidireccional inmediata).
* **Language:** [TypeScript](https://www.typescriptlang.org/) (Tipado estricto para garantizar la estabilidad del software).

---

## ✨ Funcionalidades Destacadas (MVP Hackatón)

### 📸 Buddy Scan (Módulo de Visión)
* **Análisis Multimodal:** Reconoce nombres comerciales, componentes activos y dosis directamente desde la cámara.
* **Validación de Historial:** Cruza los datos escaneados con la base de datos de medicamentos actuales del paciente para detectar duplicidades o riesgos potenciales.
* **UX de Escáner:** Interfaz visual con overlay dinámico para guiar al usuario en la captura precisa de la medicina.

### 💬 Buddy Chat (Asistente de Cuidados)
* **Control Natural de Base de Datos:** Gestión total de la medicación (altas y bajas) mediante procesamiento de lenguaje natural (NLP).
* **Inteligencia de Seguridad:** Motor de reglas basado en IA que advierte sobre interacciones peligrosas antes de que se guarden en el esquema de salud.
* **Interfaz Avanzada:** Soporte para entrada multilínea y diseño responsivo para una comunicación fluida.

### 🔍 Gestión y Búsqueda en Tiempo Real
* **Búsqueda Inteligente:** Motor de búsqueda integrado para filtrar y localizar medicamentos en la base de datos de manera instantánea.
* **Dashboard de Adherencia:** Visualización dinámica que resalta la "Próxima Dosis" calculada automáticamente por el backend reactivo.

---

## 📱 Visión de Ecosistema: App del Paciente
Buddy AI incluye el diseño de una **Interfaz de Paciente Reactiva**, una aplicación simplificada para el adulto mayor que:
* Recibe actualizaciones instantáneas mediante `onSnapshot` cuando el cuidador modifica el tratamiento.
* Presenta botones de confirmación de alta visibilidad para registrar tomas.
* Elimina la fricción tecnológica, permitiendo que el paciente solo interactúe con lo estrictamente necesario.

---

## 📅 Roadmap de Escalabilidad
* **Vertex AI Migration:** Implementación de modelos ajustados (Fine-tuning) para protocolos médicos específicos.
* **Ecosistema de Notificaciones:** Sistema de alertas push sincronizadas entre dispositivos.
* **Geofencing de Seguridad:** Monitoreo de ubicación y zonas seguras integrado con Google Maps Platform.

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

3.  **Configuración de API Keys:**
    Crea un archivo `.env` en la raíz del proyecto:
    ```env
    EXPO_PUBLIC_API_KEY=TU_API_KEY_DE_GOOGLE_CLOUD
    ```

4.  **Lanzamiento:**
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
**Buddy AI: Innovación con propósito para la Google Cloud Hackathon 2026.**
