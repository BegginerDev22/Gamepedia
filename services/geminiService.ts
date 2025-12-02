import { GoogleGenAI } from "@google/genai";
import { Match } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize Gemini Client
// Note: In a real app, ensure safety settings and error handling for missing keys
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateMatchAnalysis = async (match: Match): Promise<string> => {
  if (!API_KEY) {
    return "AI Analysis requires a valid API Key configured in the environment.";
  }

  try {
    const prompt = `
      You are a professional esports analyst for BGMI (Battlegrounds Mobile India).
      Analyze the following match context and provide a brief, tactical summary or prediction (max 100 words).
      
      Match Details:
      Tournament: ${match.tournamentId}
      Teams: ${match.teamA.name} vs ${match.teamB.name}
      Map: ${match.map}
      Current Status: ${match.status}
      Current Score: ${match.teamA.name} (${match.scoreA}) - ${match.teamB.name} (${match.scoreB})
      
      If the match is LIVE, comment on the momentum based on the score.
      If UPCOMING, predict the winner based on common knowledge of these teams (Team Soul, GodLike, etc).
      If FINISHED, summarize the result.
      
      Tone: Professional, insightful, enthusiastic.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster response on simple tasks
      }
    });

    return response.text || "Analysis currently unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate analysis at this time due to network or API limitations.";
  }
};

export const generateTournamentPreview = async (tournamentName: string, tier: string): Promise<string> => {
  if (!API_KEY) return "API Key missing.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a 2-sentence hype introduction for the BGMI tournament "${tournamentName}" which is a ${tier} event. Mention high stakes.`,
    });
    return response.text || "";
  } catch (e) {
    return "";
  }
}

export const generateNewsContent = async (headline: string, category: string): Promise<string> => {
    if (!API_KEY) return "Content generation requires API Key.";

    try {
        const prompt = `
            Write a short, engaging esports news article (approx 150 words) for a BGMI website based on this headline: "${headline}".
            Category: ${category}.
            Style: Journalistic, exciting, esports-focused.
            Include a made-up quote from a player or coach if relevant.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "Content unavailable.";
    } catch (e) {
        console.error(e);
        return "Could not generate article.";
    }
}