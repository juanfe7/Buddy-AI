# Buddy AI 🤖💊
### *Inteligencia Artificial al servicio del cuidado de nuestros mayores*

**Buddy AI** es un asistente integral de salud diseñado para cuidadores de adultos mayores. El proyecto nace de la necesidad de reducir los errores en la medicación y mejorar el seguimiento del bienestar general mediante el uso de Inteligencia Artificial generativa y visión computacional.

---

## 🚀 Propuesta de Valor
En el contexto de una hackatón de innovación, **Buddy AI** transforma la gestión del cuidado mediante:
* **Digitalización con IA:** Escaneo y análisis automático de recetas médicas y empaques de medicinas.
* **Seguimiento Predictivo:** Monitoreo de adherencia y detección temprana de interacciones medicamentosas peligrosas.
* **Dashboard Unificado:** Control total para el cuidador con visualización de ubicación y estados de salud en tiempo real.

---

## 🛠️ Stack Tecnológico
Este proyecto integra lo último en tecnologías de desarrollo móvil y computación en la nube:

* **Frontend:** [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/) (SDK 51)
* **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
* **Diseño de UI:** [React Native Paper](https://reactnativepaper.com/) (Material Design 3)
* **Inteligencia Artificial:** [Google Gemini 1.5 Flash](https://aistudio.google.com/) (Vertex AI / Google AI SDK)
* **Backend & Base de Datos:** [Firebase](https://firebase.google.com/) (Firestore & Authentication)
* **Herramientas de Diseño:** [Galileo AI](https://www.usegalileo.ai/) y [Figma](https://www.figma.com/)

---

## ✨ Funcionalidades

### Implementadas (Prototipo Inicial)
* **Panel del Cuidador:** Vista general de adherencia diaria (85% de cumplimiento).
* **Gestión de Medicamentos:** Listado de dosis del día con estados visuales (Tomada, Pendiente, Olvidada).
* **Mapa de Seguridad:** Localización en tiempo real del paciente para tranquilidad del cuidador.

### En Desarrollo (Roadmap Hackatón)
* **Módulo de Visión (Gemini Vision):** Escaneo de cajas de medicamentos para extraer automáticamente nombre, dosis y advertencias.
* **Alertas de Interacción:** Notificaciones automáticas cuando la IA detecta que dos medicamentos mezclados son peligrosos.
* **Geocercas (Safe Zones):** Notificaciones si el paciente sale de un perímetro seguro.

---

## 📦 Instalación y Configuración

Para ejecutar este proyecto en tu entorno local:

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/juanfe7/Buddy-AI.git](https://github.com/juanfe7/Buddy-AI.git)
    cd Buddy-AI
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` o añade tus llaves de API en el archivo de configuración correspondiente:
    - `EXPO_PUBLIC_GEMINI_API_KEY`: Tu llave de Google AI Studio.

4.  **Iniciar el desarrollo:**
    ```bash
    npx expo start
    ```

---

## 👥 Equipo - Universidad de La Sabana

* **Juan Felipe Cárdenas** - *Lead Full Stack Developer & AI Integration* (Arquitectura de software, desarrollo de Frontend en React Native, lógica de Backend y conexión con APIs de Google Cloud/Gemini).
  
* **Samuel Ortiz** - *Product Research & Technical Support* (Investigación de usuario, validación de flujos de navegación y soporte en documentación técnica).

* **Santiago Saboya** - *Data & Cloud Strategy* (Estrategia de datos y gestión de recursos en Google Cloud).

* **Ana Vega** - *Pharmaceutical Logic & QA* (Investigación de medicamentos y control de calidad de respuestas de la IA).

* **zhaira Paredes** - *Business Strategy & Pitch* (Modelo de negocio, presentación final y documentación de impacto).

---

## 📄 Créditos
Desarrollado para la **Google Cloud Hackathon 2026**.
