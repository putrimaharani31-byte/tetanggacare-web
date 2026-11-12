import { useEffect, useState } from 'react';
import { supabase } from '../supabase.js';
import AdminDashboard from '../pages/AdminDashboard.jsx';
import { Button, Container, Field, Icon, Logo, inputClass } from './ui.jsx';

// Akhiran email untuk akun admin di Supabase. Admin cukup mengetik username.
// Contoh: username "admin" -> admin@admin.tetanggacare.app
const ADMIN_DOMAIN = 'admin.tetanggacare.app';

export default function AdminGate({ go }) {
  const [session, setSession] = useState(undefined);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const email = `${username.trim().toLowerCase()}@${ADMIN_DOMAIN}`;
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) setError('Username atau password salah.');
  };

  if (session === undefined) {
    return <Container className="py-24 text-center text-muted">Memeriksa akses...</Container>;
  }

  if (!session) {
    return (
      <Container className="grid min-h-[70vh] place-items-center py-12">
        <form onSubmit={login} className="w-full max-w-sm rounded-3xl border border-forest-100 bg-white p-7 shadow-xl shadow-forest-900/5">
          <div className="flex flex-col items-center text-center">
            <Logo variant="emblem" className="h-16" />
            <h1 className="mt-4 text-2xl font-extrabold text-ink">Login Admin</h1>
            <p className="mt-1 text-sm text-muted">Khusus tim TetanggaCare.</p>
          </div>
          <div className="mt-6 grid gap-4">
            <Field id="admin-username" label="Username">
              <input id="admin-username" type="text" autoComplete="username" autoCapitalize="none" spellCheck="false" className={inputClass(false)} value={username} onChange={(e) => setUsername(e.target.value)} required />
            </Field>
            <Field id="admin-password" label="Password">
              <input id="admin-password" type="password" autoComplete="current-password" className={inputClass(false)} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Field>
            {error && (
              <p className="flex items-center gap-1.5 text-sm font-medium text-red-600">
                <Icon name="info" className="h-4 w-4" /> {error}
              </p>
            )}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              <Icon name="shield" className="h-5 w-5" /> {loading ? 'Memeriksa...' : 'Masuk'}
            </Button>
            <Button variant="ghost" onClick={() => go('/')}>Kembali ke Beranda</Button>
          </div>
        </form>
      </Container>
    );
  }

  const shownName = session.user?.email?.split('@')[0];

  return (
    <>
      <Container className="flex items-center justify-end gap-3 pt-6 text-sm text-muted">
        <span>Halo, <span className="font-bold text-ink">{shownName}</span></span>
        <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>Keluar</Button>
      </Container>
      <AdminDashboard go={go} />
    </>
  );
}
