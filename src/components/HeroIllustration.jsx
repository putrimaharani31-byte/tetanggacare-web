import { Icon } from './ui.jsx';

/*
  Ilustrasi hero yang mengikuti konsep logo:
  atap rumah hijau, keluarga + pendamping, dan "tangan" yang menopang.
  Arahkan kursor ke tiap tokoh untuk efek hover.
*/
export default function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      <svg viewBox="0 0 520 440" className="w-full" role="img" aria-label="Ilustrasi pendamping bersama lansia dan keluarga di bawah atap rumah">
        <circle cx="260" cy="250" r="190" fill="#EEF7F2" />
        <circle cx="260" cy="250" r="150" fill="#FFFFFF" opacity=".7" />

        {/* atap rumah (seperti logo) */}
        <rect x="372" y="92" width="26" height="56" rx="6" fill="#078354" />
        <path className="draw-roof" d="M70 205 L238 112 Q260 100 282 112 L450 205" fill="none" stroke="#078354" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />

        {/* hati melayang */}
        <path className="heart-up" d="M260 168c-10-7-10-17-3-17 2 0 3 1 3 2 0-1 1-2 3-2 7 0 7 10-3 17Z" fill="#FDA126" />
        <path className="heart-up [animation-delay:1.6s]" d="M300 182c-7-5-7-12-2-12 1 0 2 1 2 1 0 0 1-1 2-1 5 0 5 7-2 12Z" fill="#6DB04B" />

        {/* tangan yang menopang */}
        <path d="M78 318 Q250 440 452 300 Q470 288 478 268 Q472 300 444 336 Q300 448 102 344 Q86 334 78 318Z" fill="#066649" />

        {/* pendamping (oranye) - melambai */}
        <g className="figure">
          <circle cx="222" cy="168" r="23" fill="#FDA126" />
          <circle cx="200" cy="176" r="9" fill="#FDA126" />
                      <path d="M196 340 C186 286 192 214 222 200 C244 210 250 236 250 252 C270 262 274 296 252 312 C250 322 249 332 248 340Z" fill="#FDA126" />
             <path d="M240 268 Q262 284 246 304" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity=".75" />
          <path className="wave-arm" d="M240 220 Q268 196 270 168" stroke="#FDA126" strokeWidth="14" strokeLinecap="round" fill="none" />
        </g>

        {/* lansia dengan tongkat (hijau tua) */}
        <g className="figure">
          <circle cx="160" cy="200" r="21" fill="#066649" />
          <circle cx="146" cy="184" r="9" fill="#066649" />
          <path d="M126 340 C116 292 124 240 152 226 C176 222 190 244 190 262 L192 340Z" fill="#066649" />
          <path d="M176 262 Q196 268 206 276" stroke="#066649" strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d="M200 270 Q212 258 220 270 L220 342" stroke="#066649" strokeWidth="7" strokeLinecap="round" fill="none" />
        </g>

        {/* pengguna kursi roda (hijau) */}
        <g className="figure">
          <circle cx="322" cy="214" r="20" fill="#078354" />
          <path d="M302 300 C298 266 306 244 322 240 C338 244 346 266 342 300Z" fill="#078354" />
          <path d="M318 290 H284 V304 H318Z" fill="#078354" />
          <rect x="278" y="290" width="13" height="40" rx="6" fill="#078354" />
          <circle cx="322" cy="314" r="30" fill="#fff" stroke="#078354" strokeWidth="9" />
          <circle cx="322" cy="314" r="5" fill="#078354" />
          <circle cx="280" cy="336" r="7" fill="#fff" stroke="#078354" strokeWidth="5" />
          <path d="M344 300 L350 252 L360 248" stroke="#078354" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>

        {/* anggota keluarga (hijau muda) */}
        <g className="figure">
          <circle cx="398" cy="180" r="21" fill="#6DB04B" />
          <path d="M372 338 C364 286 370 222 398 208 C426 222 432 286 424 338Z" fill="#6DB04B" />
          <path d="M384 232 Q368 244 358 250" stroke="#6DB04B" strokeWidth="13" strokeLinecap="round" fill="none" />
        </g>
      </svg>

      {/* kartu info melayang */}
      <div className="animate-float absolute left-0 top-[18%] hidden items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-forest-900/10 sm:flex">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-forest-50 text-forest-700">
          <Icon name="badge" className="h-5 w-5" />
        </span>
        <div className="text-left">
          <p className="text-xs text-muted">Pendamping</p>
          <p className="text-sm font-bold text-ink">Terverifikasi</p>
        </div>
      </div>
      <div className="animate-float-slow absolute bottom-[6%] right-0 hidden items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-forest-900/10 sm:flex">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-sun-50 text-[#B86B00]">
          <Icon name="bell" className="h-5 w-5" />
        </span>
        <div className="text-left">
          <p className="text-xs text-muted">Kabar untuk keluarga</p>
          <p className="text-sm font-bold text-ink">Laporan setelah layanan</p>
        </div>
      </div>
    </div>
  );
}
