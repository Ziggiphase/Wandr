import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize specific model instances based on task
// Using 2.5 flash for quick text responses
const ai = new GoogleGenAI({ apiKey });

export const generateAttractionGuide = async (attractionName: string, query: string): Promise<string> => {
  if (!apiKey) return "AI service is unavailable (Missing API Key).";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert, high-end travel concierge.
      The user is asking about: "${attractionName}".
      User Question: "${query}"
      
      Provide a helpful, enticing, and professional answer in less than 150 words. Focus on the sensory experience and practical tips.`,
    });
    return response.text || "I couldn't generate a response at this moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I'm having trouble connecting to the travel network right now.";
  }
};

export const generateItinerary = async (attractionName: string, days: number): Promise<string> => {
  if (!apiKey) return "AI service is unavailable.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a brief, bullet-point itinerary for a ${days}-day trip to ${attractionName}. 
      Include "Morning", "Afternoon", and "Evening" for each day. 
      Keep it relaxed and focused on key experiences. Format nicely with markdown.`,
    });
    return response.text || "Could not generate itinerary.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating itinerary.";
  }
};