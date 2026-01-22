
import { GoogleGenAI, Type } from "@google/genai";
import { AdPlatform, AdSize } from "../types";

export interface AdCopy {
  headline: string;
  primaryText: string;
  cta: string;
}

export const generateAdCopy = async (
  brandName: string,
  productDescription: string,
  targetAudience: string,
  platform: AdPlatform
): Promise<AdCopy[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 3 high-converting ad copy variations for ${brandName}. 
    Product: ${productDescription}. 
    Target Audience: ${targetAudience}. 
    Platform: ${platform}. 
    Each variation must have a headline (max 40 chars), primary text (max 125 chars), and a short CTA.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            primaryText: { type: Type.STRING },
            cta: { type: Type.STRING }
          },
          required: ["headline", "primaryText", "cta"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse ad copy JSON", e);
    return [];
  }
};

export const generateAdImage = async (
  prompt: string,
  aspectRatio: AdSize = AdSize.SQUARE
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A high-quality, professional marketing background for: ${prompt}. Clean, minimalist, modern aesthetic suitable for a professional brand ad.` }]
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio === AdSize.SQUARE ? "1:1" : 
                    aspectRatio === AdSize.STORY ? "9:16" : 
                    aspectRatio === AdSize.LANDSCAPE ? "16:9" : "3:4"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image generated");
};
