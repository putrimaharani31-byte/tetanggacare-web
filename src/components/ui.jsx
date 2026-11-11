import { useEffect } from 'react';
import { BRAND, NOT_INCLUDED } from '../data.js';

/* ---------------- Ikon (garis sederhana) ---------------- */
const ICONS = {
  heart: ['M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'],
  hospital: ['M12 6v4', 'M14 8h-4', 'M14 14h-4', 'M14 18h-4', 'M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2', 'M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18'],
  home: ['M3 10.5 12 3l9 7.5', 'M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5'],
  chat: ['M7.9 20A9 9 0 1 0 4 16.1L2 22Z', 'M8 12h.01', 'M12 12h.01', 'M16 12h.01'],
  check: ['M20 6 9 17l-5-5'],
  checkCircle: [{ c: [12, 12, 10] }, 'm9 12 2 2 4-4'],
  shield: ['M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z', 'm9 12 2 2 4-4'],
  badge: ['M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z', 'm9 12 2 2 4-4'],
  clock: [{ c: [12, 12, 10] }, 'M12 6v6l4 2'],
  calendar: [{ r: [3, 4, 18, 18, 2] }, 'M16 2v4', 'M8 2v4', 'M3 10h18'],
  pin: ['M20 10c0 4.99-5.54 10.19-7.4 11.79a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0', { c: [12, 10, 3] }],
  star: ['M11.5 2.3a.53.53 0 0 1 .95 0l2.31 4.68a2.12 2.12 0 0 0 1.6 1.16l5.16.76a.53.53 0 0 1 .3.9l-3.74 3.64a2.12 2.12 0 0 0-.61 1.88l.88 5.14a.53.53 0 0 1-.77.56l-4.62-2.43a2.12 2.12 0 0 0-1.97 0L6.4 21.01a.53.53 0 0 1-.77-.56l.88-5.14a2.12 2.12 0 0 0-.61-1.88L2.16 9.8a.53.53 0 0 1 .3-.9l5.16-.76a2.12 2.12 0 0 0 1.6-1.16z'],
  user: [{ c: [12, 8, 4] }, 'M20 21a8 8 0 0 0-16 0'],
  users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', { c: [9, 7, 4] }, 'M22 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
  arrowRight: ['M5 12h14', 'm12 5 7 7-7 7'],
  arrowLeft: ['M19 12H5', 'm12 19-7-7 7-7'],
  menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
  x: ['M18 6 6 18', 'm6 6 12 12'],
  info: [{ c: [12, 12, 10] }, 'M12 16v-4', 'M12 8h.01'],
  ban: [{ c: [12, 12, 10] }, 'm4.9 4.9 14.2 14.2'],
  wallet: ['M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1', 'M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4'],
  file: ['M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z', 'M14 2v4a2 2 0 0 0 2 2h4', 'M16 13H8', 'M16 17H8', 'M10 9H8'],
  pencil: ['M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z'],
  sparkles: ['M12 3l1.9 5.8L20 10.7l-6.1 1.9L12 18.4l-1.9-5.8L4 10.7l6.1-1.9Z', 'M19 3v4', 'M21 5h-4'],
  bell: ['M10.27 21a2 2 0 0 0 3.46 0', 'M3.26 15.33A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.67C19.41 13.96 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.41 5.96-2.74 7.33'],
  copy: [{ r: [8, 8, 14, 14, 2] }, 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2'],
  printer: ['M6 9V2h12v7', 'M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2', { r: [6, 14, 12, 8, 1] }],
  filter: ['M22 3H2l8 9.46V19l4 2v-8.54L22 3z'],
};

export function Icon({ name, className = 'h-5 w-5', strokeWidth = 2 }) {
  const parts = ICONS[name] || [];
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {parts.map((p, i) =>
        typeof p === 'string' ? (
          <path key={i} d={p} />
        ) : p.c ? (
          <circle key={i} cx={p.c[0]} cy={p.c[1]} r={p.c[2]} />
        ) : (
          <rect key={i} x={p.r[0]} y={p.r[1]} width={p.r[2]} height={p.r[3]} rx={p.r[4]} />
        )
      )}
    </svg>
  );
}

