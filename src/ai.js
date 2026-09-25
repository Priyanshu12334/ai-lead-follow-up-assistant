import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateEmail(lead) {
  const prompt = `
You are an AI sales assistant helping a software development company
respond quickly to new business leads.

Create a short, professional and personalized email for this lead.

Lead details:
Name: ${lead.name}
Company: ${lead.company}
Requirement: ${lead.requirement}
Budget: ${lead.budget}
Message: ${lead.message}

Instructions:
- Address the lead by their first name.
- Mention their company naturally.
- Specifically acknowledge their requirement.
- Use their message to make the reply feel personalized.
- Do not invent facts about the company or services.
- Do not mention that AI generated the email.
- Keep the email concise and professional.
- End with a clear call-to-action for a short discussion.
- Return ONLY valid JSON in this format:

{
  "subject": "email subject",
  "body": "email body"
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  const text = response.text.trim();

  // Remove markdown code fences if Gemini adds them
  const cleanText = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(cleanText);
}