// Server-side only config — the API key must never be exposed to the browser,
// so these are read from plain (non NEXT_PUBLIC_) env vars inside the API route.
export const aiConfig = {
  gemini: {
    apiUrl: process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models',
    model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
    apiKey: process.env.GEMINI_API_KEY || '',
  },
};
