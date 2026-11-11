import { useState } from 'react';
import { Avatar, Button, Container, Field, Icon, IconBadge, PageHeader, StarRating, inputClass } from '../components/ui.jsx';
import { CATEGORIES, COMPANIONS, DURATIONS, PRICING, SERVICES, TIMES } from '../data.js';
import { calcPrice, dateFromToday, endTime, fmtTime, getCompanion, getService, rupiah, validateBooking } from '../utils.js';

const FIELD_ORDER = ['serviceId', 'name', 'category', 'categoryOther', 'address', 'date', 'time', 'duration', 'companionId'];

function SectionTitle({ n, title, done }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className={`grid h-8 w-8 place-items-center rounded-full text-sm font-extrabold ${done ? 'bg-forest-700 text-white' : 'bg-forest-50 text-forest-700'}`}>
        {done ? <Icon name="check" className="h-4 w-4" strokeWidth={3} /> : n}
      </span>
      <h2 className="text-lg font-extrabold text-ink">{title}</h2>
    </div>
  );
}

export default function Booking({ booking: b, onChange, onSubmit, onViewCompanion }) {
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const set = (patch) => {
    onChange(patch);
    if (submitted) setErrors(validateBooking({ ...b, ...patch }));
  };

  const chooseService = (id) => {
    const c = getCompanion(b.companionId);
    // Jika pendamping terpilih tidak melayani layanan ini, kosongkan pilihan pendamping
    set(c && !c.services.includes(id) ? { serviceId: id, companionId: '' } : { serviceId: id });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateBooking(b);
    setErrors(errs);
    setSubmitted(true);
    const first = FIELD_ORDER.find((k) => errs[k]);
    if (first) {
      document.getElementById(`field-${first}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    onSubmit();
  };

  const companions = COMPANIONS.filter((c) => !b.serviceId || c.services.includes(b.serviceId));
  const done = {
    service: !!b.serviceId,
    user: !!b.name.trim() && !!b.category && b.address.trim().length >= 10 && (b.category !== 'lainnya' || !!b.categoryOther.trim()),
    schedule: !!b.date && !!b.time && !!b.duration,
    companion: !!b.companionId,
  };
  const progress = Object.values(done).filter(Boolean).length;
  const price = calcPrice(b);
  const service = getService(b.serviceId);
  const companion = b.companionId === 'auto' ? null : getCompanion(b.companionId);

  return (
    <>
      <PageHeader eyebrow="Pemesanan" title="Pesan pendamping" desc="Lengkapi data di bawah ini. Kolom bertanda * wajib diisi.">
        <div className="mt-6 max-w-md">
          <div className="flex justify-between text-sm font-semibold text-muted">
            <span>Kelengkapan formulir</span>
            <span className="text-forest-700">{progress}/4 bagian</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-forest-100">
            <div className="h-full rounded-full bg-forest-500 transition-all duration-500" style={{ width: `${(progress / 4) * 100}%` }} />
          </div>
        </div>
      </PageHeader>

      <Container className="py-10">
        <form noValidate onSubmit={handleSubmit} className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
          <div className="grid gap-6">
            {/* 1. Layanan */}
            <section className="rounded-3xl border border-forest-100 bg-white p-6 md:p-8">
              <SectionTitle n={1} title="Jenis layanan" done={done.service} />
              <Field id="serviceId" error={errors.serviceId}>
                <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Jenis layanan">
                  {SERVICES.map((s) => {
                    const active = b.serviceId === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => chooseService(s.id)}
                        className={`card-lift flex flex-col items-start gap-3 rounded-2xl border-2 p-4 text-left ${active ? 'border-forest-500 bg-forest-50' : 'border-forest-100 bg-white'}`}
                      >
                        <IconBadge name={s.icon} tone={s.color} className="h-11 w-11" />
                        <span className="font-bold text-ink">{s.title}</span>
                        <span className="text-xs leading-relaxed text-muted">{s.short}</span>
                      </button>
                    );
                  })}
                </div>
              </Field>
            </section>

            {/* 2. Data pengguna */}
            <section className="rounded-3xl border border-forest-100 bg-white p-6 md:p-8">
              <SectionTitle n={2} title="Data pengguna yang didampingi" done={done.user} />
              <div className="grid gap-5">
                <Field id="name" label="Nama pengguna yang akan didampingi" required error={errors.name}>
                  <input id="name" className={inputClass(errors.name)} placeholder="Contoh: Ibu Siti Rahayu" value={b.name} onChange={(e) => set({ name: e.target.value })} />
                </Field>

                <Field id="category" label="Kategori kebutuhan" required error={errors.category}>
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Kategori kebutuhan">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        role="radio"
                        aria-checked={b.category === c.id}
                        onClick={() => set({ category: c.id })}
                        className={`rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition ${
                          b.category === c.id ? 'border-forest-500 bg-forest-50 text-forest-700' : 'border-forest-100 text-muted hover:border-forest-300'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </Field>

                {b.category === 'lainnya' && (
                  <Field id="categoryOther" label="Jelaskan kebutuhan" required error={errors.categoryOther}>
                    <input id="categoryOther" className={inputClass(errors.categoryOther)} placeholder="Contoh: pemulihan setelah operasi ringan" value={b.categoryOther} onChange={(e) => set({ categoryOther: e.target.value })} />
                  </Field>
                )}

                <Field id="address" label="Alamat lokasi layanan" required error={errors.address} hint="Untuk pendampingan berobat, tulis alamat penjemputan.">
                  <textarea id="address" rows={3} className={inputClass(errors.address)} placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan" value={b.address} onChange={(e) => set({ address: e.target.value })} />
                </Field>
              </div>
            </section>

            {/* 3. Jadwal */}
            <section className="rounded-3xl border border-forest-100 bg-white p-6 md:p-8">
              <SectionTitle n={3} title="Jadwal layanan" done={done.schedule} />
              <div className="grid gap-5 sm:grid-cols-3">
                <Field id="date" label="Tanggal layanan" required error={errors.date}>
                  <input id="date" type="date" min={dateFromToday(1)} className={inputClass(errors.date)} value={b.date} onChange={(e) => set({ date: e.target.value })} />
                </Field>
                <Field id="time" label="Waktu mulai" required error={errors.time}>
                  <select id="time" className={inputClass(errors.time)} value={b.time} onChange={(e) => set({ time: e.target.value })}>
                    <option value="">Pilih jam</option>
                    {TIMES.map((t) => (
                      <option key={t} value={t}>{fmtTime(t)}</option>
                    ))}
                  </select>
                </Field>
                <Field id="duration" label="Durasi layanan" required error={errors.duration}>
                  <select id="duration" className={inputClass(errors.duration)} value={b.duration} onChange={(e) => set({ duration: e.target.value })}>
                    <option value="">Pilih durasi</option>
                    {DURATIONS.map((d) => (
                      <option key={d} value={d}>{d} jam</option>
                    ))}
                  </select>
                </Field>
              </div>
              {b.time && b.duration && (
                <p className="mt-4 flex items-center gap-2 rounded-xl bg-forest-50 px-4 py-3 text-sm text-forest-800">
                  <Icon name="clock" className="h-4 w-4" /> Layanan berlangsung pukul {fmtTime(b.time)} sampai {endTime(b.time, b.duration)}.
                </p>
              )}

              <div className="mt-5">
                <Field id="notes" label="Catatan kebutuhan khusus" hint="Opsional. Contoh: menggunakan kursi roda, pendengaran kurang baik, perlu dibantu naik mobil.">
                  <textarea id="notes" rows={3} className={inputClass(false)} placeholder="Tuliskan hal yang perlu diketahui pendamping" value={b.notes} onChange={(e) => set({ notes: e.target.value })} />
                </Field>
              </div>
            </section>

            {/* 4. Pendamping */}
            <section className="rounded-3xl border border-forest-100 bg-white p-6 md:p-8">
              <SectionTitle n={4} title="Pilihan pendamping" done={done.companion} />
              {!b.serviceId && <p className="mb-4 text-sm text-muted">Pilih jenis layanan terlebih dahulu agar daftar pendamping sesuai.</p>}
              <Field id="companionId" error={errors.companionId}>
                <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Pilihan pendamping">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={b.companionId === 'auto'}
                    onClick={() => set({ companionId: 'auto' })}
                    className={`card-lift flex items-center gap-3 rounded-2xl border-2 p-4 text-left ${b.companionId === 'auto' ? 'border-forest-500 bg-forest-50' : 'border-forest-100'}`}
                  >
                    <IconBadge name="sparkles" tone="sun" className="h-14 w-14" />
                    <span>
                      <span className="block font-bold text-ink">Pilihkan untuk saya</span>
                      <span className="text-xs text-muted">TetanggaCare mencocokkan pendamping terbaik yang tersedia.</span>
                    </span>
                  </button>
                  {companions.map((c) => {
                    const active = b.companionId === c.id;
                    return (
                      <div
                        key={c.id}
                        role="radio"
                        tabIndex={0}
                        aria-checked={active}
                        onClick={() => set({ companionId: c.id })}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), set({ companionId: c.id }))}
                        className={`card-lift flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 ${active ? 'border-forest-500 bg-forest-50' : 'border-forest-100'}`}
                      >
                        <Avatar look={c.look} className="h-14 w-14" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-bold text-ink">{c.name}</span>
                          <StarRating rating={c.rating} />
                          <span className="block truncate text-xs text-muted">{c.location}</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewCompanion(c.id);
                          }}
                          className="shrink-0 rounded-full px-2 py-1 text-xs font-bold text-forest-700 hover:bg-white"
                        >
                          Profil
                        </button>
                      </div>
                    );
                  })}
                </div>
              </Field>
            </section>
          </div>

          {/* Ringkasan samping */}
          <aside className="rounded-3xl border border-forest-100 bg-white p-6 lg:sticky lg:top-28">
            <p className="text-sm font-bold uppercase tracking-wider text-forest-500">Pesanan Anda</p>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-muted">Layanan</dt><dd className="text-right font-semibold">{service?.title ?? '-'}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">Jadwal</dt><dd className="text-right font-semibold">{b.date ? b.date.split('-').reverse().join('/') : '-'}{b.time ? `, ${fmtTime(b.time)}` : ''}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">Durasi</dt><dd className="text-right font-semibold">{b.duration ? `${b.duration} jam` : '-'}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">Pendamping</dt><dd className="text-right font-semibold">{b.companionId === 'auto' ? 'Dipilihkan' : companion?.name ?? '-'}</dd></div>
            </dl>
            <div className="my-5 border-t border-dashed border-forest-100" />
            <div className="flex items-end justify-between">
              <span className="text-sm text-muted">Estimasi biaya</span>
              <span className="text-2xl font-extrabold text-forest-700">{rupiah(price.total)}</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Harga simulasi{PRICING.mode === 'flat' ? '' : ' berdasarkan durasi'}. Harga final mengikuti durasi serta ketentuan layanan.
            </p>
            <Button type="submit" size="lg" className="mt-6 w-full">
              Lanjut ke Ringkasan <Icon name="arrowRight" className="h-5 w-5" />
            </Button>
            {submitted && Object.keys(errors).length > 0 && (
              <p className="mt-3 text-center text-sm font-medium text-red-600">Masih ada {Object.keys(errors).length} kolom yang perlu dilengkapi.</p>
            )}
          </aside>
        </form>
      </Container>
    </>
  );
}
