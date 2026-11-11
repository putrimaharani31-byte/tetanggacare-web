import { ServiceCard } from '../components/Cards.jsx';
import { Button, Container, Icon, NonMedicalNotice, PageHeader } from '../components/ui.jsx';
import { SERVICES } from '../data.js';

export default function Services({ go, onChooseService }) {
  return (
    <>
      <PageHeader
        eyebrow="Layanan"
        title="Pilih pendampingan yang sesuai"
        desc="Semua layanan dapat dipesan per jadwal dan durasi. Pendamping membantu kegiatan nonmedis dan selalu memberi kabar kepada keluarga."
      />
      <Container className="py-12 md:py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <ServiceCard key={s.id} service={s} onChoose={onChooseService} detailed />
          ))}
        </div>

        <div className="mt-12">
          <NonMedicalNotice />
          <p className="mt-4 text-sm text-muted">
            Jika anggota keluarga membutuhkan perawatan medis atau keperawatan, silakan menghubungi tenaga kesehatan atau fasilitas kesehatan resmi.
          </p>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-3xl border border-forest-100 bg-white p-6 md:flex-row md:items-center md:p-8">
          <div>
            <h3 className="text-xl font-extrabold text-ink">Belum yakin memilih?</h3>
            <p className="mt-1 text-muted">Lihat profil pendamping kami dan kemampuan masing-masing.</p>
          </div>
          <Button onClick={() => go('/pendamping')}>
            Lihat Pendamping <Icon name="arrowRight" className="h-4 w-4" />
          </Button>
        </div>
      </Container>
    </>
  );
}
