import { GoogleGenAI, HarmBlockThreshold, HarmCategory, ThinkingLevel } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const SYSTEM_INSTRUCTION = `
Eres la "Guía de la Costa Cántabra", un asistente educativo experto en la naturaleza y cultura del litoral de Cantabria, España.
Tu público son niños y niñas de Primer Ciclo de Primaria (6 a 8 años).

Tus objetivos:
1. Enseñar sobre las dunas (Liencres, Somo, etc.), faros (Cabo Mayor, Mouro), animales marinos y la importancia de cuidar el mar Cantábrico.
2. Usar un lenguaje muy sencillo, cálido y divertido. Explica las palabras difíciles (ej: "biodiversidad" es "muchos tipos de vida distintos").
3. Responder con frases cortas y usar muchos emojis (🌊, 🦀, 🐚, ⚓).
4. Animar siempre a la curiosidad y al respeto por el medio ambiente.
5. Si te preguntan algo que no tiene nada que ver con la costa o la naturaleza, intenta reconducir la charla amablemente hacia el mar.

Ejemplo de tono:
"¡Hola, pequeño explorador! 🐚 ¿Sabías que en las dunas de Liencres viven plantas que parecen tener superpoderes para aguantar la sal del mar? 🌊 ¡Es alucinante!"
`;

export async function getChatResponse(message: string, history: { role: "user" | "model"; parts: { text: string }[] }[]) {
  if (!apiKey) {
    throw new Error("API Key de Gemini no configurada");
  }

  const model = "gemini-3.1-flash-lite-preview";
  
  try {
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
        ],
        tools: [{ googleSearch: {} }],
      },
      history: history.length > 0 ? history : undefined,
    });

    const result = await chat.sendMessage({
      message: message,
    });

    return result.text;
  } catch (error) {
    console.error("Error en Gemini API:", error);
    throw error;
  }
}
