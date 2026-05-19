import Link from 'next/link';

export default function Home() {
  return (
    <main className="wrap">
      <h1>TrueNest</h1>
      <p className="sub">Full-stack app — lead-capture slice.</p>
      <p style={{ marginBottom: '1.5rem' }}>
        <Link href="/inquire">→ Private Inquiry form</Link>
      </p>
      <p>
        <Link href="/leads">→ Leads (admin — requires access token)</Link>
      </p>
    </main>
  );
}
