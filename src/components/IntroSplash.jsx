import { useEffect, useState } from 'react';
import { BRAND } from '../data.js';

// Animasi pembuka: atap rumah tergambar, keluarga & pendamping muncul satu per satu,
// tulisan TetanggaCare naik huruf demi huruf, lalu layar "masuk ke pintu rumah".
const CSS = `
.ti-wrap{position:fixed;inset:0;z-index:100;display:grid;place-items:center;background:radial-gradient(circle at 50% 40%,#ffffff 0%,#faf6ee 60%,#eef7f2 100%);cursor:pointer}
.ti-wrap.leave{animation:ti-close .9s cubic-bezier(.7,0,.3,1) forwards}
.ti-wrap.leave .ti-scene{animation:ti-zoom .9s cubic-bezier(.7,0,.3,1) forwards}
@keyframes ti-close{from{clip-path:circle(150% at 50% 42%)}to{clip-path:circle(0% at 50% 42%)}}
@keyframes ti-zoom{to{transform:scale(1.8)}}
.ti-scene{width:min(440px,82vw);text-align:center}
.ti-scene svg{width:100%;overflow:visible}
.ti-roof{stroke-dasharray:900;stroke-dashoffset:900;animation:ti-draw 1s .15s ease-out forwards}
@keyframes ti-draw{to{stroke-dashoffset:0}}
.ti-pop{transform-box:fill-box;transform-origin:50% 100%;opacity:0;animation:ti-pop .6s cubic-bezier(.2,.9,.3,1.4) forwards}
@keyframes ti-pop{from{opacity:0;transform:translateY(30px) scale(.5)}to{opacity:1;transform:none}}
.ti-hand{transform-box:fill-box;transform-origin:50% 50%;transform:scaleX(0);animation:ti-hand .7s .9s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes ti-hand{to{transform:scaleX(1)}}
.ti-heart{transform-box:fill-box;transform-origin:center;opacity:0;animation:ti-heart 2.2s ease-out infinite}
@keyframes ti-heart{0%{opacity:0;transform:translateY(0) scale(.5)}25%{opacity:1}100%{opacity:0;transform:translateY(-50px) scale(1.1)}}
.ti-wave{transform-box:fill-box;transform-origin:10% 95%;animation:ti-wave 1s 2s ease-in-out infinite}
@keyframes ti-wave{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(18deg)}}
.ti-word{margin-top:6px;font-weight:800;font-size:clamp(34px,8vw,52px);letter-spacing:-.02em;line-height:1}
.ti-word span{display:inline-block;opacity:0;animation:ti-rise .5s cubic-bezier(.2,.9,.3,1.3) forwards}
@keyframes ti-rise{from{opacity:0;transform:translateY(24px) rotate(-8deg)}to{opacity:1;transform:none}}
.ti-tag{margin-top:10px;color:#5b6b63;font-weight:600;opacity:0;animation:ti-fade .6s 2.7s forwards}
@keyframes ti-fade{to{opacity:1}}
.ti-bar{margin:22px auto 0;width:160px;height:5px;border-radius:9px;background:#d5ede0;overflow:hidden}
.ti-bar i{display:block;height:100%;width:0;border-radius:9px;background:linear-gradient(90deg,#066649,#6db04b,#fda126);animation:ti-load 3.8s .2s linear forwards}
@keyframes ti-load{to{width:100%}}
.ti-skip{position:absolute;bottom:28px;font-size:14px;font-weight:700;color:#066649;background:none;border:0}
@media (prefers-reduced-motion:reduce){.ti-wrap *{animation-duration:.01s!important;animation-delay:0s!important}}
`;

