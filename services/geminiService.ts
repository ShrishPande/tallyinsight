import { GoogleGenAI, Type } from "@google/genai";
import { AIInsight, MonthlyData } from "../types";

export const generateFinancialInsight = async (
  monthlyData: MonthlyData[],
  totals: { sales: number; purchase: number; cash: number }
): Promise<AIInsight> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze the following financial data from a company's Tally Prime dashboard.
    
    Totals:
    Total Sales: ${totals.sales}
    Total Purchase: ${totals.purchase}
    Cash in Hand: ${totals.cash}

    Monthly Trend (Last 6 months):
    ${JSON.stringify(monthlyData)}

    Provide a JSON response with:
    1. A short summary of financial health.
    2. A strategic recommendation.
    3. A risk assessment level (Low, Medium, High).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            riskAssessment: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIInsight;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      summary: "Unable to generate insights at this time.",
      recommendation: "Please check your connection.",
      riskAssessment: "Low"
    };
  }
};