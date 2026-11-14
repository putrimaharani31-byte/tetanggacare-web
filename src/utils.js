import { supabase } from './supabase.js';
import { ASSIST_NEEDS, COMPANIONS, COMPANION_SHARE, DISTRICTS, DURATIONS, PRICING, SERVICES, SERVICE_HOURS, TRANSPORT } from './data.js';

/* ---------------- Format ---------------- */
export const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0);

export const formatDate = (iso) =>
  iso
    ? new Date(`${iso}T00:00:00`).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '-';

export const fmtTime = (t) => (t ? t.replace(':', '.') : '-');

export const endTime = (time, hours) => {
  if (!time || !hours) return '-';
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + Number(hours) * 60;
  const next = total >= 1440 ? ' (+1 hari)' : '';
  const r = total % 1440;
  return `${String(Math.floor(r / 60)).padStart(2, '0')}.${String(r % 60).padStart(2, '0')}${next}`;
};

/* ---------------- Jam layanan ---------------- */
const toMinutes = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));

// Durasi terpanjang supaya layanan selesai paling lambat jam tutup
export const maxDurationFor = (time) =>
  time ? Math.min(Math.max(...DURATIONS), Math.floor((toMinutes(SERVICE_HOURS.close) - toMinutes(time)) / 60)) : Math.max(...DURATIONS);

export const availableDurations = (time) => DURATIONS.filter((d) => d <= maxDurationFor(time));

export const dateFromToday = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const z = (x) => String(x).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
};

/* ---------------- Pencarian data ---------------- */
export const getService = (id) => SERVICES.find((s) => s.id === id);
export const getCompanion = (id) => COMPANIONS.find((c) => c.id === id);
export const getDistrict = (id) => DISTRICTS.find((d) => d.id === id);
export const needsLabel = (ids = []) =>
  ids.length ? ids.map((id) => ASSIST_NEEDS.find((n) => n.id === id)?.label).filter(Boolean).join(', ') : 'Tidak ada';

/* ---------------- Jarak & ongkos transport (simulasi) ---------------- */
// Jarak garis lurus antara dua titik (km), dibulatkan 1 desimal
export function distanceKm(a, b) {
  if (!a || !b) return null;
  const R = 6371;
  const rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)) * 10) / 10;
}

export const companionDistance = (companion, districtId) =>
  companion ? distanceKm(getDistrict(companion.district), getDistrict(districtId)) : null;

// Kelebihan jarak dibulatkan ke atas per km, lalu dikali tarif dan dikali 2 jika pulang-pergi
export function transportFee(km) {
  if (km == null) return { km: null, extraKm: 0, trips: TRANSPORT.roundTrip ? 2 : 1, fee: 0 };
  const extraKm = Math.max(0, Math.ceil(km - TRANSPORT.freeKm));
  const trips = TRANSPORT.roundTrip ? 2 : 1;
  return { km, extraKm, trips, fee: extraKm * TRANSPORT.perKm * trips };
}

export const distanceText = (km) => (km == null ? '' : km === 0 ? 'satu kecamatan' : `± ${km} km`);

export const transportNote = (t) =>
  t.km == null
    ? 'Dihitung setelah kecamatan dan pendamping dipilih'
    : t.extraKm === 0
      ? `${t.km === 0 ? 'Satu kecamatan' : `Jarak ± ${t.km} km`}, masih dalam ${TRANSPORT.freeKm} km gratis`
      : `Jarak ± ${t.km} km. Kelebihan ${t.extraKm} km x ${rupiah(TRANSPORT.perKm)}${t.trips === 2 ? ' x 2 (pulang-pergi)' : ''}`;

// Urutkan pendamping dari yang terdekat (lalu rating tertinggi)
export const sortByDistance = (list, districtId) =>
  [...list]
    .map((c) => ({ ...c, distance: companionDistance(c, districtId) }))
    .sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999) || b.rating - a.rating);

export const recommendCompanion = (serviceId, districtId) =>
  sortByDistance(COMPANIONS.filter((c) => !serviceId || c.services.includes(serviceId)), districtId)[0];

export const resolveCompanion = (b) =>
  b.companionId === 'auto' ? recommendCompanion(b.serviceId, b.district) : getCompanion(b.companionId);

