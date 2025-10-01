import { GoogleGenAI, Type } from "@google/genai";
import { CalculatorResult, OptimizationRecommendation, ScenarioForecastPoint } from "../types";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Fix: Simplified JSON parsing according to Gemini API guidelines.
// When responseMimeType is "application/json", response.text should be a valid JSON string.
const parseJson = <T,>(jsonString: string): T => {
    try {
        return JSON.parse(jsonString.trim());
    } catch (error) {
        console.error("Failed to parse JSON from Gemini response. Text:", jsonString, "Error:", error);
        throw new Error("Could not parse JSON from the AI response.");
    }
};

export const getCarbonFootprint = async (inputData: { [key: string]: string }): Promise<CalculatorResult> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Act as a carbon footprint calculator. Given this data: ${JSON.stringify(inputData)}, estimate the CO2e emissions in tonnes. Provide a breakdown by source.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    total_emissions: { type: Type.NUMBER },
                    breakdown: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                source: { type: Type.STRING },
                                emissions: { type: Type.NUMBER }
                            },
                             required: ['source', 'emissions']
                        }
                    }
                },
                required: ['total_emissions', 'breakdown']
            }
        }
    });
    
    return parseJson<CalculatorResult>(response.text);
};


export const getOptimizationStrategies = async (reductionGoal: number): Promise<OptimizationRecommendation[]> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Act as a GreenOps optimization engine. A company wants to reduce carbon emissions by ${reductionGoal}%. 
                   Provide 3 distinct, actionable strategies to achieve this.
                   For each strategy, detail the action, estimated carbon reduction (%), estimated cost impact (%), and a brief summary of the trade-offs involved.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        strategy: { type: Type.STRING },
                        carbon_reduction_percent: { type: Type.NUMBER },
                        cost_change_percent: { type: Type.NUMBER },
                        trade_offs: { type: Type.STRING }
                    },
                    required: ['strategy', 'carbon_reduction_percent', 'cost_change_percent', 'trade_offs']
                }
            }
        }
    });

    return parseJson<OptimizationRecommendation[]>(response.text);
};


export const getScenarioForecast = async (scenarioDescription: string): Promise<ScenarioForecastPoint[]> => {
    const currentYear = new Date().getFullYear();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Act as a predictive modeling expert. A company is modeling the following scenario: "${scenarioDescription}".
                   Project the annual cost savings (in USD) and annual CO2 reduction (in tonnes) for the next 5 years, starting from year ${currentYear + 1}.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        year: { type: Type.NUMBER },
                        cost_savings: { type: Type.NUMBER },
                        co2_reduction_tonnes: { type: Type.NUMBER }
                    },
                    required: ['year', 'cost_savings', 'co2_reduction_tonnes']
                }
            }
        }
    });

    return parseJson<ScenarioForecastPoint[]>(response.text);
};