/* ---------------- Logo (dipotong otomatis dari file logo) ---------------- */
export function Logo({ variant = 'full', className = 'h-10' }) {
  const { src, imageWidth, imageHeight } = BRAND.logo;
  const [x, y, w, h] = BRAND.logo[variant];
  return (
    <span className={`relative inline-block shrink-0 overflow-hidden ${className}`} style={{ aspectRatio: `${w} / ${h}` }}>
      <img
        src={src}
        alt={variant === 'full' ? BRAND.name : ''}
        draggable="false"
        className="absolute max-w-none mix-blend-multiply"
        style={{
          width: `${(imageWidth / w) * 100}%`,
          height: `${(imageHeight / h) * 100}%`,
          left: `${(-x / w) * 100}%`,
          top: `${(-y / h) * 100}%`,
        }}
      />
    </span>
  );
}

export function Wordmark({ className = 'text-xl' }) {
  return (
    <span className={`font-extrabold tracking-tight ${className}`}>
      <span className="text-forest-700">Tetangga</span>
      <span className="text-sun">Care</span>
    </span>
  );
}

/* ---------------- Tombol ---------------- */
const BTN_SIZES = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-[15px]', lg: 'px-7 py-3.5 text-base' };
const BTN_VARIANTS = {
  primary: 'bg-forest-700 text-white hover:bg-forest-800 glow-btn',
  accent: 'bg-sun text-forest-900 hover:brightness-105 glow-btn',
  outline: 'border-2 border-forest-200 bg-white text-forest-700 hover:border-forest-500',
  ghost: 'text-forest-700 hover:bg-forest-50',
  light: 'bg-white text-forest-700 hover:bg-forest-50 glow-btn',
};

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-200 disabled:pointer-events-none disabled:opacity-50 ${BTN_SIZES[size]} ${BTN_VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/* ---------------- Tata letak ---------------- */
export function Container({ className = '', children }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function SectionHeading({ eyebrow, title, desc, center = false }) {
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-forest-500">{eyebrow}</p>}
      <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-ink md:text-4xl">{title}</h2>
      {desc && <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{desc}</p>}
    </div>
  );
}

export function PageHeader({ eyebrow, title, desc, children }) {
  return (
    <section className="relative overflow-hidden border-b border-forest-100 bg-gradient-to-b from-forest-50 to-beige">
      <div className="pointer-events-none absolute -right-16 -top-10 opacity-[0.07]">
        <Logo variant="emblem" className="h-72" />
      </div>
      <Container className="relative py-12 md:py-16">
        <SectionHeading eyebrow={eyebrow} title={title} desc={desc} />
        {children}
      </Container>
    </section>
  );
}

const TONES = {
  forest: 'bg-forest-50 text-forest-700',
  sun: 'bg-sun-50 text-[#B86B00]',
  leaf: 'bg-[#F1F8EC] text-[#3F7A26]',
};
export function IconBadge({ name, tone = 'forest', className = 'h-12 w-12' }) {
  return (
    <span className={`icon-wiggle grid shrink-0 place-items-center rounded-2xl ${TONES[tone]} ${className}`}>
      <Icon name={name} className="h-6 w-6" />
    </span>
  );
}

export function Chip({ active, children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active ? 'border-forest-700 bg-forest-700 text-white' : 'border-forest-100 bg-white text-muted hover:border-forest-300 hover:text-forest-700'
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

/* ---------------- Modal & Toast ---------------- */
export function Modal({ open, onClose, children, label }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-8"
      >
        <button onClick={onClose} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full text-muted hover:bg-forest-50" aria-label="Tutup">
          <Icon name="x" />
        </button>
        {children}
      </div>
    </div>
  );
}

export function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div role="status" className="animate-toast fixed bottom-6 left-1/2 z-[60] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl bg-forest-800 px-5 py-4 text-white shadow-2xl">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sun text-forest-900">
        <Icon name="check" className="h-4 w-4" strokeWidth={3} />
      </span>
      <p className="flex-1 text-sm font-semibold">{message}</p>
      <button onClick={onClose} className="text-white/70 hover:text-white" aria-label="Tutup notifikasi">
        <Icon name="x" className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ---------------- Avatar ilustrasi (bukan foto asli) ---------------- */
export function Avatar({ look, className = 'h-20 w-20' }) {
  const { skin, style, hair, shirt, bg } = look;
  return (
    <svg viewBox="0 0 120 120" className={`shrink-0 rounded-2xl ${className}`} role="img" aria-label="Ilustrasi pendamping">
      <rect width="120" height="120" fill={bg} />
      <circle cx="96" cy="22" r="10" fill={shirt} opacity=".18" />
      {style === 'long' && <path d="M33 54c-4 26 1 40 10 42h34c9-2 14-16 10-42-2-26-52-26-54 0Z" fill={hair} />}
      <path d="M14 120c3-24 22-36 46-36s43 12 46 36Z" fill={shirt} />
      <path d="M50 84c3 7 17 7 20 0" stroke="#fff" strokeWidth="3" fill="none" opacity=".6" />
      {style === 'hijab' ? (
        <>
          <path d="M31 58c-2-27 13-36 29-36s31 9 29 36c-1 14-8 23-16 28l20 12c4 4 7 10 9 22H14c2-12 5-18 9-22l20-12c-8-5-12-14-12-28Z" fill={hair} />
          <ellipse cx="60" cy="58" rx="19" ry="21" fill={skin} />
        </>
      ) : (
        <>
          <rect x="53" y="72" width="14" height="14" rx="5" fill={skin} />
          <circle cx="60" cy="55" r="23" fill={skin} />
          <path d="M37 53c-2-21 12-29 24-29 14 0 25 9 22 29-4-9-13-14-23-13-10 0-19 4-23 13Z" fill={hair} />
          {style === 'bun' && <circle cx="60" cy="26" r="9" fill={hair} />}
        </>
      )}
      <circle cx="52" cy="57" r="2.6" fill="#2A2321" />
      <circle cx="68" cy="57" r="2.6" fill="#2A2321" />
      <circle cx="47" cy="65" r="3.5" fill="#F28C7A" opacity=".35" />
      <circle cx="73" cy="65" r="3.5" fill="#F28C7A" opacity=".35" />
      <path d="M53 67c4 4 10 4 14 0" stroke="#7A3E32" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function StarRating({ rating, reviews, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 text-sm ${className}`}>
      <Icon name="star" className="h-4 w-4 fill-sun text-sun" />
      <span className="font-bold text-ink">{rating.toFixed(1)}</span>
      {reviews != null && <span className="text-muted">({reviews} ulasan)</span>}
    </span>
  );
}

export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-forest-50 px-2.5 py-1 text-xs font-bold text-forest-700">
      <Icon name="badge" className="h-3.5 w-3.5" /> Identitas terverifikasi
    </span>
  );
}

/* ---------------- Formulir ---------------- */
export const inputClass = (error) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-slate-400 focus:ring-4 ${
    error ? 'border-red-400 focus:ring-red-100' : 'border-forest-100 focus:border-forest-500 focus:ring-forest-100'
  }`;

export function Field({ id, label, required, error, hint, children }) {
  return (
    <div id={`field-${id}`} className="scroll-mt-28">
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-bold text-ink">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-red-600">
          <Icon name="info" className="h-4 w-4" /> {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-sm text-muted">{hint}</p>
      )}
    </div>
  );
}

/* ---------------- Pemberitahuan layanan nonmedis ---------------- */
export function NonMedicalNotice({ compact = false }) {
  return (
    <div className="rounded-2xl border border-sun/40 bg-sun-50 p-5">
      <div className="flex gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sun/20 text-[#B86B00]">
          <Icon name="info" />
        </span>
        <div>
          <p className="font-bold text-ink">TetanggaCare adalah layanan pendampingan nonmedis</p>
          <p className="mt-1 text-sm text-muted">Pendamping tidak melakukan:</p>
          <ul className={`mt-2 grid gap-1.5 text-sm text-ink ${compact ? '' : 'sm:grid-cols-2'}`}>
            {NOT_INCLUDED.map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Icon name="ban" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
