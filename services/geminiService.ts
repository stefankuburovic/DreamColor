import { GoogleGenAI, Chat } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Models
const IMAGE_MODEL = 'imagen-4.0-generate-001';
const CHAT_MODEL = 'gemini-3-pro-preview';

export const generateColoringPage = async (theme: string): Promise<string> => {
  try {
    const prompt = `A clean, black and white line art coloring page for children. Subject: ${theme}. 
    Thick distinct outlines, white background, no shading, no grayscale, simple vector style, cute, high contrast. 
    Ensure the image is suitable for printing on standard paper.`;

    const response = await ai.models.generateImages({
      model: IMAGE_MODEL,
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '3:4', // Portrait for books
      },
    });

    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (!base64ImageBytes) throw new Error("No image generated");
    return `data:image/png;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Error generating coloring page:", error);
    throw error;
  }
};

export const generateCoverImage = async (theme: string): Promise<string> => {
  try {
    const prompt = `A vibrant, colorful children's book cover illustration art. Subject: ${theme}. 
    Bright cheerful colors, high quality, cute cartoon or 3D render style. 
    Composition should allow space in the center or top for a title overlay.`;

    const response = await ai.models.generateImages({
      model: IMAGE_MODEL,
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '3:4',
      },
    });

    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (!base64ImageBytes) throw new Error("No image generated");
    return `data:image/png;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Error generating cover:", error);
    throw error;
  }
};

// Chat Instance
let chatSession: Chat | null = null;

export const getChatResponse = async (message: string): Promise<string> => {
  try {
    if (!chatSession) {
      chatSession = ai.chats.create({
        model: CHAT_MODEL,
        config: {
          systemInstruction: "You are a friendly, creative assistant helping parents and children design coloring books. Offer fun theme ideas, ask about the child's interests, and be encouraging. Keep responses concise and enthusiastic.",
        },
      });
    }

    const result = await chatSession.sendMessage({ message });
    return result.text || "I'm having trouble thinking of a response right now.";
  } catch (error) {
    console.error("Chat error:", error);
    return "Oops! I got a little confused. Can you try asking again?";
  }
};