import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Container, Icon, inputClass } from '../components/ui.jsx';
import { COMPANIONS } from '../data.js';
import {
  ORDER_STATUS,
  adminReassign,
  districtIdByName,
  endTime,
  fetchAllOrders,
  fmtTime,
  formatDate,
  getCompanion,
  getService,
  reassignQuote,
  rupiah,
  sortByDistance,
  statusInfo,
  updateOrderStatus,
  waLink,
} from '../utils.js';

const TONE = {
  sun: 'bg-sun-50 text-[#B86B00]',
  forest: 'bg-forest-50 text-forest-700',
  leaf: 'bg-[#F1F8EC] text-[#3F7A26]',
  muted: 'bg-beige text-muted',
  red: 'bg-red-50 text-red-600',
};

const clock = (iso) =>
  iso ? new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

export function Detail({ order: o, onChanged }) {
  const [status, setStatus] = useState(o.status || 'menunggu konfirmasi');
  const [target, setTarget] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const options = sortByDistance(
    COMPANIONS.filter((c) => c.id !== o.companion_id && (!o.service_id || c.services.includes(o.service_id))),
    districtIdByName(o.district)
  );
  const quote = target ? reassignQuote(o, target) : null;

  const saveStatus = async () => {
    setBusy(true);
    const { error } = await updateOrderStatus(o.id, status);
    setBusy(false);
    setMsg(error ? 'Status gagal diubah.' : 'Status diperbarui.');
    if (!error) onChanged();
  };

  const reassign = async () => {
    setBusy(true);
    const { error } = await adminReassign(o, target);
    setBusy(false);
    setMsg(error ? 'Gagal memindahkan pesanan.' : `Pesanan dipindahkan ke ${getCompanion(target)?.name}.`);
    if (!error) {
      setTarget('');
      onChanged();
    }
  };

  const rows = [
    ['Lansia', `${o.user_name ?? '-'}${o.elder_age ? `, ${o.elder_age} tahun` : ''}`],
    ['Kebutuhan bantuan', o.needs || '-'],
    ['Alamat', `${o.address || '-'}${o.district ? `, Kec. ${o.district}` : ''}`],
    ['Catatan', o.notes || '-'],
    ['Jadwal', `${formatDate(o.service_date)}, ${fmtTime(o.start_time)} - ${endTime(o.start_time, o.duration_hours)}`],
    ['Ongkos kedatangan', `${rupiah(o.transport_fee)}${o.distance_km != null ? ` (± ${o.distance_km} km)` : ''}`],
    ['Dibuat', clock(o.created_at)],
    ['Diterima', clock(o.accepted_at)],
    ['Mulai', clock(o.started_at)],
    ['Selesai', clock(o.finished_at)],
  ];
  if (o.status === 'ditolak') rows.push(['Alasan ditolak', o.reject_reason || '-']);

  return (
    <div className="grid gap-5 border-t border-forest-100 bg-beige/50 p-4 sm:p-6">
      <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="flex gap-2">
            <dt className="w-32 shrink-0 text-muted">{k}</dt>
            <dd className="min-w-0 break-words font-semibold text-ink">{v}</dd>
          </div>
        ))}
      </dl>

      {o.family_phone && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4">
          <p className="text-sm">
            <span className="text-muted">Keluarga: </span>
            <span className="font-bold text-ink">{o.family_name} ({o.family_relation}) • {o.family_phone}</span>
          </p>
          <a href={waLink(o.family_phone)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-forest-700 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-800">
            <Icon name="chat" className="h-4 w-4" /> WhatsApp
          </a>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-4">
          <p className="text-sm font-bold text-ink">Ubah status</p>
          <div className="mt-2 flex gap-2">
            <select className={inputClass(false)} value={status} onChange={(e) => setStatus(e.target.value)}>
              {Object.entries(ORDER_STATUS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <Button size="sm" disabled={busy || status === o.status} onClick={saveStatus}>Simpan</Button>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <p className="text-sm font-bold text-ink">Pindahkan ke pendamping lain</p>
          <div className="mt-2 flex gap-2">
            <select className={inputClass(false)} value={target} onChange={(e) => setTarget(e.target.value)}>
              <option value="">Pilih pendamping</option>
              {options.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.distance == null ? c.location : c.distance === 0 ? 'satu kecamatan' : `± ${c.distance} km`})
                </option>
              ))}
            </select>
            <Button size="sm" disabled={busy || !target} onClick={reassign}>Pindahkan</Button>
          </div>
          {quote && (
            <p className="mt-2 text-xs text-muted">
              Ongkos baru {rupiah(quote.fee)}, total baru {rupiah(quote.total)}. Status kembali menjadi "Menunggu konfirmasi".
            </p>
          )}
        </div>
      </div>
      {msg && <p className="text-sm font-semibold text-forest-700">{msg}</p>}
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('semua');
  const [openId, setOpenId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await fetchAllOrders();
    setOrders(data);
    setError(err ? 'Gagal memuat riwayat pesanan.' : '');
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      const s = o.status || 'menunggu konfirmasi';
      const okStatus = filter === 'semua' || s === filter || (filter === 'lainnya' && !ORDER_STATUS[s]);
      const okQuery = !q || o.id?.toLowerCase().includes(q) || o.user_name?.toLowerCase().includes(q) || o.family_name?.toLowerCase().includes(q);
      return okStatus && okQuery;
    });
  }, [orders, query, filter]);

  const count = (k) => orders.filter((o) => (o.status || 'menunggu konfirmasi') === k).length;

  return (
    <Container className="pb-12">
      <section className="rounded-3xl border border-forest-100 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
          <div>
            <h2 className="text-2xl font-extrabold text-ink">Riwayat Pesanan</h2>
            <p className="text-sm text-muted">{orders.length} pesanan tercatat. Klik pesanan untuk melihat detail dan mengubahnya.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={load} disabled={loading}>Muat ulang</Button>
        </div>

        <div className="grid gap-3 px-5 pb-5 sm:px-6 lg:grid-cols-[1fr_auto]">
          <input className={inputClass(false)} placeholder="Cari nomor pesanan, nama lansia, atau keluarga" value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[['semua', `Semua (${orders.length})`], ...Object.entries(ORDER_STATUS).map(([k, v]) => [k, `${v.label.split(',')[0]} (${count(k)})`])].map(([k, label]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`shrink-0 rounded-full border px-3 py-2 text-xs font-semibold ${filter === k ? 'border-forest-700 bg-forest-700 text-white' : 'border-forest-100 bg-white text-muted'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="mx-5 mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 sm:mx-6">{error}</p>}

        {loading ? (
          <p className="py-10 text-center text-muted">Memuat riwayat...</p>
        ) : list.length === 0 ? (
          <p className="py-10 text-center text-muted">Tidak ada pesanan yang cocok.</p>
        ) : (
          <ul className="divide-y divide-forest-100 border-t border-forest-100">
            {list.map((o) => {
              const st = statusInfo(o.status);
              const open = openId === o.id;
              return (
                <li key={o.id}>
                  <button onClick={() => setOpenId(open ? null : o.id)} aria-expanded={open} className="grid w-full gap-2 p-4 text-left hover:bg-beige/60 sm:grid-cols-[1.2fr_1fr_1fr_auto] sm:items-center sm:gap-4 sm:px-6">
                    <span>
                      <span className="block font-mono text-sm font-bold text-forest-700">{o.id}</span>
                      <span className="block text-sm font-semibold text-ink">{o.user_name || '-'}</span>
                    </span>
                    <span className="text-sm text-muted">
                      {getService(o.service_id)?.title ?? o.service_id}
                      <span className="block">{o.service_date ? `${formatDate(o.service_date)}, ${fmtTime(o.start_time)}` : clock(o.created_at)}</span>
                    </span>
                    <span className="text-sm text-muted">
                      {getCompanion(o.companion_id)?.name ?? o.companion_id ?? '-'}
                      <span className="block font-bold text-ink">{rupiah(o.total_price)}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${TONE[st.tone]}`}>{st.label.split(',')[0]}</span>
                      <Icon name="arrowRight" className={`h-4 w-4 text-forest-700 transition-transform ${open ? 'rotate-90' : ''}`} />
                    </span>
                  </button>
                  {open && <Detail order={o} onChanged={load} />}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </Container>
  );
}
