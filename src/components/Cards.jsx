import { Avatar, Button, Icon, IconBadge, Modal, StarRating, VerifiedBadge } from './ui.jsx';
import { getService } from '../utils.js';

export function ServiceCard({ service, onChoose, detailed = false }) {
  return (
    <article className="card-lift flex h-full flex-col rounded-3xl border border-forest-100 bg-white p-6 md:p-7">
      <IconBadge name={service.icon} tone={service.color} className="h-14 w-14" />
      <h3 className="mt-5 text-xl font-extrabold text-ink">{service.title}</h3>
      <p className="mt-2 leading-relaxed text-muted">{detailed ? service.description : service.short}</p>

      {detailed && (
        <>
          <p className="mt-6 text-sm font-bold uppercase tracking-wider text-forest-500">Termasuk dalam layanan</p>
          <ul className="mt-3 grid gap-2.5">
            {service.includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[15px] text-ink">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-forest-100 text-forest-700">
                  <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 rounded-xl bg-beige px-4 py-3 text-sm text-muted">
            <span className="font-bold text-ink">Cocok untuk: </span>
            {service.suitable}
          </p>
        </>
      )}

      <div className="mt-auto pt-6">
        <Button onClick={() => onChoose(service.id)} className="w-full">
          Pilih Layanan <Icon name="arrowRight" className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
}

export function CompanionCard({ companion: c, onView, onChoose, selected }) {
  return (
    <article className={`card-lift flex h-full flex-col rounded-3xl border bg-white p-5 md:p-6 ${selected ? 'border-forest-500 ring-4 ring-forest-100' : 'border-forest-100'}`}>
      <div className="flex items-start gap-4">
        <Avatar look={c.look} className="h-20 w-20" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-extrabold text-ink">{c.name}</h3>
            {selected && <span className="rounded-full bg-sun px-2 py-0.5 text-xs font-bold text-forest-900">Dipilih</span>}
          </div>
          <p className="mt-0.5 text-sm text-muted">{c.age} tahun</p>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted">
            <Icon name="pin" className="h-4 w-4 text-forest-500" /> {c.location}
          </p>
          <StarRating rating={c.rating} reviews={c.reviews} className="mt-1.5" />
        </div>
      </div>

      <div className="mt-4">
        <VerifiedBadge />
      </div>
      <p className="mt-4 flex items-start gap-2 text-sm text-ink">
        <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" /> {c.experience}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {c.skills.map((s) => (
          <span key={s} className="rounded-full bg-beige px-3 py-1 text-xs font-semibold text-muted">{s}</span>
        ))}
      </div>
      <p className="mt-4 text-xs font-semibold text-muted">
        Layanan: {c.services.map((id) => getService(id)?.title).join(' • ')}
      </p>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
        <Button variant="outline" size="sm" onClick={() => onView(c.id)}>Lihat Profil</Button>
        <Button size="sm" onClick={() => onChoose(c.id)}>Pilih Pendamping</Button>
      </div>
    </article>
  );
}

export function CompanionProfileModal({ companion: c, onClose, onChoose }) {
  return (
    <Modal open={!!c} onClose={onClose} label="Profil pendamping">
      {c && (
        <div>
          <div className="flex items-center gap-4 pr-8">
            <Avatar look={c.look} className="h-24 w-24" />
            <div>
              <h3 className="text-2xl font-extrabold text-ink">{c.name}</h3>
              <StarRating rating={c.rating} reviews={c.reviews} className="mt-1" />
              <div className="mt-2">
                <VerifiedBadge />
              </div>
            </div>
          </div>

          <p className="mt-5 leading-relaxed text-muted">{c.bio}</p>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            {[
              ['Usia', `${c.age} tahun`],
              ['Lokasi layanan', c.location],
              ['Pengalaman', `${c.experienceYears} tahun`],
              ['Bahasa', c.languages.join(', ')],
              ['Ketersediaan', c.availability],
              ['Layanan', c.services.map((id) => getService(id)?.title).join(', ')],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-beige p-3">
                <dt className="text-xs font-semibold text-muted">{k}</dt>
                <dd className="mt-0.5 font-bold text-ink">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-5 text-sm font-bold text-ink">Keahlian</p>
          <ul className="mt-2 grid gap-2">
            {c.skills.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-ink">
                <Icon name="checkCircle" className="h-4 w-4 text-forest-500" /> {s}
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-xl border border-forest-100 p-3 text-xs text-muted">
            <span className="font-bold text-ink">Proses seleksi: </span>
            verifikasi identitas, wawancara, dan pelatihan pendampingan sesuai SOP TetanggaCare. Rating di prototype ini adalah data simulasi.
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={onClose}>Tutup</Button>
            <Button onClick={() => onChoose(c.id)}>Pilih Pendamping</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
