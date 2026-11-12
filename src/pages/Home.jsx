import HeroIllustration from '../components/HeroIllustration.jsx';
import { ServiceCard } from '../components/Cards.jsx';
import { Button, Container, Icon, IconBadge, Logo, NonMedicalNotice, SectionHeading } from '../components/ui.jsx';
import { BRAND, SERVICES } from '../data.js';

const REASONS = [
  { icon: 'shield', title: 'Pendamping melalui proses seleksi', desc: 'Setiap pendamping diverifikasi identitasnya, diwawancarai, dan dilatih sesuai SOP sebelum bertugas.' },
  { icon: 'calendar', title: 'Pemesanan praktis', desc: 'Pilih tanggal, jam, dan durasi sesuai jadwal kontrol atau aktivitas. Tidak perlu memesan seharian.' },
  { icon: 'heart', title: 'Layanan sesuai kebutuhan', desc: 'Ceritakan kebutuhan khusus anggota keluarga, kami cocokkan dengan pendamping yang sesuai.' },
  { icon: 'wallet', title: 'Informasi layanan transparan', desc: 'Cakupan layanan dan rincian harga ditampilkan jelas sebelum Anda mengonfirmasi pesanan.' },
];

const STEPS = [
  { title: 'Pilih layanan', desc: 'Teman & pendamping, pendampingan berobat, atau pendampingan di rumah.' },
  { title: 'Isi kebutuhan pendampingan', desc: 'Data pengguna, alamat, tanggal, waktu, durasi, dan catatan khusus.' },
  { title: 'Pilih pendamping', desc: 'Lihat profil, pengalaman, dan rating, atau biarkan kami memilihkan.' },
  { title: 'Konfirmasi pemesanan', desc: 'Periksa ringkasan dan harga, lalu konfirmasi. Selesai!' },
];

export default function Home({ go, onChooseService }) {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-forest-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-sun/15 blur-3xl" />
        <Container className="relative grid items-center gap-10 py-12 md:py-20 lg:grid-cols-[1.05fr_1fr]">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-forest-100 bg-white px-4 py-1.5 text-sm font-semibold text-forest-700">
              <span className="h-2 w-2 rounded-full bg-leaf" /> Pendampingan nonmedis • Uji coba di {BRAND.city}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              Pendamping Terpercaya untuk <span className="text-forest-700">Orang Tersayang.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Temukan pendamping yang siap menemani keluarga Anda dalam aktivitas sehari-hari maupun kunjungan berobat.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => go('/pesan')}>
                Pesan Pendamping <Icon name="arrowRight" className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => go('/layanan')}>Lihat Layanan</Button>
            </div>
            <ul className="mt-8 grid gap-3 text-sm font-semibold text-ink sm:grid-cols-3">
              {['Identitas terverifikasi', 'Pemesanan per jadwal', 'Laporan untuk keluarga'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-forest-100 text-forest-700">
                    <Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="animate-fade-up [animation-delay:.15s]">
            <HeroIllustration />
          </div>
        </Container>
      </section>

      {/* LAYANAN */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Layanan kami" title="Tiga layanan utama untuk keluarga" desc="Pilih pendampingan yang paling sesuai dengan kebutuhan anggota keluarga Anda." />
            <Button variant="ghost" onClick={() => go('/layanan')}>
              Detail layanan <Icon name="arrowRight" className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {SERVICES.map((s) => (
              <ServiceCard key={s.id} service={s} onChoose={onChooseService} />
            ))}
          </div>
        </Container>
      </section>

      {/* MENGAPA */}
      <section className="bg-white py-16 md:py-20">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Mengapa TetanggaCare"
              title="Mengapa Memilih TetanggaCare?"
              desc="Kami memahami rasa khawatir saat tidak bisa menemani orang tua atau anggota keluarga. Karena itu, kepercayaan kami bangun dari awal."
            />
            <div className="mt-8 hidden lg:block">
              <Logo variant="emblem" className="h-44 opacity-90" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {REASONS.map((r, i) => (
              <div key={r.title} className="card-lift rounded-3xl border border-forest-100 bg-beige/60 p-6">
                <IconBadge name={r.icon} tone={i % 2 ? 'sun' : 'forest'} />
                <h3 className="mt-4 text-lg font-extrabold text-ink">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{r.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CARA KERJA */}
      <section id="cara-kerja" className="scroll-mt-20 py-16 md:py-20">
        <Container>
          <SectionHeading center eyebrow="Cara kerja" title="Cara Kerja TetanggaCare" desc="Empat langkah sederhana, dari memilih layanan sampai pendamping siap menemani." />
          <ol className="relative mt-12 grid gap-6 md:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-7 hidden h-0.5 bg-gradient-to-r from-forest-200 via-sun/60 to-forest-200 md:block" aria-hidden="true" />
            {STEPS.map((s, i) => (
              <li key={s.title} className="card-lift relative rounded-3xl border border-forest-100 bg-white p-6 text-center">
                <span className="relative mx-auto grid h-14 w-14 place-items-center rounded-full bg-forest-700 text-xl font-extrabold text-white ring-8 ring-beige">
                  {i + 1}
                </span>
                <h3 className="mt-5 font-extrabold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <Button size="lg" onClick={() => go('/pesan')}>
              Mulai Pesan <Icon name="arrowRight" className="h-5 w-5" />
            </Button>
          </div>
        </Container>
      </section>

      <Container>
        <NonMedicalNotice />
      </Container>

      {/* CTA PENUTUP */}
      <section className="pt-16">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] bg-forest-700 px-6 py-12 text-white md:px-14 md:py-16">
            <div className="animate-float pointer-events-none absolute right-12 top-1/2 hidden -translate-y-1/2 rounded-[2rem] bg-white p-6 shadow-2xl shadow-black/20 lg:block">
              <Logo variant="emblem" className="h-44" />
            </div>
            <div className="relative max-w-xl">
              <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">Tenang bekerja, orang tersayang tetap ada yang menemani.</h2>
              <p className="mt-4 text-white/80">Pesan pendamping dalam beberapa menit. Pilih jadwal, pilih pendamping, dan terima kabar dari kami.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="accent" size="lg" onClick={() => go('/pesan')}>
                  Pesan Pendamping Sekarang
                </Button>
                <Button variant="light" size="lg" onClick={() => go('/pendamping')}>Lihat Pendamping</Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
