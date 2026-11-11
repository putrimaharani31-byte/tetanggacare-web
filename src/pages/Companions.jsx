import { useState } from 'react';
import { CompanionCard } from '../components/Cards.jsx';
import { Chip, Container, Icon, PageHeader } from '../components/ui.jsx';
import { COMPANIONS, SERVICES } from '../data.js';

export default function Companions({ selectedId, onView, onChoose }) {
  const [filter, setFilter] = useState('semua');
  const list = filter === 'semua' ? COMPANIONS : COMPANIONS.filter((c) => c.services.includes(filter));

  return (
    <>
      <PageHeader
        eyebrow="Pendamping"
        title="Kenali pendamping TetanggaCare"
        desc="Setiap pendamping telah melalui verifikasi identitas, wawancara, dan pelatihan. Lihat profilnya, lalu pilih yang paling cocok."
      >
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-1.5 text-sm font-semibold text-muted">
            <Icon name="filter" className="h-4 w-4" /> Filter layanan:
          </span>
          <Chip active={filter === 'semua'} onClick={() => setFilter('semua')}>Semua</Chip>
          {SERVICES.map((s) => (
            <Chip key={s.id} active={filter === s.id} onClick={() => setFilter(s.id)}>{s.title}</Chip>
          ))}
        </div>
      </PageHeader>

      <Container className="py-12">
        <p className="mb-6 text-sm text-muted">
          Menampilkan <span className="font-bold text-ink">{list.length}</span> pendamping di Depok (data simulasi).
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <CompanionCard key={c.id} companion={c} selected={selectedId === c.id} onView={onView} onChoose={onChoose} />
          ))}
        </div>
      </Container>
    </>
  );
}
