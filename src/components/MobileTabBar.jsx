import { Icon } from './ui.jsx';

// Menu bawah ala aplikasi, hanya tampil di layar HP/tablet
const TABS = [
  { label: 'Beranda', path: '/', icon: 'home' },
  { label: 'Layanan', path: '/layanan', icon: 'heart' },
  { label: 'Pesan', path: '/pesan', icon: 'calendar', main: true },
  { label: 'Harga', path: '/harga', icon: 'wallet' },
  { label: 'Pesanan', path: '/pesanan-saya', icon: 'file' },
];

export default function MobileTabBar({ route, go }) {
  if (route === '/admin' || route === '/login') return null;
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-forest-100 bg-white/95 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Menu bawah"
    >
      <div className="mx-auto grid max-w-md grid-cols-5">
        {TABS.map((t) => {
          const active = route === t.path || (t.path === '/pesan' && ['/ringkasan', '/konfirmasi'].includes(route));
          if (t.main) {
            return (
              <button key={t.path} onClick={() => go(t.path)} className="-mt-5 flex flex-col items-center gap-1 pb-2 text-[11px] font-bold text-forest-700">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-forest-700 text-white shadow-lg shadow-forest-700/30 ring-4 ring-white">
                  <Icon name={t.icon} className="h-6 w-6" />
                </span>
                {t.label}
              </button>
            );
          }
          return (
            <button key={t.path} onClick={() => go(t.path)} className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${active ? 'text-forest-700' : 'text-muted'}`}>
              <Icon name={t.icon} className="h-5 w-5" />
              {t.label}
              <span className={`h-1 w-1 rounded-full ${active ? 'bg-sun' : 'bg-transparent'}`} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