/* ---------------- Harga ---------------- */
export function calcPrice(b) {
  const hours = Number(b.duration) || 0;
  const companion = b.district ? resolveCompanion(b) : null;
  const transport = transportFee(companion ? companionDistance(companion, b.district) : null);

  const lines =
    PRICING.mode === 'perJam'
      ? [{ label: `Tarif pendampingan (${rupiah(PRICING.hourlyRate)} x ${hours} jam)`, value: PRICING.hourlyRate * hours }]
      : [{ label: 'Tarif dasar layanan (simulasi)', value: PRICING.basePrice }];

  lines.push({ label: 'Ongkos kedatangan pendamping', value: transport.fee, note: transportNote(transport) });
  if (PRICING.serviceFee) lines.push({ label: 'Biaya layanan platform', value: PRICING.serviceFee });

  return { lines, transport, total: lines.reduce((sum, l) => sum + l.value, 0) };
}

/* ---------------- Validasi formulir ---------------- */
export const normalizePhone = (p) => p.replace(/[\s-]/g, '');

export function validateBooking(b) {
  const e = {};
  if (!b.serviceId) e.serviceId = 'Pilih jenis layanan.';
  if (!b.elderName.trim()) e.elderName = 'Nama lansia wajib diisi.';
  const age = Number(b.elderAge);
  if (!b.elderAge) e.elderAge = 'Usia wajib diisi.';
  else if (!Number.isInteger(age) || age < 1 || age > 120) e.elderAge = 'Isi usia dengan angka yang benar.';
  if (!b.district) e.district = 'Pilih kecamatan lokasi layanan.';
  if (b.address.trim().length < 10) e.address = 'Tulis alamat lengkap (minimal 10 karakter).';
  if (!b.familyName.trim()) e.familyName = 'Nama keluarga penanggung jawab wajib diisi.';
  if (!/^(\+62|62|0)8\d{7,12}$/.test(normalizePhone(b.familyPhone))) e.familyPhone = 'Isi nomor HP yang benar, contoh 081234567890.';
  if (!b.familyRelation) e.familyRelation = 'Pilih hubungan dengan lansia.';
  if (!b.date) e.date = 'Pilih tanggal layanan.';
  else if (b.date < dateFromToday(1)) e.date = 'Tanggal layanan paling cepat besok.';
  if (!b.time) e.time = 'Pilih waktu mulai.';
  if (!b.duration) e.duration = 'Pilih durasi layanan.';
  else if (b.time && Number(b.duration) > maxDurationFor(b.time))
    e.duration = `Layanan selesai paling lambat pukul ${fmtTime(SERVICE_HOURS.close)}. Pilih durasi maksimal ${maxDurationFor(b.time)} jam.`;
  if (!b.companionId) e.companionId = 'Pilih pendamping, atau biarkan TetanggaCare memilihkan.';
  return e;
}

export const isBookingComplete = (b) => Object.keys(validateBooking(b)).length === 0;

export const makeOrderId = () => {
  const d = new Date();
  const z = (x) => String(x).padStart(2, '0');
  return `TC-${String(d.getFullYear()).slice(2)}${z(d.getMonth() + 1)}${z(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`;
};

/* ---------------- Honor pendamping ---------------- */
// Honor = bagian pendamping dari tarif x durasi + ongkos kedatangan (100%)
export function companionPayout(row) {
  const hours = Number(row.duration_hours) || 0;
  const base = PRICING.mode === 'perJam' ? PRICING.hourlyRate * hours : PRICING.basePrice;
  const share = Math.round(base * COMPANION_SHARE);
  const transport = Number(row.transport_fee) || 0;
  return { share, transport, total: share + transport };
}

export const waLink = (phone) => {
  const p = normalizePhone(phone || '');
  const intl = p.startsWith('+62') ? p.slice(1) : p.startsWith('0') ? `62${p.slice(1)}` : p;
  return `https://wa.me/${intl}`;
};

/* ---------------- Supabase ---------------- */
export async function saveOrderToDatabase(order, price) {
  const companion = resolveCompanion(order);
  const { error } = await supabase.from('orders').insert({
    id: order.id,
    user_name: order.elderName,
    elder_age: Number(order.elderAge) || null,
    needs: needsLabel(order.needs),
    service_id: order.serviceId,
    companion_id: companion?.id ?? null,
    district: getDistrict(order.district)?.name ?? null,
    address: order.address,
    family_name: order.familyName,
    family_phone: normalizePhone(order.familyPhone),
    family_relation: order.familyRelation,
    service_date: order.date || null,
    start_time: order.time,
    duration_hours: Number(order.duration) || null,
    distance_km: price?.transport?.km ?? null,
    transport_fee: price?.transport?.fee ?? 0,
    notes: order.notes,
    total_price: price?.total ?? 0,
    status: 'menunggu konfirmasi',
  });
  if (error) console.error('Gagal menyimpan pesanan:', error.message);
  return { error };
}

