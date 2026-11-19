import React from 'react';
import { StickerKind } from '../types/momori';

export const STICKER_CATALOG: Array<{ kind: StickerKind; label: string }> = [
  { kind: 'cheers-love', label: 'Cheers Love' },
  { kind: 'gingham-heart', label: 'Blue Heart' },
  { kind: 'dual-hearts', label: 'Dual Hearts' },
  { kind: 'bunny-carrot', label: 'Bunny' },
  { kind: 'cd-lovestory', label: 'Love CD' },
  { kind: 'digicam', label: 'Digicam' },
  { kind: 'butterfly', label: 'Butterfly' },
  { kind: 'sparkles', label: 'Sparkles' },
  { kind: 'cat-doodle', label: 'Cat Doodle' },
  { kind: 'glass-heart', label: 'Glass Heart' },
  { kind: 'peach-heart', label: 'Peach Heart' },
];

export const StickerGraphic: React.FC<{ kind: StickerKind; className?: string }> = ({
  kind,
  className = 'w-full h-full',
}) => {
  switch (kind) {
    case 'cheers-love':
      return (
        <svg viewBox="0 0 120 82" className={className} fill="none">
          <path
            d="M14 26c-4-8 4-18 16-17 10-7 28-6 36 2 12-5 29 0 34 11 9 4 12 16 6 24 4 10-4 22-17 22-10 8-28 7-37 0-12 5-27-1-32-11-9-4-12-17-6-24z"
            fill="#FDE8C8"
            stroke="#FFFDF9"
            strokeWidth="3"
          />
          <text
            x="60"
            y="38"
            textAnchor="middle"
            fill="#F26B7A"
            fontFamily="Caveat, cursive"
            fontWeight="700"
            fontSize="26"
            transform="rotate(-8 60 38)"
          >
            Cheers
          </text>
          <text
            x="64"
            y="62"
            textAnchor="middle"
            fill="#E14D63"
            fontFamily="Caveat, cursive"
            fontWeight="700"
            fontSize="26"
            transform="rotate(-6 64 62)"
          >
            Love
          </text>
          <circle cx="24" cy="48" r="3" fill="#FACC15" />
          <circle cx="96" cy="24" r="2.5" fill="#FACC15" />
        </svg>
      );

    case 'gingham-heart':
      return (
        <svg viewBox="0 0 80 76" className={className} fill="none">
          <defs>
            <pattern id="ginghamBlue" width="12" height="12" patternUnits="userSpaceOnUse">
              <rect width="12" height="12" fill="#DCEBFB" />
              <rect width="6" height="12" fill="#9BC3EA" fillOpacity="0.65" />
              <rect width="12" height="6" fill="#9BC3EA" fillOpacity="0.65" />
            </pattern>
          </defs>
          <path
            d="M40 70C40 70 8 49 8 25.5C8 14.5 16.8 6 27.5 6C33.4 6 38.2 9 40 13C41.8 9 46.6 6 52.5 6C63.2 6 72 14.5 72 25.5C72 49 40 70 40 70Z"
            fill="#FAF8F3"
            stroke="#FAF8F3"
            strokeWidth="5"
          />
          <path
            d="M40 66C40 66 12 46.5 12 25.5C12 16.7 18.8 10 27.2 10C32.8 10 37.4 13 40 17.5C42.6 13 47.2 10 52.8 10C61.2 10 68 16.7 68 25.5C68 46.5 40 66 40 66Z"
            fill="url(#ginghamBlue)"
          />
        </svg>
      );

    case 'dual-hearts':
      return (
        <svg viewBox="0 0 96 64" className={className} fill="none">
          <path
            d="M27 52C27 52 7 38.5 7 24C7 16.5 13 11 20 11C24 11 26.8 13.5 27 16.2C27.2 13.5 30 11 34 11C41 11 47 16.5 47 24C47 38.5 27 52 27 52Z"
            fill="#F36E7A"
            stroke="#FFFDF9"
            strokeWidth="2.5"
          />
          <path
            d="M65 56C65 56 41 40 41 22.5C41 13.8 48 7.5 56.5 7.5C61.2 7.5 64.5 10.5 65 13.8C65.5 10.5 68.8 7.5 73.5 7.5C82 7.5 89 13.8 89 22.5C89 40 65 56 65 56Z"
            fill="#EA5B6A"
            stroke="#FFFDF9"
            strokeWidth="2.5"
          />
        </svg>
      );

    case 'bunny-carrot':
      return (
        <svg viewBox="0 0 84 96" className={className} fill="none">
          <ellipse cx="32" cy="24" rx="8" ry="18" transform="rotate(-10 32 24)" fill="#FFFDF9" stroke="#8B6F5C" strokeWidth="2.4" />
          <ellipse cx="52" cy="23" rx="8" ry="18" transform="rotate(10 52 23)" fill="#FFFDF9" stroke="#8B6F5C" strokeWidth="2.4" />
          <ellipse cx="32" cy="24" rx="3.5" ry="11" transform="rotate(-10 32 24)" fill="#F9C6CE" />
          <ellipse cx="52" cy="23" rx="3.5" ry="11" transform="rotate(10 52 23)" fill="#F9C6CE" />
          <ellipse cx="42" cy="48" rx="21" ry="18" fill="#FFFDF9" stroke="#8B6F5C" strokeWidth="2.4" />
          <ellipse cx="42" cy="73" rx="17" ry="16" fill="#FFFDF9" stroke="#8B6F5C" strokeWidth="2.4" />
          <circle cx="34" cy="47" r="2.5" fill="#4B3832" />
          <circle cx="50" cy="47" r="2.5" fill="#4B3832" />
          <circle cx="29" cy="52" r="3.5" fill="#F9A8B8" fillOpacity="0.65" />
          <circle cx="55" cy="52" r="3.5" fill="#F9A8B8" fillOpacity="0.65" />
          <path d="M39 51c1.5 2 4.5 2 6 0" stroke="#8B6F5C" strokeWidth="2" strokeLinecap="round" />
          {/* Carrot */}
          <path d="M46 66L66 57L57 76L46 66Z" fill="#FB923C" stroke="#8B6F5C" strokeWidth="2" strokeLinejoin="round" />
          <path d="M64 56c3-4 6-3 7-1M66 58c4-1 6 2 5 4" stroke="#65A30D" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'cd-lovestory':
      return (
        <svg viewBox="0 0 110 110" className={className} fill="none">
          <defs>
            <linearGradient id="cdPink" x1="0" y1="0" x2="110" y2="110">
              <stop offset="0%" stopColor="#F8C8D4" />
              <stop offset="50%" stopColor="#F4B2C2" />
              <stop offset="100%" stopColor="#E698AC" />
            </linearGradient>
          </defs>
          <circle cx="55" cy="55" r="50" fill="url(#cdPink)" stroke="#E38CA2" strokeWidth="1.5" />
          <circle cx="55" cy="55" r="46" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="1" />
          <circle cx="55" cy="55" r="15" fill="#F9E5EA" stroke="#E094A8" strokeWidth="1.5" />
          <circle cx="55" cy="55" r="8" fill="#F3EFE7" />
          <text
            x="55"
            y="32"
            textAnchor="middle"
            fill="#9D3752"
            fontFamily="Caveat, cursive"
            fontWeight="700"
            fontSize="16"
          >
            love story
          </text>
          <path d="M26 52l3 2-3 2-1 3-1-3-3-2 3-2 1-3z" fill="#E14D71" fillOpacity="0.6" />
          <path d="M84 56l2.5 1.5-2.5 1.5-1 2.5-1-2.5-2.5-1.5 2.5-1.5 1-2.5z" fill="#E14D71" fillOpacity="0.6" />
          <text x="55" y="84" textAnchor="middle" fill="#9D3752" fontSize="6.5" fontFamily="monospace">
            OUR SONG · TRACK 01
          </text>
        </svg>
      );

    case 'digicam':
      return (
        <svg viewBox="0 0 130 96" className={className} fill="none">
          <rect x="6" y="14" width="118" height="76" rx="14" fill="#C7B6A6" stroke="#8C7B6B" strokeWidth="2.5" />
          <rect x="14" y="6" width="24" height="8" rx="3" fill="#B5A392" stroke="#8C7B6B" strokeWidth="2" />
          <rect x="20" y="22" width="18" height="12" rx="3" fill="#57534E" />
          {/* Screen */}
          <rect x="16" y="40" width="58" height="40" rx="5" fill="#F9E4EB" stroke="#9B8A7A" strokeWidth="2" />
          <circle cx="45" cy="59" r="11" fill="#F5B8C8" />
          <circle cx="41" cy="57" r="1.8" fill="#44403C" />
          <circle cx="49" cy="57" r="1.8" fill="#44403C" />
          {/* D-pad / dial */}
          <circle cx="96" cy="56" r="15" fill="#DFD3C6" stroke="#9B8A7A" strokeWidth="2" />
          <circle cx="96" cy="56" r="6" fill="#C7B6A6" />
          <circle cx="88" cy="28" r="5" fill="#E8D8C8" stroke="#9B8A7A" strokeWidth="1.5" />
          <circle cx="106" cy="28" r="5" fill="#F2B8C6" stroke="#9B8A7A" strokeWidth="1.5" />
        </svg>
      );

    case 'butterfly':
      return (
        <svg viewBox="0 0 80 70" className={className} fill="none">
          <path
            d="M40 36C32 18 12 10 10 24C8 34 22 40 36 38C22 42 14 54 22 60C30 66 38 50 40 42C42 50 50 66 58 60C66 54 58 42 44 38C58 40 72 34 70 24C68 10 48 18 40 36Z"
            stroke="#292524"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M40 24V50" stroke="#292524" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M40 24C37 17 33 14 30 14M40 24C43 17 47 14 50 14" stroke="#292524" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M10 14l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" stroke="#292524" strokeWidth="1.5" />
        </svg>
      );

    case 'sparkles':
      return (
        <svg viewBox="0 0 80 64" className={className} fill="none">
          <path d="M24 10l4 11 11 4-11 4-4 11-4-11-11-4 11-4z" stroke="#FACC15" strokeWidth="2.2" fill="#FEF08A" />
          <path d="M56 26l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" stroke="#FACC15" strokeWidth="2" fill="#FEF08A" />
          <circle cx="62" cy="14" r="2.5" fill="#FDE047" />
        </svg>
      );

    case 'cat-doodle':
      return (
        <svg viewBox="0 0 72 68" className={className} fill="none">
          <path
            d="M16 26L14 10L28 19C33 17 39 17 44 19L58 10L56 26C60 31 62 37 60 44C58 54 48 60 36 60C24 60 14 54 12 44C10 37 12 31 16 26Z"
            fill="#1C1917"
            stroke="#FAF8F5"
            strokeWidth="2.5"
          />
          <circle cx="27" cy="37" r="3" fill="#FAF8F5" />
          <circle cx="45" cy="37" r="3" fill="#FAF8F5" />
          <path d="M33 43l3 2.5 3-2.5" stroke="#F9A8D4" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 38h10M8 44h10M54 38h10M54 44h10" stroke="#FAF8F5" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );

    case 'exclaim-doodle':
      return (
        <svg viewBox="0 0 56 68" className={className} fill="none">
          <path d="M18 10l-3 34" stroke="#292524" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="14" cy="56" r="3.5" fill="#292524" />
          <path d="M38 14l-5 32" stroke="#292524" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="31" cy="57" r="3.5" fill="#292524" />
        </svg>
      );

    case 'glass-heart':
      return (
        <svg viewBox="0 0 92 84" className={className} fill="none">
          <defs>
            <linearGradient id="glassGrad" x1="12" y1="8" x2="78" y2="76">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.82" />
              <stop offset="45%" stopColor="#D6D3D1" stopOpacity="0.48" />
              <stop offset="100%" stopColor="#57534E" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <path
            d="M46 76C46 76 10 52 10 27.5C10 15.5 19.5 6.5 31 6.5C37.5 6.5 43.2 9.8 46 14.5C48.8 9.8 54.5 6.5 61 6.5C72.5 6.5 82 15.5 82 27.5C82 52 46 76 46 76Z"
            fill="url(#glassGrad)"
            stroke="#FFFFFF"
            strokeOpacity="0.85"
            strokeWidth="2"
          />
          <path d="M23 21c3-5 9-7 14-6" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.7" />
        </svg>
      );

    case 'peach-heart':
      return (
        <svg viewBox="0 0 54 50" className={className} fill="none">
          <path
            d="M27 45C27 45 5 31 5 17C5 10.5 10.2 5.5 16.5 5.5C20.5 5.5 24.5 7.8 27 11.2C29.5 7.8 33.5 5.5 37.5 5.5C43.8 5.5 49 10.5 49 17C49 31 27 45 27 45Z"
            fill="#FDBA9B"
            stroke="#FFFDF9"
            strokeWidth="2"
          />
        </svg>
      );
  }
};
