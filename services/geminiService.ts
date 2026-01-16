
import { GoogleGenAI, Type } from "@google/genai";

// Always initialize with the exact environment variable and required format.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeTechnicalReport = async (failure: string, solution: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Eres un experto en soporte técnico de impresoras. 
      Resume el siguiente diagnóstico y solución para un reporte ejecutivo:
      Falla: ${failure}
      Solución: ${solution}`,
      config: {
        systemInstruction: "Genera un resumen profesional de máximo 2 párrafos.",
        temperature: 0.7
      }
    });
    // Use .text property directly.
    return response.text;
  } catch (error) {
    console.error("Gemini summarizing error:", error);
    return null;
  }
};

export const suggestOptimizedSolution = async (failure: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Un ingeniero reporta la siguiente falla en una impresora: ${failure}. 
      Sugiere los 3 pasos de solución más comunes basados en mejores prácticas de mantenimiento preventivo y correctivo.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });
    // Use .text property directly and trim for JSON parsing.
    return JSON.parse(response.text?.trim() || '[]');
  } catch (error) {
    console.error("Gemini optimization error:", error);
    return [];
  }
};
