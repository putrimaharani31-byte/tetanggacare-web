import { useState } from 'react';
import { Button, Container, Icon } from '../components/ui.jsx';
import { CompanionMini, PriceBreakdown } from './Summary.jsx';
import { endTime, fmtTime, formatDate, getService } from '../utils.js';

export default function Confirmation({ order, onHome, go }) {
  const [copied, setCopied] = useState(false);
  const service = getService(order.serviceId);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(order.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Container className="max-w-3xl py-12 md:py-16">
      <div className="text-center">
        <span className="animate-pop mx-auto grid h-20 w-20 place-items-center rounded-full bg-forest-700 text-white shadow-xl shadow-forest-700/30">
          <Icon name="check" className="h-10 w-10" strokeWidth={3} />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold text-ink md:text-4xl">Pemesanan berhasil dibuat!</h1>
        <p className="mx-auto mt-3 max-w-lg text-muted">
          Terima kasih telah memercayakan pendampingan kepada TetanggaCare. Pendamping akan menghubungi Anda sebelum jadwal layanan.
        </p>
        <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-forest-100 bg-white px-5 py-3">
          <span className="text-sm text-muted">Nomor pesanan</span>
          <span className="font-mono text-lg font-extrabold text-forest-700">{order.id}</span>
          <button onClick={copy} className="no-print rounded-full p-2 text-muted hover:bg-forest-50 hover:text-forest-700" aria-label="Salin nomor pesanan">
            <Icon name={copied ? 'check' : 'copy'} className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sun-50 px-3 py-1 font-semibold text-[#B86B00]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-sun" /> Status: menunggu konfirmasi pendamping (simulasi)
          </span>
        </p>
      </div>

      <div className="mt-10 grid gap-6">
        <section className="rounded-3xl border border-forest-100 bg-white p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-ink">Ringkasan layanan</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              ['file', 'Layanan', service?.title],
              ['user', 'Pengguna', order.name],
              ['calendar', 'Tanggal', formatDate(order.date)],
              ['clock', 'Waktu', `${fmtTime(order.time)} - ${endTime(order.time, order.duration)} (${order.duration} jam)`],
            ].map(([icon, k, v]) => (
              <div key={k} className="flex gap-3 rounded-2xl bg-beige p-4">
                <Icon name={icon} className="mt-0.5 h-5 w-5 shrink-0 text-forest-500" />
                <div>
                  <p className="text-xs text-muted">{k}</p>
                  <p className="font-bold text-ink">{v}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3 rounded-2xl bg-beige p-4">
            <Icon name="pin" className="mt-0.5 h-5 w-5 shrink-0 text-forest-500" />
            <div>
              <p className="text-xs text-muted">Lokasi layanan</p>
              <p className="font-bold text-ink">{order.address}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-forest-100 bg-white p-6 md:p-8">
          <h2 className="mb-4 text-lg font-extrabold text-ink">Informasi pendamping</h2>
          <CompanionMini booking={order} />
        </section>

        <section className="rounded-3xl border border-forest-100 bg-white p-6 md:p-8">
          <h2 className="mb-4 text-lg font-extrabold text-ink">Estimasi biaya</h2>
          <PriceBreakdown booking={order} />
        </section>

        <section className="rounded-3xl border border-forest-100 bg-forest-50 p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-ink">Langkah berikutnya</h2>
          <ol className="mt-4 grid gap-3 text-sm text-ink">
            {[
              'Tim TetanggaCare memverifikasi kebutuhan dan mengonfirmasi harga final.',
              'Pendamping menghubungi keluarga sebelum hari layanan.',
              'Pendamping mengonfirmasi mulai dan selesai layanan.',
              'Keluarga menerima laporan singkat kegiatan setelah layanan.',
            ].map((t, i) => (
              <li key={t} className="flex items-start gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-forest-700 text-xs font-bold text-white">{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="no-print mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Button size="lg" onClick={onHome}>
          <Icon name="home" className="h-5 w-5" /> Kembali ke Beranda
        </Button>
        <Button size="lg" variant="outline" onClick={() => window.print()}>
          <Icon name="printer" className="h-5 w-5" /> Cetak / Simpan PDF
        </Button>
        <Button size="lg" variant="ghost" onClick={() => go('/pendamping')}>Lihat pendamping lain</Button>
      </div>
    </Container>
  );
}