export default function IntroSplash() {
  const [stage, setStage] = useState(() => {
    try {
      return sessionStorage.getItem('tc_intro_v2') ? 'done' : 'show';
    } catch {
      return 'show';
    }
  });

  const finish = () => {
    setStage((s) => (s === 'show' ? 'leave' : s));
    setTimeout(() => setStage('done'), 900);
    try {
      sessionStorage.setItem('tc_intro_v2', '1');
    } catch {
      /* abaikan */
    }
  };

  useEffect(() => {
    if (stage !== 'show') return undefined;
    const t = setTimeout(finish, 4200);
    return () => clearTimeout(t);
  }, [stage]);

  if (stage === 'done') return null;

  const letters = [...'Tetangga'].map((ch) => [ch, '#066649']).concat([...'Care'].map((ch) => [ch, '#fda126']));

  return (
    <div className={`ti-wrap ${stage === 'leave' ? 'leave' : ''}`} onClick={finish} role="presentation">
      <style>{CSS}</style>
      <div className="ti-scene">
        <svg viewBox="0 0 520 400" aria-hidden="true">
          <circle cx="260" cy="230" r="175" fill="#eef7f2" />
          <rect className="ti-pop" style={{ animationDelay: '.8s' }} x="372" y="80" width="26" height="56" rx="6" fill="#078354" />
          <path className="ti-roof" d="M70 195 L238 100 Q260 88 282 100 L450 195" fill="none" stroke="#078354" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
          <path className="ti-hand" d="M78 308 Q250 430 452 290 Q470 278 478 258 Q472 290 444 326 Q300 438 102 334 Q86 324 78 308Z" fill="#066649" />

          <g className="ti-pop" style={{ animationDelay: '1.35s' }}>
            <circle cx="222" cy="158" r="23" fill="#fda126" />
            <circle cx="200" cy="166" r="9" fill="#fda126" />
                           <path d="M196 330 C186 276 192 204 222 190 C244 200 250 226 250 242 C270 252 274 286 252 302 C250 312 249 322 248 330Z" fill="#fda126" />
               <path d="M240 258 Q262 274 246 294" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity=".75" />
            <path className="ti-wave" d="M240 210 Q268 186 270 158" stroke="#fda126" strokeWidth="14" strokeLinecap="round" fill="none" />
          </g>
          <g className="ti-pop" style={{ animationDelay: '1.2s' }}>
            <circle cx="160" cy="190" r="21" fill="#066649" />
            <circle cx="146" cy="174" r="9" fill="#066649" />
            <path d="M126 330 C116 282 124 230 152 216 C176 212 190 234 190 252 L192 330Z" fill="#066649" />
            <path d="M176 252 Q196 258 206 266" stroke="#066649" strokeWidth="12" strokeLinecap="round" fill="none" />
            <path d="M200 260 Q212 248 220 260 L220 332" stroke="#066649" strokeWidth="7" strokeLinecap="round" fill="none" />
          </g>
          <g className="ti-pop" style={{ animationDelay: '1.5s' }}>
            <circle cx="322" cy="204" r="20" fill="#078354" />
            <path d="M302 290 C298 256 306 234 322 230 C338 234 346 256 342 290Z" fill="#078354" />
            <path d="M318 280 H284 V294 H318Z" fill="#078354" />
            <rect x="278" y="280" width="13" height="40" rx="6" fill="#078354" />
            <circle cx="322" cy="304" r="30" fill="#fff" stroke="#078354" strokeWidth="9" />
            <circle cx="280" cy="326" r="7" fill="#fff" stroke="#078354" strokeWidth="5" />
            <path d="M344 290 L350 242 L360 238" stroke="#078354" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
          <g className="ti-pop" style={{ animationDelay: '1.65s' }}>
            <circle cx="398" cy="170" r="21" fill="#6db04b" />
            <path d="M372 328 C364 276 370 212 398 198 C426 212 432 276 424 328Z" fill="#6db04b" />
            <path d="M384 222 Q368 234 358 240" stroke="#6db04b" strokeWidth="13" strokeLinecap="round" fill="none" />
          </g>

          <path className="ti-heart" style={{ animationDelay: '2s' }} d="M262 150c-10-7-10-17-3-17 2 0 3 1 3 2 0-1 1-2 3-2 7 0 7 10-3 17Z" fill="#fda126" />
          <path className="ti-heart" style={{ animationDelay: '2.6s' }} d="M300 166c-7-5-7-12-2-12 1 0 2 1 2 1 0 0 1-1 2-1 5 0 5 7-2 12Z" fill="#6db04b" />
          <path className="ti-heart" style={{ animationDelay: '3.1s' }} d="M190 160c-7-5-7-12-2-12 1 0 2 1 2 1 0 0 1-1 2-1 5 0 5 7-2 12Z" fill="#fda126" />
        </svg>

        <div className="ti-word">
          {letters.map(([ch, color], i) => (
            <span key={i} style={{ color, animationDelay: `${1.9 + i * 0.05}s` }}>{ch}</span>
          ))}
        </div>
        <p className="ti-tag">{BRAND.tagline}</p>
        <div className="ti-bar"><i /></div>
      </div>
      <button className="ti-skip" onClick={finish}>Lewati ›</button>
    </div>
  );
}
