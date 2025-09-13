
import { GoogleGenAI, Type } from "@google/genai";
import { ItemType } from "../types";

// IMPORTANT: This check is for the browser environment where process.env is not defined.
// The API_KEY is expected to be set in the execution environment.
const API_KEY = typeof process !== 'undefined' ? process.env.API_KEY : (import.meta as any).env.VITE_API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const extractTextFromImage = async (base64Image: string, mimeType: string): Promise<string> => {
  if (!API_KEY) return "API key not configured.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: "Extract all text from this image." },
          { inlineData: { data: base64Image, mimeType } },
        ],
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error extracting text from image:", error);
    return "Failed to extract text.";
  }
};

export const analyzeCode = async (code: string): Promise<{ language: string; isSensitive: boolean }> => {
  if (!API_KEY) return { language: 'plaintext', isSensitive: false };
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following code snippet. Identify the programming language and determine if it contains sensitive information like API keys or passwords. Respond in JSON format. Code: \n\n${code}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            language: { type: Type.STRING },
            isSensitive: { type: Type.BOOLEAN },
          },
        },
      },
    });
    const result = JSON.parse(response.text);
    return {
      language: result.language || 'plaintext',
      isSensitive: result.isSensitive || false,
    };
  } catch (error) {
    console.error("Error analyzing code:", error);
    return { language: 'plaintext', isSensitive: false };
  }
};

export const formatCode = async (code: string, language: string): Promise<string> => {
  if (!API_KEY) return code;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Format/beautify the following ${language} code snippet:\n\n${code}`,
      config: {
         thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    // Gemini might wrap the code in markdown, so we extract it.
    return response.text.replace(/```[\w]*\n/g, '').replace(/```/g, '').trim();
  } catch (error) {
    console.error("Error formatting code:", error);
    return code;
  }
};

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  if (!API_KEY) return "API key not configured.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Translate the following text to ${targetLanguage}:\n\n${text}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error translating text:", error);
    return "Translation failed.";
  }
};
