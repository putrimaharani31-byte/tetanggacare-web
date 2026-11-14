import { useCallback, useEffect, useState } from 'react';
import { Button, Container, Field, Icon, PageHeader, inputClass } from '../components/ui.jsx';
import { checkOrder, endTime, fmtTime, formatDate, getCompanion, getMyOrders, getService, removeMyOrder, rupiah, statusInfo } from '../utils.js';

const TONE = {
  sun: 'bg-sun-50 text-[#B86B00]',
  forest: 'bg-forest-50 text-forest-700',
  leaf: 'bg-[#F1F8EC] text-[#3F7A26]',
  muted: 'bg-beige text-muted',
  red: 'bg-red-50 text-red-600',
};

const STEPS = [
  { key: 'created_at', label: 'Pesanan dibuat' },
  { key: 'accepted_at', label: 'Diterima pendamping' },
  { key: 'started_at', label: 'Layanan dimulai' },
  { key: 'finished_at', label: 'Layanan selesai' },
];

const clock = (iso) =>
  iso ? new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';

export function OrderStatusCard({ order: o, onRemove }) {
  const st = statusInfo(o.status);
  const companion = getCompanion(o.companion_id);
  return (
    <article className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-mono text-sm font-bold text-forest-700">{o.id}</p>
          <h3 className="mt-0.5 text-lg font-extrabold text-ink">{getService(o.service_id)?.title ?? o.service_id}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${TONE[st.tone]}`}>{st.label}</span>
      </div>

      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <p className="flex items-start gap-2"><Icon name="user" className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" /> {o.user_name}</p>
        <p className="flex items-start gap-2"><Icon name="calendar" className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" /> {formatDate(o.service_date)}</p>
        <p className="flex items-start gap-2">
          <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" /> {fmtTime(o.start_time)} - {endTime(o.start_time, o.duration_hours)}
        </p>
        <p className="flex items-start gap-2"><Icon name="users" className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" /> {companion?.name ?? 'Sedang dicarikan'}</p>
      </div>

      {o.status === 'ditolak' ? (
        <p className="mt-4 rounded-xl bg-sun-50 p-3 text-sm text-ink">Pendamping berhalangan. Admin sedang mencarikan pendamping lain untuk pesanan ini.</p>
      ) : (
        <ol className="mt-5 grid grid-cols-4 gap-1">
          {STEPS.map((s) => {
            const done = !!o[s.key];
            return (
              <li key={s.key} className="text-center">
                <span className={`mx-auto block h-2 rounded-full ${done ? 'bg-forest-500' : 'bg-forest-100'}`} />
                <span className={`mt-2 block text-[11px] font-semibold leading-tight ${done ? 'text-ink' : 'text-muted'}`}>{s.label}</span>
                {done && <span className="block text-[10px] text-muted">{clock(o[s.key])}</span>}
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-dashed border-forest-100 pt-4">
        <span className="text-sm text-muted">Total estimasi</span>
        <span className="text-lg font-extrabold text-forest-700">{rupiah(o.total_price)}</span>
      </div>
      {onRemove && (
        <button onClick={() => onRemove(o.id)} className="mt-3 text-xs font-semibold text-muted underline-offset-2 hover:underline">
          Hapus dari daftar di perangkat ini
        </button>
      )}
    </article>
  );
}

export default function MyOrders({ go }) {
  const [saved, setSaved] = useState(getMyOrders);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [checkId, setCheckId] = useState('');
  const [checkPhone, setCheckPhone] = useState('');
  const [checked, setChecked] = useState(null);
  const [checkMsg, setCheckMsg] = useState('');
  const [checking, setChecking] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const results = await Promise.all(saved.map((s) => checkOrder(s.id, s.phone)));
    setOrders(results.map((r) => r.order).filter(Boolean));
    setLoading(false);
  }, [saved]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = (id) => {
    removeMyOrder(id);
    setSaved(getMyOrders());
  };

  const doCheck = async (e) => {
    e.preventDefault();
    setChecked(null);
    setCheckMsg('');
    if (!checkId.trim() || !checkPhone.trim()) {
      setCheckMsg('Isi nomor pesanan dan nomor HP keluarga.');
      return;
    }
    setChecking(true);
    const { order, error } = await checkOrder(checkId, checkPhone);
    setChecking(false);
    if (error) setCheckMsg('Gagal memeriksa pesanan. Coba lagi.');
    else if (!order) setCheckMsg('Pesanan tidak ditemukan. Periksa kembali nomor pesanan dan nomor HP.');
    else setChecked(order);
  };

  return (
    <>
      <PageHeader eyebrow="Pesanan saya" title="Riwayat & status pesanan" desc="Lihat pesanan yang dibuat dari perangkat ini, atau cek pesanan dengan nomor pesanan dan nomor HP keluarga." />
      <Container className="grid max-w-4xl gap-8 py-8 sm:py-12">
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold text-ink">Dibuat dari perangkat ini</h2>
            {saved.length > 0 && <Button variant="ghost" size="sm" onClick={load} disabled={loading}>Muat ulang</Button>}
          </div>
          {loading ? (
            <p className="py-8 text-center text-muted">Memuat pesanan...</p>
          ) : orders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-forest-200 bg-white p-8 text-center">
              <p className="font-bold text-ink">Belum ada pesanan di perangkat ini</p>
              <p className="mt-1 text-sm text-muted">Pesanan yang Anda buat dari perangkat ini akan muncul di sini.</p>
              <Button className="mt-5" onClick={() => go('/pesan')}>Pesan Pendamping</Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((o) => <OrderStatusCard key={o.id} order={o} onRemove={remove} />)}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-8">
          <h2 className="text-xl font-extrabold text-ink">Cek pesanan dari perangkat lain</h2>
          <p className="mt-1 text-sm text-muted">Nomor pesanan ada di halaman konfirmasi, misalnya TC-261116-1234.</p>
          <form onSubmit={doCheck} className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <Field id="check-id" label="Nomor pesanan">
              <input id="check-id" autoCapitalize="characters" className={inputClass(false)} placeholder="TC-261116-1234" value={checkId} onChange={(e) => setCheckId(e.target.value)} />
            </Field>
            <Field id="check-phone" label="Nomor HP keluarga">
              <input id="check-phone" type="tel" inputMode="tel" className={inputClass(false)} placeholder="081234567890" value={checkPhone} onChange={(e) => setCheckPhone(e.target.value)} />
            </Field>
            <Button type="submit" disabled={checking}>{checking ? 'Memeriksa...' : 'Cek'}</Button>
          </form>
          {checkMsg && <p className="mt-4 text-sm font-medium text-red-600">{checkMsg}</p>}
          {checked && (
            <div className="mt-5">
              <OrderStatusCard order={checked} />
            </div>
          )}
        </section>
      </Container>
    </>
  );
}
