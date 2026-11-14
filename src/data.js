// =====================================================================
//  DATA TETANGGACARE — semua data di file ini adalah DUMMY / SIMULASI.
//  Ubah teks, harga, lokasi, dan profil di sini tanpa menyentuh komponen.
// =====================================================================

export const BRAND = {
  name: 'TetanggaCare',
  tagline: 'Teman dan Pendamping untuk Keluarga.',
  city: 'Depok',
  // Logo: file public/logo.png. Angka crop = posisi gambar di dalam file (x, y, lebar, tinggi) dalam piksel.
  logo: {
    src: '/logo.png',
    imageWidth: 1536,
    imageHeight: 1024,
    full: [141, 152, 1255, 719],
    emblem: [437, 152, 652, 516],
  },
};

// ---------------- HARGA (simulasi, ubah di sini) ----------------
export const PRICING = {
  mode: 'perJam',     // 'perJam' = tarif x durasi, 'flat' = satu tarif dasar
  basePrice: 110000,  // dipakai jika mode 'flat'
  hourlyRate: 40000,  // tarif pendampingan per jam
  serviceFee: 0,      // biaya layanan platform
};

// Ongkos kedatangan pendamping (simulasi).
// Jarak = garis lurus dari kecamatan pendamping ke kecamatan lansia (perkiraan, bukan rute jalan).
export const TRANSPORT = {
  freeKm: 3,        // jarak sekali jalan yang sudah termasuk tarif
  perKm: 3000,      // tarif per km kelebihan jarak
  roundTrip: true,  // dihitung pulang-pergi (x2)
};

// Rencana untuk tahap berikutnya (belum aktif di formulir)
export const EXTENSION = { minutes: 30, price: 20000 };

// Bagian pendamping dari tarif pendampingan. Ongkos kedatangan 100% untuk pendamping.
export const COMPANION_SHARE = 0.8;

// ---------------- JAM LAYANAN ----------------
export const SERVICE_HOURS = { open: '07:00', close: '20:00', label: '07.00–20.00 setiap hari' };
// Jam admin memproses konfirmasi pesanan
export const ADMIN_HOURS = '07.00–20.00 setiap hari';

// ---------------- AKUN LOGIN ----------------
// Semua akun di Supabase memakai akhiran ini. Username "admin" = admin, username = id pendamping = pendamping.
export const LOGIN_DOMAIN = 'admin.tetanggacare.app';
export const ADMIN_USERNAME = 'admin';

// ---------------- WILAYAH (kecamatan di Depok, koordinat perkiraan) ----------------
export const DISTRICTS = [
  { id: 'beji', name: 'Beji', lat: -6.375, lng: 106.818 },
  { id: 'bojongsari', name: 'Bojongsari', lat: -6.395, lng: 106.745 },
  { id: 'cilodong', name: 'Cilodong', lat: -6.43, lng: 106.84 },
  { id: 'cimanggis', name: 'Cimanggis', lat: -6.37, lng: 106.865 },
  { id: 'cinere', name: 'Cinere', lat: -6.335, lng: 106.785 },
  { id: 'cipayung', name: 'Cipayung', lat: -6.43, lng: 106.8 },
  { id: 'limo', name: 'Limo', lat: -6.365, lng: 106.775 },
  { id: 'pancoranmas', name: 'Pancoran Mas', lat: -6.405, lng: 106.815 },
  { id: 'sawangan', name: 'Sawangan', lat: -6.405, lng: 106.76 },
  { id: 'sukmajaya', name: 'Sukmajaya', lat: -6.395, lng: 106.84 },
  { id: 'tapos', name: 'Tapos', lat: -6.42, lng: 106.88 },
];

// ---------------- LAYANAN (fokus lansia) ----------------
export const SERVICES = [
  {
    id: 'teman',
    icon: 'chat',
    title: 'Teman & Pendamping',
    short: 'Menemani lansia beraktivitas, berbincang, dan membantu aktivitas ringan.',
    description:
      'Pendamping hadir sebagai teman bagi orang tua Anda: menemani berbincang, beraktivitas, dan tetap aktif bersosialisasi.',
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
    short: 'Menemani lansia ke rumah sakit atau klinik, termasuk pendaftaran dan antrean.',
    description:
      'Pendamping menemani orang tua Anda dari rumah hingga selesai berobat dan membantu urusan administrasi, sehingga keluarga tetap tenang walau tidak bisa hadir.',
    includes: [
      'Menemani perjalanan pergi dan pulang',
      'Membantu pendaftaran, termasuk alur JKN/BPJS dan asuransi',
      'Menemani selama antrean dan perpindahan ruangan',
      'Mencatat informasi kunjungan untuk disampaikan ke keluarga',
    ],
    suitable: 'Lansia dengan jadwal kontrol rutin.',
    color: 'forest',
  },
  {
    id: 'rumah',
    icon: 'home',
    title: 'Pendampingan di Rumah',
    short: 'Menemani lansia di rumah dan membantu aktivitas ringan sesuai ruang lingkup layanan.',
    description:
      'Pendamping datang ke rumah untuk menemani dan membantu aktivitas ringan, sehingga orang tua tidak sendirian saat keluarga bekerja.',
    includes: [
      'Menemani di rumah selama durasi yang dipesan',
      'Membantu aktivitas ringan, seperti menyiapkan makanan sederhana',
      'Menemani hobi: membaca, berkebun, atau menonton bersama',
      'Laporan singkat kegiatan untuk keluarga',
    ],
    suitable: 'Keluarga yang bekerja dan tidak ingin orang tua sendirian.',
    color: 'leaf',
  },
];

