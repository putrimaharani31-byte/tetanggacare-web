import { useState } from 'react';
import { Avatar, Button, Container, Icon, NonMedicalNotice, PageHeader, StarRating, VerifiedBadge } from '../components/ui.jsx';
import { PRICING } from '../data.js';
import { calcPrice, categoryLabel, endTime, fmtTime, formatDate, getService, resolveCompanion, rupiah } from '../utils.js';

export function DetailList({ booking: b }) {
  const rows = [
    ['Jenis layanan', getService(b.serviceId)?.title],
    ['Nama pengguna', b.name],
    ['Kategori kebutuhan', categoryLabel(b)],
    ['Alamat lokasi layanan', b.address],
    ['Tanggal layanan', formatDate(b.date)],
    ['Waktu', `${fmtTime(b.time)} - ${endTime(b.time, b.duration)}`],
    ['Durasi', `${b.duration} jam`],
    ['Catatan khusus', b.notes.trim() || 'Tidak ada'],
  ];
  return (
    <dl className="divide-y divide-forest-100">
      {rows.map(([k, v]) => (
        <div key={k} className="grid gap-1 py-3.5 sm:grid-cols-[200px_1fr] sm:gap-4">
          <dt className="text-sm text-muted">{k}</dt>
          <dd className="whitespace-pre-line font-semibold text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CompanionMini({ booking: b }) {
  const c = resolveCompanion(b);
  if (!c) return null;
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-beige p-4">
      <Avatar look={c.look} className="h-16 w-16" />
      <div className="min-w-0">
        <p className="font-extrabold text-ink">{c.name}</p>
        <p className="text-sm text-muted">{c.age} tahun • {c.location}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <StarRating rating={c.rating} />
          <VerifiedBadge />
        </div>
        {b.companionId === 'auto' && <p className="mt-1 text-xs font-semibold text-[#B86B00]">Dipilihkan oleh TetanggaCare</p>}
      </div>
    </div>
  );
}

export function PriceBreakdown({ booking }) {
  const price = calcPrice(booking);
  return (
    <div>
      <ul className="grid gap-2.5 text-sm">
        {price.lines.map((l) => (
          <li key={l.label} className="flex justify-between gap-4">
            <span className="text-muted">{l.label}</span>
            <span className="font-semibold">{rupiah(l.value)}</span>
          </li>
        ))}
        {PRICING.mode === 'flat' && (
          <li className="flex justify-between gap-4">
            <span className="text-muted">Durasi dipesan</span>
            <span className="font-semibold">{booking.duration} jam</span>
          </li>
        )}
      </ul>
      <div className="my-4 border-t border-dashed border-forest-200" />
      <div className="flex items-end justify-between">
        <span className="font-bold text-ink">Total estimasi</span>
        <span className="text-2xl font-extrabold text-forest-700">{rupiah(price.total)}</span>
      </div>
      <p className="mt-3 rounded-xl bg-sun-50 p-3 text-xs leading-relaxed text-muted">
        <span className="font-bold text-ink">Harga simulasi.</span> Harga final mengikuti durasi serta ketentuan layanan, dan akan dikonfirmasi oleh tim TetanggaCare. Tidak ada pembayaran di prototype ini.
      </p>
    </div>
  );
}

export default function Summary({ booking, onEdit, onConfirm }) {
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');

  const confirm = () => {
    if (!agree) {
      setError('Centang persetujuan terlebih dahulu.');
      return;
    }
    onConfirm();
  };

  return (
    <>
      <PageHeader eyebrow="Ringkasan" title="Periksa pesanan Anda" desc="Pastikan semua data sudah benar sebelum mengonfirmasi pesanan." />
      <Container className="grid items-start gap-8 py-10 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-6">
          <section className="rounded-3xl border border-forest-100 bg-white p-6 md:p-8">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-ink">Detail layanan</h2>
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Icon name="pencil" className="h-4 w-4" /> Ubah
              </Button>
            </div>
            <DetailList booking={booking} />
          </section>
          <section className="rounded-3xl border border-forest-100 bg-white p-6 md:p-8">
            <h2 className="mb-4 text-lg font-extrabold text-ink">Pendamping</h2>
            <CompanionMini booking={booking} />
          </section>
          <NonMedicalNotice compact />
        </div>

        <aside className="rounded-3xl border border-forest-100 bg-white p-6 lg:sticky lg:top-28">
          <h2 className="mb-4 text-lg font-extrabold text-ink">Rincian harga</h2>
          <PriceBreakdown booking={booking} />
          <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-ink">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => {
                setAgree(e.target.checked);
                setError('');
              }}
              className="mt-0.5 h-5 w-5 shrink-0 accent-[#066649]"
            />
            Saya memahami bahwa TetanggaCare adalah layanan pendampingan nonmedis dan data pesanan sudah benar.
          </label>
          {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
          <Button size="lg" className="mt-5 w-full" onClick={confirm}>
            Konfirmasi Pesanan <Icon name="check" className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="mt-2 w-full" onClick={onEdit}>
            <Icon name="arrowLeft" className="h-4 w-4" /> Kembali ubah data
          </Button>
        </aside>
      </Container>
    </>
  );
}
