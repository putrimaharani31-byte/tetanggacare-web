import { PRICING, COMPANIONS, SERVICES, CATEGORIES } from './data.js';

export const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

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

export const dateFromToday = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const z = (x) => String(x).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
};

export const getService = (id) => SERVICES.find((s) => s.id === id);
export const getCompanion = (id) => COMPANIONS.find((c) => c.id === id);

export const categoryLabel = (b) =>
  b.category === 'lainnya'
    ? `Lainnya: ${b.categoryOther}`
    : CATEGORIES.find((c) => c.id === b.category)?.label ?? '-';

// Pendamping dengan rating tertinggi yang melayani jenis layanan tersebut
export const recommendCompanion = (serviceId) =>
  [...COMPANIONS].filter((c) => !serviceId || c.services.includes(serviceId)).sort((a, b) => b.rating - a.rating)[0];

export const resolveCompanion = (b) =>
  b.companionId === 'auto' ? recommendCompanion(b.serviceId) : getCompanion(b.companionId);

export function calcPrice(b) {
  const hours = Number(b.duration) || 0;
  if (PRICING.mode === 'perJam') {
    const subtotal = PRICING.hourlyRate * hours;
    return {
      lines: [
        { label: `Tarif pendampingan (${rupiah(PRICING.hourlyRate)} x ${hours} jam)`, value: subtotal },
        { label: 'Biaya layanan platform', value: PRICING.serviceFee },
      ],
      total: subtotal + PRICING.serviceFee,
    };
  }
  return {
    lines: [
      { label: 'Tarif dasar layanan (simulasi)', value: PRICING.basePrice },
      { label: 'Biaya layanan platform', value: PRICING.serviceFee },
    ],
    total: PRICING.basePrice + PRICING.serviceFee,
  };
}

export function validateBooking(b) {
  const e = {};
  if (!b.serviceId) e.serviceId = 'Pilih jenis layanan.';
  if (!b.name.trim()) e.name = 'Nama pengguna wajib diisi.';
  if (!b.category) e.category = 'Pilih kategori kebutuhan.';
  else if (b.category === 'lainnya' && !b.categoryOther.trim()) e.categoryOther = 'Tuliskan kebutuhan secara singkat.';
  if (b.address.trim().length < 10) e.address = 'Tulis alamat lengkap (minimal 10 karakter).';
  if (!b.date) e.date = 'Pilih tanggal layanan.';
  else if (b.date < dateFromToday(1)) e.date = 'Tanggal layanan paling cepat besok.';
  if (!b.time) e.time = 'Pilih waktu mulai.';
  if (!b.duration) e.duration = 'Pilih durasi layanan.';
  if (!b.companionId) e.companionId = 'Pilih pendamping, atau biarkan TetanggaCare memilihkan.';
  return e;
}

export const isBookingComplete = (b) => Object.keys(validateBooking(b)).length === 0;

export const makeOrderId = () => {
  const d = new Date();
  const z = (x) => String(x).padStart(2, '0');
  return `TC-${String(d.getFullYear()).slice(2)}${z(d.getMonth() + 1)}${z(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`;
};
