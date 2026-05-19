'use client';

import { useState } from 'react';

export default function InquirePage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>(
    'idle'
  );
  const [msg, setMsg] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus('sending');
    setMsg('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'inquire' }),
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus('err');
        setMsg(json.error ?? 'Something went wrong. Please try again.');
        return;
      }
      setStatus('ok');
      const first = String(data.name ?? '').split(' ')[0];
      setMsg(`Thank you, ${first}. An advisor will be in touch shortly.`);
      form.reset();
    } catch {
      setStatus('err');
      setMsg('Network error. Please try again.');
    }
  }

  return (
    <main className="wrap">
      <h1>Private Inquiry</h1>
      <p className="sub">
        Share your details and a TrueNest advisor will reach out.
      </p>

      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">Full name *</label>
          <input id="name" name="name" required autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="project">Project of interest</label>
          <select id="project" name="project" defaultValue="">
            <option value="">— Select —</option>
            <option>Retreat 76</option>
            <option>Hills &amp; Skies</option>
            <option>Both projects</option>
            <option>Future projects</option>
          </select>
        </div>
        <div>
          <label htmlFor="message">Your requirements</label>
          <textarea id="message" name="message" />
        </div>
        <button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Submit Inquiry'}
        </button>
        <p
          className={
            'msg ' + (status === 'ok' ? 'ok' : status === 'err' ? 'err' : '')
          }
          role="status"
        >
          {msg}
        </p>
      </form>
    </main>
  );
}
