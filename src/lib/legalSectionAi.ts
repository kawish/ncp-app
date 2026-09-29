import { aiConfig } from './aiConfig';
import bnsCorpus from './bnsCorpus.json';

const BNS_CORPUS_TEXT = Object.entries(bnsCorpus as Record<string, string>)
  .map(([number, title]) => `${number}: ${title}`)
  .join('\n');

function buildSystemPrompt(): string {
  return `
    You are an Indian legal-reference assistant. Cross-reference the citizen complaint below against the Bharatiya Nyaya Sanhita (BNS) 2023.

    Don't refer BNSS or BSA.
    BNSS - Bharatiya Nagarik Suraksha Sanhita (BNSS)
    BSA - Bharatiya Sakshya Adhiniyam (BSA)

    Below is the complete list of BNS 2023 sections, as "<number>: <official title>". This is the only source of truth for section numbers and titles — do not use any other knowledge of the BNS for these two fields.
    """
    ${BNS_CORPUS_TEXT}
    """

    Identify up to 10 sections from the list above that apply to the facts described.
    Include sections that are relevant to the scenario, even if they are not the most severe or primary offense.

    Respond in this exact format, with no extra commentary, ordered from most to least relevant:
    Relevance: <integer 0-100, how directly this section's legal definition matches the facts described>
    Act: <BNS>
    Section: <section number, copied exactly from the list above>
    Title: <title, copied exactly as it appears next to that number in the list above>
    Reason: <one sentence tying specific facts from the complaint to this section's definition>

    Rules:
    - Every Section and Title you output must be copied verbatim from the list above — never modify, paraphrase, or invent a number or title that is not in the list.
    - Prefer the section that defines the offense itself over one that only sets punishment or procedure.
    - If no section in the list genuinely applies, return no entries rather than forcing a match.
  `;
}

function buildComplaintPrompt(complaintText: string): string {
  return `
    Complaint:
    """
    ${complaintText}
    """
  `;
}

function buildPrompt(complaintText: string): string {
  return `${buildSystemPrompt()}${buildComplaintPrompt(complaintText)}`;
}

function validateAgainstCorpus(rawText: string): string {
  const corpus = bnsCorpus as Record<string, string>;
  const blocks = rawText.split(/\n(?=Relevance:)/g);

  const validBlocks = blocks.filter((block) => {
    const sectionMatch = block.match(/^Section:\s*(\S+)/m);
    const titleMatch = block.match(/^Title:\s*(.+)$/m);
    if (!sectionMatch || !titleMatch) return false;

    const sectionNumber = sectionMatch[1].trim();
    const officialTitle = corpus[sectionNumber];
    if (!officialTitle) return false;

    return titleMatch[1].trim() === officialTitle;
  });

  return validBlocks.join('\n').trim();
}

function resolveTemplate(value: unknown, variables: Record<string, string>): unknown {
  if (typeof value === 'string') {
    return value.replace(/\$\{(\w+)\}/g, (_, key: string) => variables[key] ?? '');
  }
  if (Array.isArray(value)) {
    return value.map((item) => resolveTemplate(item, variables));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, resolveTemplate(item, variables)]),
    );
  }
  return value;
}

function readResponsePath(value: unknown, path: readonly (string | number)[]): unknown {
  return path.reduce<unknown>((current, key) => {
    if (current === null || current === undefined || typeof current !== 'object') return undefined;
    return (current as Record<string | number, unknown>)[key];
  }, value);
}

export async function fetchRelevantLegalSection(complaintText: string): Promise<string> {
  const modelConfig = aiConfig.models[aiConfig.activeModel];
  if (!modelConfig) {
    throw new Error(`Active AI model is not configured: ${aiConfig.activeModel}`);
  }

  const apiKey = process.env[modelConfig.apiKeyEnv] || '';
  if (!apiKey) {
    throw new Error('AI service is not configured');
  }

  const variables = {
    apiKey,
    model: 'model' in modelConfig ? modelConfig.model : '',
    systemPrompt: buildSystemPrompt(),
    complaint: complaintText,
    prompt: buildPrompt(complaintText),
  };

  const res = await fetch(String(resolveTemplate(modelConfig.endpoint, variables)), {
    method: 'POST',
    headers: resolveTemplate(modelConfig.headers, variables) as Record<string, string>,
    body: JSON.stringify(resolveTemplate(modelConfig.body, variables)),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`AI request failed with status ${res.status}: ${errorBody}`);
  }

  const data = await res.json();
  const text = readResponsePath(data, modelConfig.responsePath);

  if (!text) {
    throw new Error('AI response did not contain any content');
  }

  return validateAgainstCorpus(String(text).trim());
}
