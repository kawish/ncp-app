export async function getRelevantLegalSection(complaintText: string): Promise<string> {
  const trimmed = complaintText.trim();
  if (!trimmed) {
    throw new Error('Please enter a complaint description first');
  }

  const res = await fetch('/api/ai/legal-section', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ complaintText: trimmed }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || `AI request failed with status ${res.status}`);
  }

  return data.result as string;
}
