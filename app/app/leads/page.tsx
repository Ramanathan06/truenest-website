import { getServiceClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  project: string | null;
  message: string | null;
  source: string | null;
  status: string;
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const expected = process.env.LEADS_ADMIN_TOKEN;

  if (!expected) {
    return (
      <main className="wrap">
        <h1>Leads</h1>
        <p className="msg err">
          LEADS_ADMIN_TOKEN is not set on the server.
        </p>
      </main>
    );
  }

  if (key !== expected) {
    return (
      <main className="wrap">
        <h1>Leads</h1>
        <p className="sub">
          Restricted. Append <code>?key=YOUR_TOKEN</code> to the URL to view
          captured leads.
        </p>
      </main>
    );
  }

  let leads: Lead[] = [];
  let loadError = '';
  try {
    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) loadError = error.message;
    else leads = (data ?? []) as Lead[];
  } catch (e) {
    loadError = e instanceof Error ? e.message : 'Unknown error';
  }

  return (
    <main className="wrap wrap-wide">
      <h1>Leads</h1>
      <p className="sub">{leads.length} captured · newest first</p>

      {loadError ? (
        <p className="msg err">Could not load leads: {loadError}</p>
      ) : leads.length === 0 ? (
        <p className="empty">No leads yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>When</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Project</th>
              <th>Message</th>
              <th>Source</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id}>
                <td>{new Date(l.created_at).toLocaleString('en-IN')}</td>
                <td>{l.name}</td>
                <td>
                  <a href={`mailto:${l.email}`}>{l.email}</a>
                </td>
                <td>{l.phone ?? '—'}</td>
                <td>{l.project ?? '—'}</td>
                <td>{l.message ?? '—'}</td>
                <td>{l.source ?? '—'}</td>
                <td>
                  <span className="pill">{l.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
