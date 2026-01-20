import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  const { evTransition, solarShare, co2Saved } = await req.json();

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    As a Carbon Auditor for an Indian coal mine, analyze this "What-If" scenario:
    - The mine is transitioning ${evTransition}% of its diesel fleet to Electric Vehicles.
    - They are replacing ${solarShare}% of grid power with Solar energy.
    - This saves approximately ${co2Saved} tons of CO2-e per year.

    Provide a 2-sentence strategic summary and one "Pro-Audit Tip" specifically for 
    CCTS (Carbon Credit Trading Scheme) 2026 compliance. Keep it professional.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return new Response(JSON.stringify({ text: response.text() }));
  } catch (error) {
    return new Response(JSON.stringify({ text: "Strategic analysis currently unavailable." }), { status: 500 });
  }
}