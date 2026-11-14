import { useCallback, useEffect, useState } from 'react';
import { Avatar, Button, Container, Icon, inputClass } from '../components/ui.jsx';
import { COMPANION_SHARE } from '../data.js';
import { companionPayout, endTime, fmtTime, formatDate, getService, rupiah, statusInfo, updateOrderStatus, waLink, fetchCompanionOrders } from '../utils.js';

const TONE = {
  sun: 'bg-sun-50 text-[#B86B00]',
  forest: 'bg-forest-50 text-forest-700',
  leaf: 'bg-[#F1F8EC] text-[#3F7A26]',
  muted: 'bg-beige text-muted',
  red: 'bg-red-50 text-red-600',
};

const TABS = [
  { id: 'baru', label: 'Permintaan baru', match: (s) => !s || s === 'menunggu konfirmasi' },
  { id: 'aktif', label: 'Tugas saya', match: (s) => s === 'diterima' || s === 'berlangsung' },
  { id: 'riwayat', label: 'Riwayat', match: (s) => !!s && !['menunggu konfirmasi', 'diterima', 'berlangsung'].includes(s) },
];

export function OrderCard({ order: o, onAction, busy }) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const st = statusInfo(o.status);
  const pay = companionPayout(o);
  const service = getService(o.service_id);

  return (
    <article className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-muted">{o.id}</p>
          <h3 className="mt-0.5 text-lg font-extrabold text-ink">{service?.title ?? o.service_id}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${TONE[st.tone]}`}>{st.label}</span>
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <p className="flex items-start gap-2"><Icon name="calendar" className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" /> {formatDate(o.service_date)}</p>
        <p className="flex items-start gap-2">
          <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" />
          {fmtTime(o.start_time)} - {endTime(o.start_time, o.duration_hours)} ({o.duration_hours ?? '-'} jam)
        </p>
        <p className="flex items-start gap-2"><Icon name="user" className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" /> {o.user_name}{o.elder_age ? `, ${o.elder_age} tahun` : ''}</p>
        <p className="flex items-start gap-2"><Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" /> {o.address || '-'}{o.district ? `, Kec. ${o.district}` : ''}</p>
      </div>

      <div className="mt-4 grid gap-2 rounded-2xl bg-beige p-4 text-sm">
        <p><span className="font-bold text-ink">Kebutuhan bantuan: </span>{o.needs || 'Tidak ada'}</p>
        {o.notes && <p><span className="font-bold text-ink">Catatan: </span>{o.notes}</p>}
      </div>

      {o.family_phone && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-forest-100 p-4">
          <div className="text-sm">
            <p className="text-xs text-muted">Keluarga penanggung jawab</p>
            <p className="font-bold text-ink">{o.family_name} ({o.family_relation})</p>
          </div>
          <div className="flex gap-2">
            <a href={`tel:${o.family_phone}`} className="inline-flex items-center gap-1.5 rounded-full border-2 border-forest-200 px-4 py-2 text-sm font-semibold text-forest-700 hover:border-forest-500">
              Telepon
            </a>
            <a href={waLink(o.family_phone)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-forest-700 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-800">
              <Icon name="chat" className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-end justify-between border-t border-dashed border-forest-100 pt-4">
        <div className="text-xs text-muted">
          <p>Honor {Math.round(COMPANION_SHARE * 100)}% tarif: {rupiah(pay.share)}</p>
          <p>Ongkos kedatangan: {rupiah(pay.transport)}{o.distance_km != null ? ` (± ${o.distance_km} km)` : ''}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">Perkiraan honor</p>
          <p className="text-xl font-extrabold text-forest-700">{rupiah(pay.total)}</p>
        </div>
      </div>

      {(o.started_at || o.finished_at) && (
        <p className="mt-3 text-xs text-muted">
          {o.started_at && `Mulai: ${new Date(o.started_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`}
          {o.finished_at && ` • Selesai: ${new Date(o.finished_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`}
        </p>
      )}
      {o.status === 'ditolak' && o.reject_reason && <p className="mt-3 text-xs text-muted">Alasan menolak: {o.reject_reason}</p>}

      {/* Tombol aksi sesuai status */}
      <div className="mt-5">
        {(!o.status || o.status === 'menunggu konfirmasi') && !rejecting && (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" disabled={busy} onClick={() => setRejecting(true)}>Tolak</Button>
            <Button disabled={busy} onClick={() => onAction(o.id, 'diterima')}>
              <Icon name="check" className="h-4 w-4" /> Terima
            </Button>
          </div>
        )}
        {rejecting && (
          <div className="grid gap-2">
            <label htmlFor={`reason-${o.id}`} className="text-sm font-bold text-ink">Alasan menolak (opsional)</label>
            <textarea id={`reason-${o.id}`} rows={2} className={inputClass(false)} placeholder="Contoh: jadwal bentrok" value={reason} onChange={(e) => setReason(e.target.value)} />
            <p className="text-xs text-muted">Pesanan akan dikembalikan ke admin untuk dicarikan pendamping lain.</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="ghost" disabled={busy} onClick={() => setRejecting(false)}>Batal</Button>
              <Button variant="outline" disabled={busy} className="!border-red-300 !text-red-600" onClick={() => onAction(o.id, 'ditolak', { reject_reason: reason.trim() || null })}>
                Ya, tolak pesanan
              </Button>
            </div>
          </div>
        )}
        {o.status === 'diterima' && (
          <Button size="lg" className="w-full" disabled={busy} onClick={() => onAction(o.id, 'berlangsung')}>
            Mulai Layanan
          </Button>
        )}
        {o.status === 'berlangsung' && (
          <Button size="lg" variant="accent" className="w-full" disabled={busy} onClick={() => onAction(o.id, 'selesai')}>
            <Icon name="checkCircle" className="h-5 w-5" /> Selesaikan Layanan
          </Button>
        )}
      </div>
    </article>
  );
}

export default function CompanionDashboard({ companion, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('baru');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await fetchCompanionOrders(companion.id);
    setOrders(data);
    setError(err ? 'Gagal memuat pesanan. Coba muat ulang.' : '');
    setLoading(false);
  }, [companion.id]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (id, status, extra) => {
    setBusy(true);
    const { error: err } = await updateOrderStatus(id, status, extra);
    setBusy(false);
    if (err) setError('Status gagal diubah. Coba lagi.');
    else load();
  };

  const counts = Object.fromEntries(TABS.map((t) => [t.id, orders.filter((o) => t.match(o.status)).length]));
  const list = orders.filter((o) => TABS.find((t) => t.id === tab).match(o.status));
  const earned = orders.filter((o) => o.status === 'selesai').reduce((sum, o) => sum + companionPayout(o).total, 0);

  return (
    <Container className="max-w-4xl py-8 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar look={companion.look} className="h-16 w-16" />
          <div>
            <p className="text-sm text-muted">Dashboard pendamping</p>
            <h1 className="text-2xl font-extrabold text-ink">Halo, {companion.name.split(' ')[0]}</h1>
            <p className="text-sm text-muted">{companion.location}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={load} disabled={loading}>Muat ulang</Button>
          <Button variant="outline" size="sm" onClick={onLogout}>Keluar</Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          ['Permintaan baru', counts.baru],
          ['Tugas aktif', counts.aktif],
          ['Honor selesai', rupiah(earned)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-forest-100 bg-white p-4 text-center">
            <p className="text-lg font-extrabold text-forest-700 sm:text-2xl">{v}</p>
            <p className="text-xs text-muted">{k}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${tab === t.id ? 'border-forest-700 bg-forest-700 text-white' : 'border-forest-100 bg-white text-muted'}`}
          >
            {t.label} ({counts[t.id]})
          </button>
        ))}
      </div>

      {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <div className="mt-5 grid gap-4">
        {loading ? (
          <p className="py-12 text-center text-muted">Memuat pesanan...</p>
        ) : list.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-forest-200 bg-white p-10 text-center">
            <p className="font-bold text-ink">Belum ada pesanan di sini</p>
            <p className="mt-1 text-sm text-muted">Pesanan yang memilih Anda sebagai pendamping akan muncul otomatis.</p>
          </div>
        ) : (
          list.map((o) => <OrderCard key={o.id} order={o} onAction={act} busy={busy} />)
        )}
      </div>
    </Container>
  );
}
