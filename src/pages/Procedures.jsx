import { useState } from 'react';
import { Button, Container, Icon, IconBadge, PageHeader } from '../components/ui.jsx';
import { NOT_INCLUDED } from '../data.js';

// status: 'berlaku' = sudah diterapkan di prototype, 'rancangan' = prosedur masih rancangan
const SECTIONS = [
  {
    id: 'seleksi',
    icon: 'shield',
    title: 'Tahapan seleksi pendamping',
    status: 'rancangan',
    intro: 'Setiap calon pendamping melewati tahapan berikut sebelum boleh menerima pesanan.',
    steps: [
      'Pendaftaran dan pengisian data diri.',
      'Verifikasi identitas (KTP) dan pemeriksaan latar belakang.',
      'Wawancara untuk menilai sikap, komunikasi, dan kesabaran.',
      'Pelatihan pendampingan lansia sesuai SOP TetanggaCare, termasuk batas tugas nonmedis dan cara mengenali kondisi darurat.',
      'Masa percobaan dengan pemantauan, lalu penilaian rutin dari ulasan keluarga.',
    ],
  },
  {
    id: 'batas',
    icon: 'ban',
    title: 'Batas tugas nonmedis',
    status: 'berlaku',
    intro: 'Pendamping membantu kegiatan sehari-hari dan berobat, bukan tenaga kesehatan.',
    allowed: [
      'Menemani, mengajak berbincang, dan membantu aktivitas ringan',
      'Membantu berjalan atau berpindah dengan aman',
      'Mengurus pendaftaran, antrean, dan administrasi berobat',
      'Mencatat informasi dari dokter untuk disampaikan ke keluarga',
    ],
    notAllowed: NOT_INCLUDED,
  },
  {
    id: 'keluhan',
    icon: 'chat',
    title: 'Penanganan keluhan',
    status: 'rancangan',
    intro: 'Keluarga bisa menyampaikan keluhan kapan saja, selama maupun setelah layanan.',
    steps: [
      'Keluarga menyampaikan keluhan melalui kontak admin TetanggaCare dengan menyebutkan nomor pesanan.',
      'Admin mencatat keluhan dan menghubungi keluarga untuk konfirmasi.',
      'Admin meminta keterangan dari pendamping dan memeriksa laporan layanan.',
      'Keluarga menerima hasil penanganan, misalnya penggantian pendamping atau tindak lanjut lain.',
      'Target waktu respons dan bentuk kompensasi akan ditetapkan setelah uji coba.',
    ],
  },
  {
    id: 'darurat',
    icon: 'bell',
    title: 'Alur saat kondisi darurat',
    status: 'rancangan',
    intro: 'Jika lansia tiba-tiba sakit, jatuh, atau terjadi keadaan berbahaya selama layanan:',
    steps: [
      'Pendamping menghentikan kegiatan dan memastikan lansia berada di tempat yang aman.',
      'Pendamping segera menghubungi layanan darurat: 112 (panggilan darurat) atau 119 (ambulans), atau membawa ke fasilitas kesehatan terdekat bila aman.',
      'Pendamping menghubungi keluarga penanggung jawab.',
      'Pendamping melapor ke admin TetanggaCare.',
      'Pendamping mencatat kejadian di laporan layanan untuk ditindaklanjuti.',
    ],
    note: 'Pendamping tidak memberikan obat atau tindakan medis, dan hanya mendampingi sampai bantuan tenaga kesehatan datang.',
  },
];

function StatusBadge({ status }) {
  return status === 'berlaku' ? (
    <span className="rounded-full bg-forest-50 px-2.5 py-0.5 text-xs font-bold text-forest-700">Berlaku</span>
  ) : (
    <span className="rounded-full bg-sun-50 px-2.5 py-0.5 text-xs font-bold text-[#B86B00]">Rancangan</span>
  );
}

export default function Procedures({ go }) {
  const [open, setOpen] = useState('seleksi');

  return (
    <>
      <PageHeader
        eyebrow="Prosedur"
        title="Prosedur layanan TetanggaCare"
        desc="Ringkasan cara kami memilih pendamping, batas tugasnya, serta penanganan keluhan dan kondisi darurat."
      >
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="inline-flex items-center gap-2"><StatusBadge status="berlaku" /> sudah diterapkan</span>
          <span className="inline-flex items-center gap-2"><StatusBadge status="rancangan" /> masih rancangan, dapat berubah</span>
        </div>
      </PageHeader>

      <Container className="grid max-w-4xl gap-4 py-8 sm:py-12">
        {SECTIONS.map((s) => {
          const isOpen = open === s.id;
          return (
            <section key={s.id} className="overflow-hidden rounded-3xl border border-forest-100 bg-white">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? '' : s.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-4 p-5 text-left sm:p-6"
              >
                <IconBadge name={s.icon} tone={s.status === 'berlaku' ? 'forest' : 'sun'} />
                <span className="min-w-0 flex-1">
                  <span className="block font-extrabold text-ink sm:text-lg">{s.title}</span>
                  <span className="mt-1 block"><StatusBadge status={s.status} /></span>
                </span>
                <Icon name="arrowRight" className={`h-5 w-5 shrink-0 text-forest-700 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
              </button>

              {isOpen && (
                <div className="animate-fade-up border-t border-forest-100 p-5 sm:p-6">
                  <p className="text-muted">{s.intro}</p>
                  {s.steps && (
                    <ol className="mt-4 grid gap-3">
                      {s.steps.map((t, i) => (
                        <li key={t} className="flex items-start gap-3 text-[15px] text-ink">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-forest-700 text-xs font-bold text-white">{i + 1}</span>
                          {t}
                        </li>
                      ))}
                    </ol>
                  )}
                  {s.allowed && (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl bg-forest-50 p-4">
                        <p className="font-bold text-ink">Boleh dilakukan</p>
                        <ul className="mt-2 grid gap-2 text-sm text-ink">
                          {s.allowed.map((t) => (
                            <li key={t} className="flex items-start gap-2"><Icon name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" /> {t}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-2xl bg-red-50 p-4">
                        <p className="font-bold text-ink">Tidak boleh dilakukan</p>
                        <ul className="mt-2 grid gap-2 text-sm text-ink">
                          {s.notAllowed.map((t) => (
                            <li key={t} className="flex items-start gap-2"><Icon name="ban" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" /> {t}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  {s.note && <p className="mt-4 rounded-xl bg-sun-50 p-3 text-sm text-ink">{s.note}</p>}
                </div>
              )}
            </section>
          );
        })}

        <div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-3xl bg-forest-700 p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-lg font-extrabold">Siap memesan pendamping?</p>
            <p className="text-white/80">Semua pendamping mengikuti prosedur di atas.</p>
          </div>
          <Button variant="accent" onClick={() => go('/pesan')}>
            Pesan Pendamping <Icon name="arrowRight" className="h-4 w-4" />
          </Button>
        </div>
      </Container>
    </>
  );
}
