import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getCodeHelp(code: string, error: string, lessonTitle: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User is working on a lesson called "${lessonTitle}". 
      Current code: \`\`\`\n${code}\n\`\`\`
      Error (if any): ${error}
      
      Provide a concise, encouraging hint to help them solve it. Don't give the direct answer immediately. Explain the concept.`,
      config: {
        systemInstruction: "You are a friendly, encouraging coding tutor for CodeQuest. Your goal is to guide students to the answer, not just reveal it.",
        temperature: 0.7,
      }
    });

    return response.text;
  } catch (err) {
    console.error("Gemini API Error:", err);
    return "I'm having trouble connecting to my brain right now. Try again in a moment!";
  }
}

export async function getPersonalizedPath(goals: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on these goals: "${goals}", recommend a sequence of 3 languages or technologies to learn and why.`,
      config: {
        responseMimeType: "application/json",
      }
    });
    return response.text;
  } catch (err) {
    return null;
  }
}
