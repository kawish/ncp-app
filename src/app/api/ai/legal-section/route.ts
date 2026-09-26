import { NextRequest, NextResponse } from 'next/server';
import { fetchRelevantLegalSection } from '@/lib/legalSectionAi';

export async function POST(request: NextRequest) {
  const { complaintText } = await request.json();

  if (typeof complaintText !== 'string' || !complaintText.trim()) {
    return NextResponse.json({ error: 'complaintText is required' }, { status: 400 });
  }

  try {
    const result = await fetchRelevantLegalSection(complaintText.trim());
    return NextResponse.json({ result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI request failed';
    const status = message === 'AI service is not configured' ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