export async function logUserActivity() {
  const { error } = await supabase.from('activity_logs').insert({ user_email: 'pengunjung', action: 'buka_web' });
  if (error) console.error('Gagal mencatat kunjungan:', error.message);
}

// Status pesanan
export const ORDER_STATUS = {
  'menunggu konfirmasi': { label: 'Menunggu konfirmasi', tone: 'sun' },
  diterima: { label: 'Diterima pendamping', tone: 'forest' },
  berlangsung: { label: 'Layanan berlangsung', tone: 'leaf' },
  selesai: { label: 'Selesai', tone: 'muted' },
  ditolak: { label: 'Ditolak, dicarikan pendamping lain', tone: 'red' },
};
export const statusInfo = (s) => ORDER_STATUS[s] || (s ? { label: s, tone: 'muted' } : ORDER_STATUS['menunggu konfirmasi']);

export async function fetchCompanionOrders(companionId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('companion_id', companionId)
    .order('service_date', { ascending: true })
    .order('start_time', { ascending: true });
  if (error) console.error('Gagal mengambil pesanan:', error.message);
  return { data: data || [], error };
}

const STATUS_TIME = { diterima: 'accepted_at', berlangsung: 'started_at', selesai: 'finished_at', ditolak: 'rejected_at' };

export async function updateOrderStatus(id, status, extra = {}) {
  const patch = { status, ...extra };
  if (STATUS_TIME[status]) patch[STATUS_TIME[status]] = new Date().toISOString();
  const { error } = await supabase.from('orders').update(patch).eq('id', id);
  if (error) console.error('Gagal mengubah status:', error.message);
  return { error };
}


/* ---------------- Riwayat pesanan ---------------- */
// Admin: semua pesanan (terbaru di atas)
export async function fetchAllOrders() {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) console.error('Gagal mengambil riwayat:', error.message);
  return { data: data || [], error };
}

export const districtIdByName = (name) => DISTRICTS.find((d) => d.name === name)?.id;

// Hitung ulang ongkos & total jika pesanan dipindah ke pendamping lain
export function reassignQuote(row, companionId) {
  const companion = getCompanion(companionId);
  const km = companionDistance(companion, districtIdByName(row.district));
  const t = transportFee(km);
  const hours = Number(row.duration_hours) || 0;
  const base = PRICING.mode === 'perJam' ? PRICING.hourlyRate * hours : PRICING.basePrice;
  return { km, fee: t.fee, total: base + t.fee + (PRICING.serviceFee || 0) };
}

export async function adminReassign(row, companionId) {
  const q = reassignQuote(row, companionId);
  const { error } = await supabase.rpc('admin_reassign', {
    p_id: row.id,
    p_companion: companionId,
    p_distance: q.km,
    p_fee: q.fee,
    p_total: q.total,
  });
  if (error) console.error('Gagal memindahkan pesanan:', error.message);
  return { error };
}

// Pemesan: cek pesanan dengan nomor pesanan + nomor HP keluarga
export async function checkOrder(id, phone) {
  const { data, error } = await supabase.rpc('check_order', { p_id: id.trim().toUpperCase(), p_phone: phone });
  if (error) console.error('Gagal cek pesanan:', error.message);
  return { order: data?.[0] || null, error };
}

// Pesanan Saya: daftar nomor pesanan yang dibuat dari perangkat ini
const MY_ORDERS_KEY = 'tc_my_orders';
export function getMyOrders() {
  try {
    return JSON.parse(localStorage.getItem(MY_ORDERS_KEY) || '[]');
  } catch {
    return [];
  }
}
export function saveMyOrder(entry) {
  try {
    const list = getMyOrders().filter((o) => o.id !== entry.id);
    localStorage.setItem(MY_ORDERS_KEY, JSON.stringify([entry, ...list].slice(0, 30)));
  } catch {
    /* penyimpanan browser tidak tersedia */
  }
}
export function removeMyOrder(id) {
  try {
    localStorage.setItem(MY_ORDERS_KEY, JSON.stringify(getMyOrders().filter((o) => o.id !== id)));
  } catch {
    /* abaikan */
  }
}
