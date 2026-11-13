import { Button, Container, Icon, IconBadge, PageHeader } from '../components/ui.jsx';
import { DURATIONS, EXTENSION, PRICING, TRANSPORT } from '../data.js';
import { rupiah, transportFee } from '../utils.js';

const INCLUDED = [
  'Pendampingan sesuai layanan dan durasi yang dipesan',
  `Kedatangan pendamping hingga ${TRANSPORT.freeKm} km dari lokasinya`,
  'Kabar dan laporan singkat kegiatan untuk keluarga',
  'Pendamping yang sudah melalui verifikasi dan pelatihan',
];
const EXCLUDED = [
  'Biaya perjalanan bersama lansia (taksi, ojek, atau bensin)',
  'Parkir, tiket masuk, makanan, dan belanjaan lansia',
  'Biaya rumah sakit, obat, atau tindakan medis',
];

export default function Pricing({ go }) {
  const examples = [2, 5, 8].map((km) => ({ km, ...transportFee(km) }));
  const rate = PRICING.mode === 'perJam' ? PRICING.hourlyRate : PRICING.basePrice;

  return (
    <>
      <PageHeader
        eyebrow="Harga"
        title="Harga jelas sebelum Anda memesan"
        desc="Tarif dihitung per jam ditambah ongkos kedatangan pendamping bila jaraknya jauh. Semua angka di halaman ini adalah harga simulasi untuk prototype."
      />
      <Container className="grid gap-6 py-8 sm:py-12">
        {/* Tarif */}
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl bg-forest-700 p-6 text-white sm:p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-white/70">Tarif pendampingan</p>
            <p className="mt-3 text-4xl font-extrabold sm:text-5xl">
              {rupiah(rate)}
              {PRICING.mode === 'perJam' && <span className="text-lg font-semibold text-white/80"> / jam</span>}
            </p>
            <p className="mt-3 text-white/80">Berlaku untuk ketiga layanan: Teman & Pendamping, Pendampingan Berobat, dan Pendampingan di Rumah.</p>
            <Button variant="accent" size="lg" className="mt-6 w-full sm:w-auto" onClick={() => go('/pesan')}>
              Pesan Pendamping <Icon name="arrowRight" className="h-5 w-5" />
            </Button>
          </div>
          <div className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-8">
            <p className="font-extrabold text-ink">Contoh tarif berdasarkan durasi</p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {DURATIONS.map((h) => (
                <div key={h} className="rounded-2xl bg-beige p-3 text-center">
                  <p className="text-sm text-muted">{h} jam</p>
                  <p className="font-extrabold text-forest-700">{rupiah(PRICING.mode === 'perJam' ? PRICING.hourlyRate * h : PRICING.basePrice)}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted">Belum termasuk ongkos kedatangan pendamping (lihat di bawah).</p>
          </div>
        </section>

        {/* Transport */}
        <section className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-8">
          <div className="flex items-start gap-4">
            <IconBadge name="pin" tone="sun" />
            <div>
              <h2 className="text-xl font-extrabold text-ink">Ongkos kedatangan pendamping</h2>
              <p className="mt-2 text-muted">
                <span className="font-semibold text-ink">{TRANSPORT.freeKm} km pertama gratis</span> (sudah termasuk tarif). Lebih dari itu{' '}
                <span className="font-semibold text-ink">{rupiah(TRANSPORT.perKm)} per km</span>
                {TRANSPORT.roundTrip ? ', dihitung pulang-pergi' : ''}. Kelebihan jarak dibulatkan ke atas per km.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {examples.map((e) => (
              <div key={e.km} className="rounded-2xl bg-beige p-4">
                <p className="text-sm text-muted">Jarak pendamping ± {e.km} km</p>
                <p className="mt-1 text-2xl font-extrabold text-forest-700">{e.fee ? rupiah(e.fee) : 'Gratis'}</p>
                <p className="mt-1 text-xs text-muted">
                  {e.extraKm
                    ? `Kelebihan ${e.extraKm} km x ${rupiah(TRANSPORT.perKm)}${e.trips === 2 ? ' x 2' : ''}`
                    : `Masih dalam ${TRANSPORT.freeKm} km gratis`}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-xl bg-sun-50 p-3 text-xs leading-relaxed text-muted">
            <span className="font-bold text-ink">Simulasi:</span> jarak dihitung dari kecamatan pendamping ke kecamatan lansia di Depok (perkiraan garis lurus, bukan rute jalan). Saat memesan, ongkosnya langsung terlihat sebelum Anda konfirmasi, dan sistem mengutamakan pendamping terdekat.
          </p>
        </section>

        {/* Termasuk / tidak */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-8">
            <h2 className="text-lg font-extrabold text-ink">Sudah termasuk</h2>
            <ul className="mt-4 grid gap-2.5">
              {INCLUDED.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[15px] text-ink">
                  <Icon name="checkCircle" className="mt-0.5 h-5 w-5 shrink-0 text-forest-500" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-8">
            <h2 className="text-lg font-extrabold text-ink">Dibayar terpisah sesuai penggunaan</h2>
            <ul className="mt-4 grid gap-2.5">
              {EXCLUDED.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[15px] text-ink">
                  <Icon name="wallet" className="mt-0.5 h-5 w-5 shrink-0 text-[#B86B00]" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Perpanjangan (rancangan) */}
        <section className="rounded-3xl border border-dashed border-forest-200 bg-white p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-extrabold text-ink">Perpanjangan waktu</h2>
            <span className="rounded-full bg-sun-50 px-2.5 py-0.5 text-xs font-bold text-[#B86B00]">Rancangan</span>
          </div>
          <p className="mt-2 text-muted">
            Jika layanan perlu ditambah, pendamping mengajukan perpanjangan {EXTENSION.minutes} menit seharga {rupiah(EXTENSION.price)}. Waktu baru ditambah setelah keluarga menyetujui biayanya.
          </p>
        </section>
      </Container>
    </>
  );
}
