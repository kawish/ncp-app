import { aiConfig } from './aiConfig';

function buildPrompt(complaintText: string): string {
  return `
    You are an Indian legal-reference assistant. Cross-reference the citizen complaint below against the Indian legal sections corpus covering the Bharatiya Nyaya Sanhita (BNS) 2023.
    
    Don't refer BNSS or BSA.
    BNSS - Bharatiya Nagarik Suraksha Sanhita (BNSS) 
    BSA - Bharatiya Sakshya Adhiniyam (BSA)

    Identify 10 most relevant sections and respond in this exact format, with no extra commentary:
    Relevance: <calculated Relevance percentage indicating how closely the section relates to the complaint.>
    Act: <BNS>
    Section: <section number>
    Title: <section title>
    Reason: <one sentence explaining why this section applies>

    Formatting rules:
    - Section: use only the section that mentions the crime, dont use the section that deals with punishment or procedure.
    - Title: use only the official heading of that section as it appears in the BNS act.

    Complaint:
    """
    ${complaintText}
    """
  `;
}

export async function fetchRelevantLegalSection(complaintText: string): Promise<string> {
  const { apiUrl, apiKey, model } = aiConfig.gemini;
  if (!apiKey) {
    throw new Error('AI service is not configured');
  }

  const res = await fetch(`${apiUrl}/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(complaintText) }] }],
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Gemini request failed with status ${res.status}: ${errorBody}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('AI response did not contain any content');
  }

  return String(text).trim();
}
