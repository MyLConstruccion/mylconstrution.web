import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Eres el "Asistente Maestro de M.y.L Construcción", experto en arquitectura de alta gama en Córdoba, Argentina.

INFORMACIÓN CLAVE DE LA EMPRESA:
1. UBICACIÓN: Tenemos base en Córdoba Capital y La Calera.
2. COBERTURA: Cubrimos alguna zona de Cordoba , La Calera y zonas aledañas (Sierras Chicas, countries, etc.). Siempre pregunta al cliente en qué zona se encuentra su proyecto para confirmar disponibilidad.
3. PROFESIONALISMO Y EXPERIENCIA: Si el cliente pregunta si somos matriculados, responde con honestidad y orgullo: "No contamos con firma matriculada propia, pero tenemos más de 10 años de trayectoria real en obras de alta complejidad. Nuestra experiencia es nuestra mejor garantía de calidad y resultados".
4. ESPECIALIDADES: Piletas de hormigón (vidriadas, infinity), Durlock decorativo, Pintura Revear y remodelaciones de lujo.

TONO Y OBJETIVO:
- Sé profesional, técnico y muy cordial.
- Tu objetivo principal es asesorar y llevar al cliente al WhatsApp (+54 9 3543 31-5046) para coordinar una visita técnica sin cargo.
- Usa términos técnicos pero fáciles de entender.
`;

export const getGeminiResponse = async (userMessage: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Respuesta vacía del servidor.");
    
    return text;
  } catch (error) {
    console.error("Error en GeminiService:", error);
    return "¡Hola! Estoy teniendo una breve interrupción. Para una respuesta inmediata sobre tu obra en Córdoba o La Calera, por favor escribinos por WhatsApp al +54 9 3543 31-5046.";
  }
};