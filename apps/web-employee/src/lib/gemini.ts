import { benefitsContentForAI } from '@/data/benefits-data';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent`;

const SYSTEM_PROMPT = `You are the Tobie Benefits Assistant, a helpful AI that answers employee questions about their benefits based ONLY on the official 2026 Tobie Benefits Guide.

RULES:
1. ONLY answer using information from the benefits guide content provided below. Never make up or guess information.
2. If the answer is not in the provided content, say "I don't have that specific information in the benefits guide. Please contact HR at 800-890-5420 or submit an inquiry via ServiceNow for assistance."
3. NEVER recommend which plan an employee should choose. You may compare plans factually but must not advise.
4. NEVER provide legal, tax, medical, or investment advice.
5. NEVER guarantee eligibility, reimbursements, or coverage outcomes.
6. If someone asks about their specific situation, direct them to HR or the appropriate carrier.
7. Keep answers concise, clear, and employee-friendly. Use bullet points when listing details.
8. When citing numbers (deductibles, copays, etc.), be precise and note which plan/tier they apply to.

BENEFITS GUIDE CONTENT:
${benefitsContentForAI}`;

export async function askGemini(userQuestion: string): Promise<{ answer: string; sourcesUsed: string[] }> {
  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I will only answer questions using the official 2026 Tobie Benefits Guide content provided. I will not recommend specific plans, give legal/tax/medical advice, or make up information. How can I help you with your benefits questions?' }],
        },
        {
          role: 'user',
          parts: [{ text: userQuestion }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I was unable to generate a response. Please try again.';

  // Determine which sections were likely referenced
  const sourcesUsed: string[] = [];
  const lowerQ = userQuestion.toLowerCase();
  if (lowerQ.includes('medical') || lowerQ.includes('plan') || lowerQ.includes('deductible') || lowerQ.includes('copay')) sourcesUsed.push('Medical Benefits');
  if (lowerQ.includes('dental')) sourcesUsed.push('Dental Benefits');
  if (lowerQ.includes('vision')) sourcesUsed.push('Vision Benefits');
  if (lowerQ.includes('fsa') || lowerQ.includes('hsa') || lowerQ.includes('flexible spending')) sourcesUsed.push('FSA/HSA');
  if (lowerQ.includes('life') || lowerQ.includes('ad&d')) sourcesUsed.push('Life & AD&D');
  if (lowerQ.includes('disability')) sourcesUsed.push('Disability');
  if (lowerQ.includes('retire') || lowerQ.includes('401') || lowerQ.includes('403')) sourcesUsed.push('Retirement');
  if (lowerQ.includes('pharmacy') || lowerQ.includes('prescription') || lowerQ.includes('rx')) sourcesUsed.push('Pharmacy');
  if (lowerQ.includes('enroll')) sourcesUsed.push('Enrollment');
  if (sourcesUsed.length === 0) sourcesUsed.push('General Benefits');

  return { answer, sourcesUsed };
}
