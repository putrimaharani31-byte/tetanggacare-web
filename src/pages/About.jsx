import { Button, Container, Icon, IconBadge, Logo, PageHeader } from '../components/ui.jsx';
import { BRAND } from '../data.js';

const VALUES = [
  { icon: 'shield', title: 'Terpercaya', desc: 'Pendamping diverifikasi identitasnya, diseleksi, dan dilatih sesuai SOP.' },
  { icon: 'heart', title: 'Hangat', desc: 'Kami hadir seperti tetangga yang peduli: sabar, ramah, dan menghargai setiap orang.' },
  { icon: 'wallet', title: 'Transparan', desc: 'Cakupan layanan dan harga dijelaskan di awal, tanpa biaya tersembunyi.' },
  { icon: 'bell', title: 'Keluarga selalu tahu', desc: 'Keluarga mendapat kabar dan laporan kegiatan setelah layanan.' },
];

export default function About({ go }) {
  return (
    <>
      <PageHeader eyebrow="Tentang kami" title="Kepedulian yang dekat, seperti tetangga sendiri" />
      <Container className="py-12 md:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            <p>
              <span className="font-bold text-ink">{BRAND.name}</span> hadir untuk membantu keluarga memperoleh pendampingan yang lebih mudah, praktis, dan terpercaya bagi anggota keluarga yang membutuhkan, terutama lansia dan penyandang disabilitas.
            </p>
            <p>
              Banyak keluarga ingin selalu menemani orang tuanya kontrol ke rumah sakit atau beraktivitas, tetapi jadwalnya sering bertepatan dengan jam kerja atau kuliah. Mencari pendamping yang bisa dipercaya dalam waktu singkat juga tidak mudah.
            </p>
            <p>
              Melalui pemesanan per jadwal, pendamping terverifikasi, dan laporan untuk keluarga, kami ingin setiap orang tetap ditemani walau keluarga berhalangan hadir. Seluruh layanan kami adalah pendampingan <span className="font-bold text-ink">nonmedis</span>.
            </p>
          </div>
          <div className="card-lift grid place-items-center rounded-[2rem] border border-forest-100 bg-white p-10">
            <Logo variant="full" className="h-48 sm:h-56" />
            <p className="mt-2 font-semibold text-forest-700">{BRAND.tagline}</p>
          </div>
        </div>

        <h2 className="mt-16 text-2xl font-extrabold text-ink">Nilai yang kami pegang</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <div key={v.title} className="card-lift rounded-3xl border border-forest-100 bg-white p-6">
              <IconBadge name={v.icon} tone={['forest', 'sun', 'leaf', 'forest'][i]} />
              <h3 className="mt-4 font-extrabold text-ink">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-5 rounded-3xl bg-forest-700 p-8 text-white md:grid-cols-3 md:p-10">
          {[
            ['pin', 'Wilayah uji coba', `${BRAND.city} dan sekitarnya`],
            ['clock', 'Sistem layanan', 'Per jadwal & durasi'],
            ['users', 'Untuk siapa', 'Lansia, penyandang disabilitas, dan keluarga'],
          ].map(([icon, k, v]) => (
            <div key={k} className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15">
                <Icon name={icon} />
              </span>
              <div>
                <p className="text-sm text-white/70">{k}</p>
                <p className="font-bold">{v}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" onClick={() => go('/pesan')}>
            Pesan Pendamping <Icon name="arrowRight" className="h-5 w-5" />
          </Button>
        </div>
      </Container>
    </>
  );
}
