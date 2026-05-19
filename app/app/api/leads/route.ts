import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Origins allowed to POST cross-site (the static GitHub Pages site, a future
// custom domain, localhost for dev). Override/extend via env:
// LEADS_ALLOWED_ORIGINS="https://a.com,https://b.com"
const DEFAULT_ORIGINS = [
  'https://ramanathan06.github.io',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

function allowedOrigins(): string[] {
  const fromEnv = (process.env.LEADS_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return [...new Set([...DEFAULT_ORIGINS, ...fromEnv])];
}

function corsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get('origin') ?? '';
  const h: Record<string, string> = {
    Vary: 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
  if (allowedOrigins().includes(origin)) {
    h['Access-Control-Allow-Origin'] = origin;
  }
  return h;
}

function json(
  req: NextRequest,
  body: unknown,
  status: number
): NextResponse {
  return NextResponse.json(body, { status, headers: corsHeaders(req) });
}

function clean(v: unknown, max = 2000): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  if (!t) return null;
  return t.slice(0, max);
}

/** CORS preflight. */
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

/** POST /api/leads — capture a lead from any TrueNest form. */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json(req, { error: 'Invalid JSON.' }, 400);
  }

  const name = clean(body.name, 200);
  const email = clean(body.email, 320);
  const phone = clean(body.phone, 40);
  const project = clean(body.project, 120);
  const message = clean(body.message, 4000);
  const source = clean(body.source, 120) ?? 'unknown';
  const intent = clean(body.intent, 40) ?? 'inquiry';

  if (!name || !email) {
    return json(req, { error: 'Name and email are required.' }, 422);
  }
  if (!EMAIL_RE.test(email)) {
    return json(
      req,
      { error: 'Please enter a valid email address.' },
      422
    );
  }

  try {
    const supabase = getServiceClient();
    const { error } = await supabase
      .from('leads')
      .insert({ name, email, phone, project, message, source, intent });

    if (error) {
      console.error('Lead insert failed:', error.message);
      return json(
        req,
        { error: 'Could not save your details. Please try again.' },
        500
      );
    }
  } catch (e) {
    console.error('Lead route error:', e);
    return json(
      req,
      { error: 'Server not configured. Please try again later.' },
      500
    );
  }

  return json(req, { ok: true }, 201);
}
