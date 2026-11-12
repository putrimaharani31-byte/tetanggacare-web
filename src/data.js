// =====================================================================
//  DATA TETANGGACARE — semua data di file ini adalah DUMMY / SIMULASI.
//  Ubah teks, harga, dan profil di sini tanpa perlu menyentuh komponen.
// =====================================================================

export const BRAND = {
  name: 'TetanggaCare',
  tagline: 'Teman dan Pendamping untuk Keluarga.',
  city: 'Depok',
  // Logo: simpan file logo di folder public/ dengan nama logo.png.
  // Angka crop = posisi gambar di dalam file (x, y, lebar, tinggi) dalam piksel,
  // disesuaikan dengan file logo 1536x1024 yang dipakai sekarang.
  logo: {
    src: '/logo.png',
    imageWidth: 1536,
    imageHeight: 1024,
    full: [141, 152, 1255, 719],   // logo lengkap (ikon + tulisan)
    emblem: [437, 152, 652, 516],  // hanya ikon rumah
  },
};

// Harga SIMULASI untuk prototype. Ubah di sini.
//  mode 'flat'   -> satu tarif dasar (basePrice)
//  mode 'perJam' -> hourlyRate x durasi
export const PRICING = {
  mode: 'perJam',
  basePrice: 110000,
  hourlyRate: 40000,
  serviceFee: 0,
};

export const SERVICES = [
  {
    id: 'teman',
    icon: 'chat',
    title: 'Teman & Pendamping',
    short: 'Menemani aktivitas sehari-hari, berbincang, dan membantu aktivitas ringan.',
    description:
      'Pendamping hadir sebagai teman yang menemani anggota keluarga Anda beraktivitas, berbincang, dan tetap aktif bersosialisasi.',
    includes: [
      'Menemani berbincang dan beraktivitas bersama',
      'Menemani jalan pagi, berbelanja, atau kegiatan di lingkungan',
      'Membantu aktivitas ringan, seperti membawakan barang',
      'Mengirim kabar kegiatan kepada keluarga',
    ],
    suitable: 'Lansia yang ingin tetap aktif dan punya teman beraktivitas.',
    color: 'sun',
  },
  {
    id: 'berobat',
    icon: 'hospital',
    title: 'Pendampingan Berobat',
    short: 'Menemani ke rumah sakit atau fasilitas kesehatan, termasuk pendaftaran dan antrean.',
    description:
      'Pendamping menemani dari rumah hingga selesai berobat, membantu urusan administrasi, sehingga keluarga tetap tenang walau tidak bisa hadir.',
    includes: [
      'Menemani perjalanan pergi dan pulang',
      'Membantu pendaftaran, termasuk alur JKN/BPJS dan asuransi',
      'Menemani selama antrean dan perpindahan ruangan',
      'Mencatat informasi kunjungan untuk disampaikan ke keluarga',
    ],
    suitable: 'Lansia atau penyandang disabilitas dengan jadwal kontrol rutin.',
    color: 'forest',
  },
  {
    id: 'rumah',
    icon: 'home',
    title: 'Pendampingan di Rumah',
    short: 'Menemani dan membantu aktivitas ringan di rumah sesuai ruang lingkup layanan.',
    description:
      'Pendamping datang ke rumah untuk menemani dan membantu aktivitas ringan, sehingga anggota keluarga tidak sendirian saat keluarga bekerja.',
    includes: [
      'Menemani di rumah selama durasi yang dipesan',
      'Membantu aktivitas ringan, seperti menyiapkan makanan sederhana',
      'Menemani hobi: membaca, berkebun, atau menonton bersama',
      'Laporan singkat kegiatan untuk keluarga',
    ],
    suitable: 'Keluarga yang bekerja dan tidak ingin orang tersayang sendirian.',
    color: 'leaf',
  },
];

export const NOT_INCLUDED = [
  'Diagnosis atau konsultasi medis',
  'Pemberian, pengaturan, atau penyuntikan obat',
  'Tindakan keperawatan, seperti perawatan luka',
  'Tindakan medis lainnya',
];

export const CATEGORIES = [
  { id: 'lansia', label: 'Lansia' },
  { id: 'disabilitas', label: 'Penyandang disabilitas' },
  { id: 'lainnya', label: 'Lainnya' },
];

export const DURATIONS = [1, 2, 3, 4, 5, 6, 8];

export const TIMES = Array.from({ length: 23 }, (_, i) => {
  const minutes = 7 * 60 + i * 30; // 07.00 - 18.00
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
});

