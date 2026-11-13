import { useState } from 'react';
import { Avatar, Button, Container, Field, Icon, IconBadge, PageHeader, StarRating, inputClass } from '../components/ui.jsx';
import { ASSIST_NEEDS, COMPANIONS, DISTRICTS, DURATIONS, RELATIONS, SERVICES, TIMES } from '../data.js';
import { calcPrice, dateFromToday, distanceText, endTime, fmtTime, getCompanion, getService, resolveCompanion, rupiah, sortByDistance, transportFee, validateBooking } from '../utils.js';

const FIELD_ORDER = ['serviceId', 'elderName', 'elderAge', 'district', 'address', 'familyName', 'familyPhone', 'familyRelation', 'date', 'time', 'duration', 'companionId'];

function Section({ n, title, done, children }) {
  return (
    <section className="rounded-3xl border border-forest-100 bg-white p-5 sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-extrabold ${done ? 'bg-forest-700 text-white' : 'bg-forest-50 text-forest-700'}`}>
          {done ? <Icon name="check" className="h-4 w-4" strokeWidth={3} /> : n}
        </span>
        <h2 className="text-lg font-extrabold text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Pill({ active, children, ...props }) {
  return (
    <button
      type="button"
      className={`rounded-full border-2 px-4 py-2.5 text-sm font-semibold transition ${active ? 'border-forest-500 bg-forest-50 text-forest-700' : 'border-forest-100 text-muted hover:border-forest-300'}`}
      {...props}
    >
      {children}
    </button>
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
    set(c && !c.services.includes(id) ? { serviceId: id, companionId: '' } : { serviceId: id });
  };

  const toggleNeed = (id) => set({ needs: b.needs.includes(id) ? b.needs.filter((x) => x !== id) : [...b.needs, id] });

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

  const companions = sortByDistance(COMPANIONS.filter((c) => !b.serviceId || c.services.includes(b.serviceId)), b.district);
  const done = {
    service: !!b.serviceId,
    elder: !!b.elderName.trim() && !!b.elderAge,
    location: !!b.district && b.address.trim().length >= 10,
    family: !!b.familyName.trim() && !!b.familyPhone.trim() && !!b.familyRelation,
    schedule: !!b.date && !!b.time && !!b.duration,
    companion: !!b.companionId,
  };
  const progress = Object.values(done).filter(Boolean).length;
  const total = Object.keys(done).length;
  const price = calcPrice(b);
  const service = getService(b.serviceId);
  const chosen = b.companionId ? resolveCompanion(b) : null;

  return (
    <>
      <PageHeader eyebrow="Pemesanan" title="Pesan pendamping lansia" desc="Lengkapi data di bawah ini. Kolom bertanda * wajib diisi.">
        <div className="mt-6 max-w-md">
          <div className="flex justify-between text-sm font-semibold text-muted">
            <span>Kelengkapan formulir</span>
            <span className="text-forest-700">{progress}/{total} bagian</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-forest-100">
            <div className="h-full rounded-full bg-forest-500 transition-all duration-500" style={{ width: `${(progress / total) * 100}%` }} />
          </div>
        </div>
      </PageHeader>

      <Container className="py-8 sm:py-10">
        <form noValidate onSubmit={handleSubmit} className="grid items-start gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
          <div className="grid min-w-0 gap-5 sm:gap-6">
            {/* 1. Layanan */}
            <Section n={1} title="Jenis layanan" done={done.service}>
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
                        className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition sm:flex-col sm:items-start ${active ? 'border-forest-500 bg-forest-50' : 'border-forest-100 bg-white hover:border-forest-300'}`}
                      >
                        <IconBadge name={s.icon} tone={s.color} className="h-11 w-11" />
                        <span className="min-w-0">
                          <span className="block font-bold text-ink">{s.title}</span>
                          <span className="mt-1 block text-xs leading-relaxed text-muted">{s.short}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Field>
            </Section>

            {/* 2. Data lansia */}
            <Section n={2} title="Data lansia yang didampingi" done={done.elder}>
              <div className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
                  <Field id="elderName" label="Nama lansia" required error={errors.elderName}>
                    <input id="elderName" className={inputClass(errors.elderName)} placeholder="Contoh: Ibu Siti Rahayu" value={b.elderName} onChange={(e) => set({ elderName: e.target.value })} />
                  </Field>
                  <Field id="elderAge" label="Usia" required error={errors.elderAge}>
                    <input id="elderAge" type="number" inputMode="numeric" min="1" max="120" className={inputClass(errors.elderAge)} placeholder="72" value={b.elderAge} onChange={(e) => set({ elderAge: e.target.value })} />
                  </Field>
                </div>
                <Field id="needs" label="Kebutuhan bantuan" hint="Boleh pilih lebih dari satu. Tim kami memastikan pendamping sesuai dengan kebutuhan ini.">
                  <div className="flex flex-wrap gap-2">
                    {ASSIST_NEEDS.map((n) => (
                      <Pill key={n.id} active={b.needs.includes(n.id)} aria-pressed={b.needs.includes(n.id)} onClick={() => toggleNeed(n.id)}>
                        {b.needs.includes(n.id) && <Icon name="check" className="-ml-1 mr-1 inline h-4 w-4" strokeWidth={3} />}
                        {n.label}
                      </Pill>
                    ))}
                  </div>
                </Field>
              </div>
            </Section>

            {/* 3. Lokasi */}
            <Section n={3} title="Lokasi layanan" done={done.location}>
              <div className="grid gap-5">
                <Field id="district" label="Kecamatan (Depok)" required error={errors.district} hint="Dipakai untuk mencari pendamping terdekat dan menghitung ongkos kedatangan.">
                  <select id="district" className={inputClass(errors.district)} value={b.district} onChange={(e) => set({ district: e.target.value })}>
                    <option value="">Pilih kecamatan</option>
                    {DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </Field>
                <Field id="address" label="Alamat lengkap" required error={errors.address} hint="Untuk pendampingan berobat, tulis alamat penjemputan.">
                  <textarea id="address" rows={3} className={inputClass(errors.address)} placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan" value={b.address} onChange={(e) => set({ address: e.target.value })} />
                </Field>
              </div>
            </Section>

            {/* 4. Kontak keluarga */}
            <Section n={4} title="Keluarga penanggung jawab" done={done.family}>
              <p className="-mt-2 mb-5 text-sm text-muted">Orang yang dihubungi pendamping selama layanan berlangsung.</p>
              <div className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="familyName" label="Nama" required error={errors.familyName}>
                    <input id="familyName" autoComplete="name" className={inputClass(errors.familyName)} placeholder="Contoh: Rina" value={b.familyName} onChange={(e) => set({ familyName: e.target.value })} />
                  </Field>
                  <Field id="familyPhone" label="Nomor HP / WhatsApp" required error={errors.familyPhone}>
                    <input id="familyPhone" type="tel" inputMode="tel" autoComplete="tel" className={inputClass(errors.familyPhone)} placeholder="081234567890" value={b.familyPhone} onChange={(e) => set({ familyPhone: e.target.value })} />
                  </Field>
                </div>
                <Field id="familyRelation" label="Hubungan dengan lansia" required error={errors.familyRelation}>
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Hubungan dengan lansia">
                    {RELATIONS.map((r) => (
                      <Pill key={r} role="radio" aria-checked={b.familyRelation === r} active={b.familyRelation === r} onClick={() => set({ familyRelation: r })}>{r}</Pill>
                    ))}
                  </div>
                </Field>
              </div>
            </Section>

            {/* 5. Jadwal */}
            <Section n={5} title="Jadwal layanan" done={done.schedule}>
              <div className="grid gap-5 sm:grid-cols-3">
                <Field id="date" label="Tanggal" required error={errors.date}>
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
                <Field id="duration" label="Durasi" required error={errors.duration}>
                  <select id="duration" className={inputClass(errors.duration)} value={b.duration} onChange={(e) => set({ duration: e.target.value })}>
                    <option value="">Pilih durasi</option>
                    {DURATIONS.map((d) => (
                      <option key={d} value={d}>{d} jam</option>
                    ))}
                  </select>
                </Field>
              </div>
              {b.time && b.duration && (
                <p className="mt-4 flex items-start gap-2 rounded-xl bg-forest-50 px-4 py-3 text-sm text-forest-800">
                  <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0" /> Layanan berlangsung pukul {fmtTime(b.time)} sampai {endTime(b.time, b.duration)}.
                </p>
              )}
              <div className="mt-5">
                <Field id="notes" label="Catatan untuk pendamping" hint="Opsional. Contoh: perlu dibantu naik mobil, suka diajak ngobrol tentang tanaman.">
                  <textarea id="notes" rows={3} className={inputClass(false)} placeholder="Hal yang perlu diketahui pendamping" value={b.notes} onChange={(e) => set({ notes: e.target.value })} />
                </Field>
              </div>
            </Section>

            {/* 6. Pendamping */}
            <Section n={6} title="Pilihan pendamping" done={done.companion}>
              {!b.district && <p className="-mt-2 mb-4 text-sm text-muted">Pilih kecamatan dulu agar pendamping terdekat muncul paling atas.</p>}
              <Field id="companionId" error={errors.companionId}>
                <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Pilihan pendamping">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={b.companionId === 'auto'}
                    onClick={() => set({ companionId: 'auto' })}
                    className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${b.companionId === 'auto' ? 'border-forest-500 bg-forest-50' : 'border-forest-100 hover:border-forest-300'}`}
                  >
                    <IconBadge name="sparkles" tone="sun" className="h-14 w-14" />
                    <span className="min-w-0">
                      <span className="block font-bold text-ink">Pilihkan yang terdekat</span>
                      <span className="text-xs text-muted">TetanggaCare memilih pendamping terdekat yang sesuai layanan.</span>
                    </span>
                  </button>
                  {companions.map((c) => {
                    const active = b.companionId === c.id;
                    const t = transportFee(c.distance);
                    return (
                      <div
                        key={c.id}
                        role="radio"
                        tabIndex={0}
                        aria-checked={active}
                        onClick={() => set({ companionId: c.id })}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), set({ companionId: c.id }))}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition ${active ? 'border-forest-500 bg-forest-50' : 'border-forest-100 hover:border-forest-300'}`}
                      >
                        <Avatar look={c.look} className="h-14 w-14" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-bold text-ink">{c.name}</span>
                          <StarRating rating={c.rating} />
                          <span className="block truncate text-xs text-muted">
                            {c.location}
                            {c.distance != null && ` • ${distanceText(c.distance)}`}
                          </span>
                          {c.distance != null && (
                            <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${t.fee ? 'bg-sun-50 text-[#B86B00]' : 'bg-forest-50 text-forest-700'}`}>
                              {t.fee ? `Ongkos ${rupiah(t.fee)}` : 'Tanpa ongkos'}
                            </span>
                          )}
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
            </Section>
          </div>

          {/* Ringkasan biaya */}
          <aside className="min-w-0 rounded-3xl border border-forest-100 bg-white p-5 sm:p-6 lg:sticky lg:top-28">
            <p className="text-sm font-bold uppercase tracking-wider text-forest-500">Pesanan Anda</p>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-muted">Layanan</dt><dd className="text-right font-semibold">{service?.title ?? '-'}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">Jadwal</dt><dd className="text-right font-semibold">{b.date ? b.date.split('-').reverse().join('/') : '-'}{b.time ? `, ${fmtTime(b.time)}` : ''}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">Pendamping</dt><dd className="text-right font-semibold">{chosen ? `${chosen.name}${b.companionId === 'auto' ? ' (dipilihkan)' : ''}` : '-'}</dd></div>
            </dl>
            <div className="my-4 border-t border-dashed border-forest-100" />
            <ul className="grid gap-2 text-sm">
              {price.lines.map((l) => (
                <li key={l.label}>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted">{l.label}</span>
                    <span className="shrink-0 font-semibold">{rupiah(l.value)}</span>
                  </div>
                  {l.note && <p className="mt-0.5 text-xs text-muted">{l.note}</p>}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-end justify-between border-t border-forest-100 pt-4">
              <span className="text-sm font-bold text-ink">Estimasi total</span>
              <span className="text-2xl font-extrabold text-forest-700">{rupiah(price.total)}</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">Harga simulasi. Biaya perjalanan bersama lansia (misalnya taksi ke rumah sakit atau parkir) dibayar terpisah sesuai penggunaan.</p>
            <Button type="submit" size="lg" className="mt-5 w-full">
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
