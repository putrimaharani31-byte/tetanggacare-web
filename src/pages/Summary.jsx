import { useState } from 'react';
import { Avatar, Button, Container, Icon, NonMedicalNotice, PageHeader, StarRating, VerifiedBadge } from '../components/ui.jsx';
import { calcPrice, companionDistance, distanceText, endTime, fmtTime, formatDate, getDistrict, getService, needsLabel, resolveCompanion, rupiah } from '../utils.js';

function Rows({ rows }) {
  return (
    <dl className="divide-y divide-forest-100">
      {rows.map(([k, v]) => (
        <div key={k} className="grid gap-1 py-3 sm:grid-cols-[190px_1fr] sm:gap-4">
          <dt className="text-sm text-muted">{k}</dt>
          <dd className="whitespace-pre-line break-words font-semibold text-ink">{v || '-'}</dd>
        </div>
      ))}
    </dl>
  );
}

export function DetailList({ booking: b }) {
  return (
    <div className="grid gap-6">
      <div>
        <p className="mb-1 text-sm font-bold uppercase tracking-wider text-forest-500">Layanan & jadwal</p>
        <Rows
          rows={[
            ['Jenis layanan', getService(b.serviceId)?.title],
            ['Tanggal', formatDate(b.date)],
            ['Waktu', `${fmtTime(b.time)} - ${endTime(b.time, b.duration)} (${b.duration} jam)`],
          ]}
        />
      </div>
      <div>
        <p className="mb-1 text-sm font-bold uppercase tracking-wider text-forest-500">Lansia</p>
        <Rows
          rows={[
            ['Nama', `${b.elderName}${b.elderAge ? `, ${b.elderAge} tahun` : ''}`],
            ['Kebutuhan bantuan', needsLabel(b.needs)],
            ['Lokasi', `${b.address}\nKec. ${getDistrict(b.district)?.name ?? '-'}, Depok`],
            ['Catatan', b.notes.trim() || 'Tidak ada'],
          ]}
        />
      </div>
      <div>
        <p className="mb-1 text-sm font-bold uppercase tracking-wider text-forest-500">Keluarga penanggung jawab</p>
        <Rows rows={[['Nama', `${b.familyName} (${b.familyRelation})`], ['Nomor HP', b.familyPhone]]} />
      </div>
    </div>
  );
}

export function CompanionMini({ booking: b }) {
  const c = resolveCompanion(b);
  if (!c) return null;
  const km = companionDistance(c, b.district);
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-beige p-4">
      <Avatar look={c.look} className="h-16 w-16" />
      <div className="min-w-0">
        <p className="font-extrabold text-ink">{c.name}</p>
        <p className="text-sm text-muted">
          {c.age} tahun • {c.location}
          {km != null && ` • ${distanceText(km)}`}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <StarRating rating={c.rating} />
          <VerifiedBadge />
        </div>
        {b.companionId === 'auto' && <p className="mt-1 text-xs font-semibold text-[#B86B00]">Pendamping terdekat, dipilihkan oleh TetanggaCare</p>}
      </div>
    </div>
  );
}

export function PriceBreakdown({ booking }) {
  const price = calcPrice(booking);
  return (
    <div>
      <ul className="grid gap-3 text-sm">
        {price.lines.map((l) => (
          <li key={l.label}>
            <div className="flex justify-between gap-4">
              <span className="text-muted">{l.label}</span>
              <span className="shrink-0 font-semibold">{rupiah(l.value)}</span>
            </div>
            {l.note && <p className="mt-0.5 text-xs text-muted">{l.note}</p>}
          </li>
        ))}
      </ul>
      <div className="my-4 border-t border-dashed border-forest-200" />
      <div className="flex items-end justify-between">
        <span className="font-bold text-ink">Total estimasi</span>
        <span className="text-2xl font-extrabold text-forest-700">{rupiah(price.total)}</span>
      </div>
      <p className="mt-3 rounded-xl bg-sun-50 p-3 text-xs leading-relaxed text-muted">
        <span className="font-bold text-ink">Harga simulasi.</span> Biaya perjalanan bersama lansia (misalnya taksi ke rumah sakit, parkir, atau tiket) dibayar terpisah sesuai penggunaan. Tidak ada pembayaran di prototype ini.
      </p>
    </div>
  );
}

export default function Summary({ booking, onEdit, onConfirm, go }) {
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
      <Container className="grid items-start gap-6 py-8 sm:py-10 lg:grid-cols-[1fr_360px] lg:gap-8">
        <div className="grid min-w-0 gap-6">
          <section className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-ink">Detail pesanan</h2>
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Icon name="pencil" className="h-4 w-4" /> Ubah
              </Button>
            </div>
            <DetailList booking={booking} />
          </section>
          <section className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-8">
            <h2 className="mb-4 text-lg font-extrabold text-ink">Pendamping</h2>
            <CompanionMini booking={booking} />
          </section>
          <NonMedicalNotice compact />
        </div>

        <aside className="min-w-0 rounded-3xl border border-forest-100 bg-white p-5 sm:p-6 lg:sticky lg:top-28">
          <h2 className="mb-4 text-lg font-extrabold text-ink">Rincian biaya</h2>
          <PriceBreakdown booking={booking} />

          <div className="mt-5 rounded-2xl border border-forest-100 p-4">
            <p className="text-sm font-bold text-ink">Persetujuan</p>
            <ul className="mt-2 grid gap-1.5 text-xs leading-relaxed text-muted">
              <li>• Layanan ini adalah pendampingan <span className="font-semibold text-ink">nonmedis</span>.</li>
              <li>• Data lansia dan keluarga hanya dipakai untuk menjalankan layanan ini: mencocokkan pendamping, menghubungi keluarga, dan membuat laporan.</li>
              <li>• Lansia atau keluarga telah menyetujui pendampingan ini.</li>
            </ul>
            {go && (
              <button type="button" onClick={() => go('/prosedur')} className="mt-2 text-xs font-bold text-forest-700 underline-offset-2 hover:underline">
                Baca prosedur layanan
              </button>
            )}
            <label className="mt-3 flex cursor-pointer items-start gap-3 text-sm text-ink">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => {
                  setAgree(e.target.checked);
                  setError('');
                }}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[#066649]"
              />
              Saya memahami dan menyetujui ketentuan di atas, dan data pesanan sudah benar.
            </label>
            {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
          </div>

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
