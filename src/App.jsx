import React, { useCallback, useEffect, useState } from 'react';
import { Footer, Navbar } from './components/Layout.jsx';
import IntroSplash from './components/IntroSplash.jsx';
import { CompanionProfileModal } from './components/Cards.jsx';
import { Button, Container, Icon, Modal, Toast } from './components/ui.jsx';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Companions from './pages/Companions.jsx';
import Booking from './pages/Booking.jsx';
import Summary from './pages/Summary.jsx';
import Confirmation from './pages/Confirmation.jsx';
import About from './pages/About.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import { EMPTY_BOOKING } from './data.js';
import { calcPrice, getCompanion, isBookingComplete, makeOrderId, saveOrderToDatabase, logUserActivity } from './utils.js';

const readRoute = () => (typeof window === 'undefined' ? '/' : window.location.hash.replace(/^#/, '') || '/');

function EmptyState({ title, desc, action, onAction }) {
  return (
    <Container className="py-24 text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-forest-50 text-forest-700">
        <Icon name="file" className="h-8 w-8" />
      </span>
      <h1 className="mt-5 text-2xl font-extrabold text-ink">{title}</h1>
      <p className="mt-2 text-muted">{desc}</p>
      <Button className="mt-6" onClick={onAction}>{action}</Button>
    </Container>
  );
}

export default function App() {
  const [route, setRoute] = useState(readRoute);
  const [booking, setBooking] = useState(EMPTY_BOOKING);
  const [order, setOrder] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [toast, setToast] = useState('');

  // Catat aktivitas pengunjung setiap kali web diakses
  useEffect(() => {
    logUserActivity();
  }, []);

  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (route === '/cara-kerja') {
      requestAnimationFrame(() => document.getElementById('cara-kerja')?.scrollIntoView({ behavior: 'smooth' }));
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [route]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(''), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const go = useCallback((path) => {
    if (readRoute() === path) {
      if (path === '/cara-kerja') document.getElementById('cara-kerja')?.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.location.hash = path;
  }, []);

  const updateBooking = (patch) => setBooking((b) => ({ ...b, ...patch }));

  const chooseService = (serviceId) => {
    setBooking((b) => {
      const c = getCompanion(b.companionId);
      return c && !c.services.includes(serviceId) ? { ...b, serviceId, companionId: '' } : { ...b, serviceId };
    });
    setToast('Layanan dipilih. Lanjutkan isi detail pesanan.');
    go('/pesan');
  };

  const chooseCompanion = (companionId) => {
    setProfileId(null);
    setBooking((b) => {
      const c = getCompanion(companionId);
      const keepService = !b.serviceId || c.services.includes(b.serviceId);
      return { ...b, companionId, serviceId: keepService ? b.serviceId : '' };
    });
    setToast(`${getCompanion(companionId).name} dipilih sebagai pendamping.`);
    go('/pesan');
  };

  const confirmOrder = () => {
    const newOrder = { ...booking, id: makeOrderId() };
    const priceData = calcPrice(booking);
    setOrder(newOrder);

    // Simpan otomatis ke database Supabase!
    saveOrderToDatabase(newOrder, priceData);

    setToast('Pemesanan berhasil dibuat! Data tersimpan di database.');
    go('/konfirmasi');
  };

  const backHome = () => {
    setBooking(EMPTY_BOOKING);
    setOrder(null);
    go('/');
  };

  let page;
  switch (route) {
    case '/layanan':
      page = <Services go={go} onChooseService={chooseService} />;
      break;
    case '/pendamping':
      page = <Companions selectedId={booking.companionId} onView={setProfileId} onChoose={chooseCompanion} />;
      break;
    case '/pesan':
      page = <Booking booking={booking} onChange={updateBooking} onSubmit={() => go('/ringkasan')} onViewCompanion={setProfileId} />;
      break;
    case '/ringkasan':
      page = isBookingComplete(booking) ? (
        <Summary booking={booking} onEdit={() => go('/pesan')} onConfirm={confirmOrder} />
      ) : (
        <EmptyState title="Belum ada data pesanan" desc="Isi formulir pemesanan terlebih dahulu untuk melihat ringkasan." action="Isi Formulir Pemesanan" onAction={() => go('/pesan')} />
      );
      break;
    case '/konfirmasi':
      page = order ? (
        <Confirmation order={order} onHome={backHome} go={go} />
      ) : (
        <EmptyState title="Belum ada pesanan" desc="Pesanan yang sudah dikonfirmasi akan tampil di sini." action="Pesan Pendamping" onAction={() => go('/pesan')} />
      );
      break;
    case '/tentang':
      page = <About go={go} />;
      break;
    case '/admin':
      page = <AdminDashboard go={go} />;
      break;
    default:
      page = <Home go={go} onChooseService={chooseService} />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <IntroSplash />
      <Navbar route={route} go={go} onLogin={() => setLoginOpen(true)} />
      <main key={route} className="animate-fade-up flex-1">{page}</main>
      <Footer go={go} />

      <CompanionProfileModal companion={getCompanion(profileId)} onClose={() => setProfileId(null)} onChoose={chooseCompanion} />

      <Modal open={loginOpen} onClose={() => setLoginOpen(false)} label="Masuk">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-forest-50 text-forest-700">
          <Icon name="user" className="h-7 w-7" />
        </span>
        <h3 className="mt-4 text-2xl font-extrabold text-ink">Masuk ke TetanggaCare</h3>
        <p className="mt-2 text-muted">
          Di prototype ini Anda dapat memesan tanpa akun. Fitur dashboard statistik dapat diakses lewat tautan khusus admin.
        </p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Button variant="outline" onClick={() => { setLoginOpen(false); go('/admin'); }}>Buka Admin Dashboard</Button>
          <Button onClick={() => { setLoginOpen(false); go('/pesan'); }}>Pesan tanpa akun</Button>
        </div>
      </Modal>

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}
