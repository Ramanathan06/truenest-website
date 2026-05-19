import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v: unknown, max = 2000): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  if (!t) return null;
  return t.slice(0, max);
}

/** POST /api/leads — capture a lead from any TrueNest form. */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const name = clean(body.name, 200);
  const email = clean(body.email, 320);
  const phone = clean(body.phone, 40);
  const project = clean(body.project, 120);
  const message = clean(body.message, 4000);
  const source = clean(body.source, 120) ?? 'unknown';
  const intent = clean(body.intent, 40) ?? 'inquiry';

  if (!name || !email) {
    return NextResponse.json(
      { error: 'Name and email are required.' },
      { status: 422 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 422 }
    );
  }

  try {
    const supabase = getServiceClient();
    const { error } = await supabase
      .from('leads')
      .insert({ name, email, phone, project, message, source, intent });

    if (error) {
      console.error('Lead insert failed:', error.message);
      return NextResponse.json(
        { error: 'Could not save your details. Please try again.' },
        { status: 500 }
      );
    }
  } catch (e) {
    console.error('Lead route error:', e);
    return NextResponse.json(
      { error: 'Server not configured. Please try again later.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