export const NOT_INCLUDED = [
  'Diagnosis atau konsultasi medis',
  'Pemberian, pengaturan, atau penyuntikan obat',
  'Tindakan keperawatan, seperti perawatan luka',
  'Tindakan medis lainnya',
];

// Kebutuhan bantuan lansia (boleh pilih lebih dari satu)
export const ASSIST_NEEDS = [
  { id: 'jalan', label: 'Perlu bantuan berjalan' },
  { id: 'kursiroda', label: 'Menggunakan kursi roda' },
  { id: 'tongkat', label: 'Menggunakan tongkat atau walker' },
  { id: 'dengar', label: 'Pendengaran kurang' },
  { id: 'lihat', label: 'Penglihatan kurang' },
  { id: 'komunikasi', label: 'Perlu komunikasi pelan dan sabar' },
  { id: 'lupa', label: 'Mudah lupa, perlu diingatkan jadwal' },
];

export const RELATIONS = ['Anak', 'Cucu', 'Menantu', 'Saudara', 'Lainnya'];

export const DURATIONS = [1, 2, 3, 4, 5, 6, 7, 8];

// Pilihan jam mulai: tiap 30 menit, dari jam buka sampai 1 jam sebelum tutup
const toMin = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
export const TIMES = Array.from({ length: (toMin(SERVICE_HOURS.close) - 60 - toMin(SERVICE_HOURS.open)) / 30 + 1 }, (_, i) => {
  const minutes = toMin(SERVICE_HOURS.open) + i * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
});

// Profil pendamping FIKTIF. Avatar berupa ilustrasi, bukan foto orang sungguhan.
export const COMPANIONS = [
  {
    id: 'sari',
    name: 'Sari Wulandari',
    age: 29,
    district: 'beji',
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
    district: 'pancoranmas',
    location: 'Pancoran Mas, Depok',
    experienceYears: 6,
    experience: '6 tahun mendampingi lansia pengguna kursi roda dan alat bantu jalan.',
    skills: ['Membantu berpindah dari kursi roda', 'Pendampingan lansia dengan alat bantu', 'Bahasa isyarat dasar'],
    services: ['berobat', 'teman', 'rumah'],
    languages: ['Indonesia', 'Jawa'],
    availability: 'Setiap hari, 08.00 - 18.00',
    rating: 4.8,
    reviews: 96,
    bio: 'Tenang dan sigap. Berpengalaman mendampingi lansia pengguna kursi roda dalam perjalanan dan aktivitas di luar rumah.',
    look: { skin: '#C98E6A', style: 'short', hair: '#2B2321', shirt: '#078354', bg: '#EEF7F2' },
  },
  {
    id: 'maya',
    name: 'Maya Lestari',
    age: 26,
    district: 'sukmajaya',
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
    district: 'cimanggis',
    location: 'Cimanggis, Depok',
    experienceYears: 3,
    experience: '3 tahun mendampingi lansia berobat dan cek laboratorium.',
    skills: ['Pengaturan jadwal kunjungan', 'Pencatatan informasi untuk keluarga', 'Navigasi rumah sakit'],
    services: ['berobat'],
    languages: ['Indonesia'],
    availability: 'Senin - Sabtu, 06.00 - 15.00',
    rating: 4.7,
    reviews: 71,
    bio: 'Tepat waktu dan rapi. Membantu keluarga memantau kunjungan berobat orang tua lewat catatan dan kabar yang jelas.',
    look: { skin: '#D9A07A', style: 'short', hair: '#1F1A18', shirt: '#066649', bg: '#EEF7F2' },
  },
  {
    id: 'dewi',
    name: 'Dewi Anggraini',
    age: 38,
    district: 'cinere',
    location: 'Cinere, Depok',
    experienceYears: 8,
    experience: '8 tahun menemani lansia di rumah dan kegiatan keluarga.',
    skills: ['Pendampingan di rumah', 'Menyiapkan makanan sederhana', 'Kegiatan rutin harian'],
    services: ['rumah', 'teman'],
    languages: ['Indonesia', 'Jawa'],
    availability: 'Senin - Sabtu, 07.00 - 16.00',
    rating: 5.0,
    reviews: 143,
    bio: 'Keibuan dan telaten. Membuat suasana rumah tetap nyaman dan menyenangkan bagi lansia selama keluarga bekerja.',
    look: { skin: '#E3AD87', style: 'bun', hair: '#2E2420', shirt: '#F28C6B', bg: '#FFF1EA' },
  },
  {
    id: 'rizky',
    name: 'Rizky Hidayat',
    age: 27,
    district: 'tapos',
    location: 'Tapos, Depok',
    experienceYears: 2,
    experience: '2 tahun mendampingi lansia berobat dan beraktivitas di luar rumah.',
    skills: ['Pendampingan berobat', 'Menemani olahraga ringan lansia', 'Teman berbincang'],
    services: ['berobat', 'teman'],
    languages: ['Indonesia', 'Betawi'],
    availability: 'Setiap hari, 07.00 - 19.00',
    rating: 4.8,
    reviews: 39,
    bio: 'Ramah dan sabar. Senang mendengarkan cerita lansia dan memastikan setiap kegiatan berjalan nyaman.',
    look: { skin: '#C78B66', style: 'short', hair: '#231C1A', shirt: '#FDA126', bg: '#FFF5E6' },
  },
];

export const EMPTY_BOOKING = {
  serviceId: '',
  elderName: '',
  elderAge: '',
  needs: [],
  district: '',
  address: '',
  familyName: '',
  familyPhone: '',
  familyRelation: '',
  date: '',
  time: '',
  duration: '',
  notes: '',
  companionId: '',
};
