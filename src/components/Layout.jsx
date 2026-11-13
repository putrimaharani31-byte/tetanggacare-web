import { useState } from 'react';
import { Button, Container, Icon, Logo, Wordmark } from './ui.jsx';
import { BRAND } from '../data.js';

const LINKS = [
  { label: 'Beranda', path: '/' },
  { label: 'Layanan', path: '/layanan' },
  { label: 'Harga', path: '/harga' },
  { label: 'Pendamping', path: '/pendamping' },
  { label: 'Prosedur', path: '/prosedur' },
  { label: 'Tentang Kami', path: '/tentang' },
];

export function Navbar({ route, go, onLogin }) {
  const [open, setOpen] = useState(false);
  const nav = (path) => {
    setOpen(false);
    go(path);
  };
  return (
    <header className="sticky top-0 z-40 border-b border-forest-100/70 bg-beige/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between md:h-20">
        <button onClick={() => nav('/')} className="flex min-w-0 items-center gap-2" aria-label="TetanggaCare, ke beranda">
          <Logo variant="emblem" className="h-9 md:h-12" />
          <Wordmark className="text-lg md:text-xl" />
        </button>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Menu utama">
          {LINKS.map((l) => (
            <button
              key={l.path}
              onClick={() => nav(l.path)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                route === l.path ? 'bg-forest-100 text-forest-700' : 'text-muted hover:bg-white hover:text-forest-700'
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onLogin} className="hidden xl:inline-flex">
            <Icon name="user" className="h-4 w-4" /> Masuk
          </Button>
          <Button size="sm" onClick={() => nav('/pesan')} className="hidden md:inline-flex">
            Pesan Pendamping
          </Button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-11 w-11 place-items-center rounded-full text-forest-700 hover:bg-forest-50 xl:hidden"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
          >
            <Icon name={open ? 'x' : 'menu'} className="h-6 w-6" />
          </button>
        </div>
      </Container>

      {open && (
        <div className="animate-fade-up max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-forest-100 bg-beige xl:hidden">
          <Container className="grid gap-1 py-3">
            {LINKS.map((l) => (
              <button
                key={l.path}
                onClick={() => nav(l.path)}
                className={`rounded-xl px-4 py-3 text-left font-semibold ${route === l.path ? 'bg-forest-100 text-forest-700' : 'text-ink hover:bg-white'}`}
              >
                {l.label}
              </button>
            ))}
            <button onClick={() => nav('/cara-kerja')} className={`rounded-xl px-4 py-3 text-left font-semibold ${route === '/cara-kerja' ? 'bg-forest-100 text-forest-700' : 'text-ink hover:bg-white'}`}>
              Cara Kerja
            </button>
            <div className="mt-2 grid grid-cols-2 gap-2 pb-2">
              <Button variant="outline" onClick={() => { setOpen(false); onLogin(); }}>Masuk</Button>
              <Button onClick={() => nav('/pesan')}>Pesan</Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

export function Footer({ go }) {
  return (
    <footer className="mt-20 border-t border-forest-100 bg-white">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo variant="full" className="h-20" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            {BRAND.tagline} Platform pemesanan pendamping nonmedis untuk lansia. Uji coba awal di {BRAND.city}.
          </p>
        </div>
        <div>
          <p className="mb-3 font-bold text-ink">Jelajahi</p>
          <ul className="grid gap-2 text-sm">
            {LINKS.map((l) => (
              <li key={l.path}>
                <button onClick={() => go(l.path)} className="text-muted hover:text-forest-700">{l.label}</button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 font-bold text-ink">Mulai sekarang</p>
          <p className="mb-4 text-sm text-muted">Pesan pendamping untuk jadwal kontrol atau aktivitas keluarga Anda.</p>
          <Button onClick={() => go('/pesan')}>
            Pesan Pendamping <Icon name="arrowRight" className="h-4 w-4" />
          </Button>
        </div>
      </Container>
      <div className="border-t border-forest-100 py-5 text-center text-xs text-muted">
        © 2026 {BRAND.name}. Prototype untuk presentasi: seluruh profil, rating, dan transaksi adalah data simulasi.
      </div>
    </footer>
  );
}