// Profil pendamping FIKTIF. Avatar berupa ilustrasi, bukan foto orang sungguhan.
export const COMPANIONS = [
  {
    id: 'sari',
    name: 'Sari Wulandari',
    age: 29,
    location: 'Beji, Depok',
    experienceYears: 4,
    experience: '4 tahun mendampingi lansia kontrol rutin di RS dan puskesmas.',
    skills: ['Alur pendaftaran JKN/BPJS', 'Komunikasi ramah lansia', 'Pendampingan kursi roda'],
    services: ['berobat', 'teman'],
    languages: ['Indonesia', 'Sunda'],
    availability: 'Senin - Sabtu, 07.00 - 17.00',
    rating: 4.9,
    reviews: 128,
    bio: 'Sabar dan teliti. Terbiasa membantu urusan administrasi rumah sakit dan selalu mengabari keluarga di setiap tahap kunjungan.',
    look: { skin: '#E8B48F', style: 'hijab', hair: '#2F6F5A', shirt: '#FDA126', bg: '#FFF5E6' },
  },
  {
    id: 'bima',
    name: 'Bima Prasetya',
    age: 34,
    location: 'Pancoran Mas, Depok',
    experienceYears: 6,
    experience: '6 tahun sebagai pendamping penyandang disabilitas dan lansia.',
    skills: ['Membantu berpindah dari kursi roda', 'Pendampingan disabilitas', 'Bahasa isyarat dasar'],
    services: ['berobat', 'teman', 'rumah'],
    languages: ['Indonesia', 'Jawa'],
    availability: 'Setiap hari, 08.00 - 18.00',
    rating: 4.8,
    reviews: 96,
    bio: 'Tenang dan sigap. Berpengalaman mendampingi pengguna kursi roda dalam perjalanan dan aktivitas di luar rumah.',
    look: { skin: '#C98E6A', style: 'short', hair: '#2B2321', shirt: '#078354', bg: '#EEF7F2' },
  },
  {
    id: 'maya',
    name: 'Maya Lestari',
    age: 26,
    location: 'Sukmajaya, Depok',
    experienceYears: 2,
    experience: '2 tahun menjadi relawan pendamping lansia di komunitas.',
    skills: ['Teman berbincang', 'Aktivitas kreatif dan hobi', 'Menemani berbelanja'],
    services: ['teman', 'rumah'],
    languages: ['Indonesia', 'Inggris'],
    availability: 'Senin - Jumat, 09.00 - 18.00',
    rating: 4.9,
    reviews: 54,
    bio: 'Ceria dan hangat. Senang mengajak lansia tetap aktif lewat obrolan, jalan pagi, dan kegiatan sederhana di rumah.',
    look: { skin: '#F0C3A0', style: 'long', hair: '#3A2622', shirt: '#6DB04B', bg: '#F1F8EC' },
  },
  {
    id: 'andra',
    name: 'Andra Saputra',
    age: 31,
    location: 'Cimanggis, Depok',
    experienceYears: 3,
    experience: '3 tahun mendampingi kunjungan berobat dan cek laboratorium.',
    skills: ['Pengaturan jadwal kunjungan', 'Pencatatan informasi untuk keluarga', 'Navigasi rumah sakit'],
    services: ['berobat'],
    languages: ['Indonesia'],
    availability: 'Senin - Sabtu, 06.00 - 15.00',
    rating: 4.7,
    reviews: 71,
    bio: 'Tepat waktu dan rapi. Membantu keluarga memantau kunjungan berobat lewat catatan dan kabar yang jelas.',
    look: { skin: '#D9A07A', style: 'short', hair: '#1F1A18', shirt: '#066649', bg: '#EEF7F2' },
  },
  {
    id: 'dewi',
    name: 'Dewi Anggraini',
    age: 38,
    location: 'Cinere, Depok',
    experienceYears: 8,
    experience: '8 tahun menemani lansia di rumah dan kegiatan keluarga.',
    skills: ['Pendampingan di rumah', 'Menyiapkan makanan sederhana', 'Kegiatan rutin harian'],
    services: ['rumah', 'teman'],
    languages: ['Indonesia', 'Jawa'],
    availability: 'Senin - Sabtu, 07.00 - 16.00',
    rating: 5.0,
    reviews: 143,
    bio: 'Keibuan dan telaten. Membuat suasana rumah tetap nyaman dan menyenangkan selama keluarga bekerja.',
    look: { skin: '#E3AD87', style: 'bun', hair: '#2E2420', shirt: '#F28C6B', bg: '#FFF1EA' },
  },
  {
    id: 'rizky',
    name: 'Rizky Hidayat',
    age: 27,
    location: 'Tapos, Depok',
    experienceYears: 2,
    experience: '2 tahun mendampingi lansia berobat dan beraktivitas di luar rumah.',
    skills: ['Pendampingan berobat', 'Menemani olahraga ringan', 'Teman berbincang'],
    services: ['berobat', 'teman'],
    languages: ['Indonesia', 'Betawi'],
    availability: 'Setiap hari, 07.00 - 19.00',
    rating: 4.8,
    reviews: 39,
    bio: 'Ramah dan sabar. Senang mendengarkan cerita dan memastikan setiap kegiatan berjalan nyaman.',
    look: { skin: '#C78B66', style: 'short', hair: '#231C1A', shirt: '#FDA126', bg: '#FFF5E6' },
  },
];

export const EMPTY_BOOKING = {
  serviceId: '',
  name: '',
  category: '',
  categoryOther: '',
  address: '',
  date: '',
  time: '',
  duration: '',
  notes: '',
  companionId: '',
};
