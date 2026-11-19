import {
  BookSpread,
  FilterPresetId,
  MomoriBook,
  PhotoEdits,
} from '../types/momori';
import { getSamplePhotos } from '../utils/samplePhotos';

export const DEFAULT_PHOTO_EDITS: PhotoEdits = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  sepia: 0,
  zoom: 1,
  panX: 0,
  panY: 0,
  rotation: 0,
  frameStyle: 'polaroid',
  preset: 'original',
};

export const FILTER_PRESETS: Array<{
  id: FilterPresetId;
  label: string;
  values: Pick<PhotoEdits, 'brightness' | 'contrast' | 'saturate' | 'sepia'>;
}> = [
  {
    id: 'original',
    label: 'Original',
    values: { brightness: 100, contrast: 100, saturate: 100, sepia: 0 },
  },
  {
    id: 'warm-film',
    label: 'Warm Film',
    values: { brightness: 104, contrast: 108, saturate: 112, sepia: 18 },
  },
  {
    id: 'vintage-sepia',
    label: 'Vintage',
    values: { brightness: 102, contrast: 96, saturate: 82, sepia: 46 },
  },
  {
    id: 'soft-pastel',
    label: 'Soft Pastel',
    values: { brightness: 110, contrast: 90, saturate: 92, sepia: 8 },
  },
  {
    id: 'bw-classic',
    label: 'B&W',
    values: { brightness: 103, contrast: 118, saturate: 0, sepia: 0 },
  },
  {
    id: 'cool-breeze',
    label: 'Cool Day',
    values: { brightness: 102, contrast: 106, saturate: 118, sepia: 0 },
  },
];

export function createDefaultBook(): MomoriBook {
  const samples = getSamplePhotos();
  const imgMilan = samples[0]?.src ?? '';
  const imgCafe = samples[1]?.src ?? '';
  const imgWalk = samples[2]?.src ?? '';
  const imgCrosswalk = samples[3]?.src ?? '';
  const imgSea = samples[4]?.src ?? '';
  const imgRoses = samples[5]?.src ?? '';

  return {
    id: 'momori-book-default',
    bookName: 'Our Momori Book',
    backdrop: 'linen',
    updatedAt: new Date().toISOString(),
    cover: {
      title: 'Where Your Smile Shines',
      subtitle: 'Kumpulan cerita kecil & kenangan hangat',
      dateLabel: 'Milan · 2026',
      coverColor: '#ebe4d6',
      photo: {
        id: 'cover-photo-1',
        pageSide: 'cover',
        x: 50,
        y: 45,
        widthPct: 68,
        aspectRatio: '4/3',
        src: imgMilan,
        caption: 'Our favorite chapters ♡',
        zIndex: 5,
        edits: {
          ...DEFAULT_PHOTO_EDITS,
          rotation: -2,
          frameStyle: 'polaroid',
        },
      },
    },
    spreads: [
      {
        id: 'spread-1',
        label: 'Halaman 1–2',
        photos: [
          {
            id: 's1-photo-main',
            pageSide: 'left',
            x: 16,
            y: 30,
            widthPct: 66,
            aspectRatio: '4/3',
            src: imgMilan,
            caption: '',
            zIndex: 10,
            edits: {
              ...DEFAULT_PHOTO_EDITS,
              rotation: -2,
              frameStyle: 'polaroid',
            },
          },
          {
            id: 's1-photo-love',
            pageSide: 'right',
            x: 52,
            y: 8,
            widthPct: 38,
            aspectRatio: '1/1',
            src: imgCafe,
            caption: 'Love ♡♡',
            zIndex: 12,
            edits: {
              ...DEFAULT_PHOTO_EDITS,
              rotation: 5,
              frameStyle: 'polaroid',
            },
          },
          {
            id: 's1-photo-mini-1',
            pageSide: 'right',
            x: 11,
            y: 67,
            widthPct: 31,
            aspectRatio: '1/1',
            src: imgWalk,
            caption: '',
            zIndex: 11,
            edits: {
              ...DEFAULT_PHOTO_EDITS,
              rotation: -4,
              frameStyle: 'polaroid',
            },
          },
          {
            id: 's1-photo-mini-2',
            pageSide: 'right',
            x: 41,
            y: 69,
            widthPct: 31,
            aspectRatio: '1/1',
            src: imgCrosswalk,
            caption: '',
            zIndex: 13,
            edits: {
              ...DEFAULT_PHOTO_EDITS,
              rotation: 5,
              frameStyle: 'polaroid',
            },
          },
        ],
        texts: [
          {
            id: 's1-title',
            pageSide: 'left',
            x: 14,
            y: 12,
            widthPct: 76,
            rotation: -1.5,
            variant: 'highlighted-title',
            tint: 'butter',
            content: 'Where Your Smile Shines Brightest',
          },
          {
            id: 's1-diary',
            pageSide: 'left',
            x: 11,
            y: 73,
            widthPct: 78,
            rotation: -1,
            variant: 'diary-paragraph',
            content:
              'Dear Dudunyie.. in every smile you share, i find endless joy and the truest reflection of our love.',
            accentWord: 'every smile',
            underlineWord: 'truest reflection',
          },
          {
            id: 's1-sticky',
            pageSide: 'right',
            x: 10,
            y: 9,
            widthPct: 40,
            rotation: -3,
            variant: 'sticky-note',
            tint: 'sky',
            content: 'Dudunyiee..\nThank you for being my reason to smile.\nIloveyou <3',
          },
          {
            id: 's1-quote',
            pageSide: 'right',
            x: 48,
            y: 35,
            widthPct: 42,
            rotation: -2,
            variant: 'ripped-quote',
            tint: 'cream',
            content: '“You are my sun,\nmy moon,\nand all of my stars.”',
          },
          {
            id: 's1-letter',
            pageSide: 'right',
            x: 14,
            y: 49,
            widthPct: 74,
            rotation: -1.5,
            variant: 'caption-hand',
            tint: 'sky',
            content:
              'Have you ever wondered what makes me smile so much? It’s you. Your love lights up my life in ways I never thought possible. Every day with you is filled with happiness and warmth.',
          },
        ],
        stickers: [
          { id: 'st-cheers', kind: 'cheers-love', x: 3, y: 5, size: 78, rotation: -12, zIndex: 25 },
          { id: 'st-gingham', kind: 'gingham-heart', x: 9, y: 26, size: 48, rotation: -14, zIndex: 24 },
          { id: 'st-dual', kind: 'dual-hearts', x: 37, y: 56, size: 54, rotation: 4, zIndex: 24 },
          { id: 'st-bunny', kind: 'bunny-carrot', x: 42, y: 80, size: 54, rotation: 6, zIndex: 24 },
          { id: 'st-digicam', kind: 'digicam', x: 2, y: 80, size: 88, rotation: -5, zIndex: 26 },
          { id: 'st-butterfly', kind: 'butterfly', x: 70, y: 7, size: 52, rotation: -8, zIndex: 24 },
          { id: 'st-glass', kind: 'glass-heart', x: 91, y: 37, size: 68, rotation: 10, zIndex: 25 },
          { id: 'st-peach', kind: 'peach-heart', x: 68, y: 75, size: 30, rotation: -6, zIndex: 24 },
          { id: 'st-cd', kind: 'cd-lovestory', x: 82, y: 71, size: 84, rotation: 12, zIndex: 24 },
          { id: 'st-sparkles', kind: 'sparkles', x: 40, y: 12, size: 56, rotation: 0, zIndex: 22 },
        ],
      },
      {
        id: 'spread-2',
        label: 'Halaman 3–4',
        photos: [
          {
            id: 's2-photo-left',
            pageSide: 'left',
            x: 15,
            y: 24,
            widthPct: 68,
            aspectRatio: '3/4',
            src: imgRoses,
            caption: 'Quiet morning light ☀',
            zIndex: 10,
            edits: {
              ...DEFAULT_PHOTO_EDITS,
              rotation: -2,
              frameStyle: 'taped',
              preset: 'warm-film',
              brightness: 104,
              contrast: 106,
              saturate: 110,
              sepia: 14,
            },
          },
          {
            id: 's2-photo-right-1',
            pageSide: 'right',
            x: 14,
            y: 14,
            widthPct: 64,
            aspectRatio: '4/3',
            src: imgSea,
            caption: 'Golden hour by the water',
            zIndex: 11,
            edits: {
              ...DEFAULT_PHOTO_EDITS,
              rotation: 3,
              frameStyle: 'polaroid',
            },
          },
        ],
        texts: [
          {
            id: 's2-title',
            pageSide: 'left',
            x: 14,
            y: 10,
            widthPct: 72,
            rotation: -1,
            variant: 'highlighted-title',
            tint: 'blush',
            content: 'Slow Mornings & Sweet Conversations',
          },
          {
            id: 's2-sticky',
            pageSide: 'right',
            x: 14,
            y: 66,
            widthPct: 70,
            rotation: -1.5,
            variant: 'sticky-note',
            tint: 'butter',
            content:
              'Catatan kecil hari ini:\nJangan lupa simpan setiap tawa sederhana sebelum waktu berjalan terlalu cepat.',
          },
        ],
        stickers: [
          { id: 's2-st-1', kind: 'cat-doodle', x: 8, y: 80, size: 50, rotation: -8, zIndex: 22 },
          { id: 's2-st-2', kind: 'sparkles', x: 82, y: 12, size: 54, rotation: 8, zIndex: 22 },
          { id: 's2-st-3', kind: 'dual-hearts', x: 84, y: 78, size: 50, rotation: -6, zIndex: 22 },
        ],
      },
      {
        id: 'spread-3',
        label: 'Halaman 5–6',
        photos: [
          {
            id: 's3-photo-1',
            pageSide: 'left',
            x: 12,
            y: 16,
            widthPct: 50,
            aspectRatio: '1/1',
            src: imgWalk,
            caption: 'Jalan pagi',
            zIndex: 10,
            edits: { ...DEFAULT_PHOTO_EDITS, rotation: -4, frameStyle: 'polaroid' },
          },
          {
            id: 's3-photo-2',
            pageSide: 'left',
            x: 42,
            y: 44,
            widthPct: 48,
            aspectRatio: '1/1',
            src: imgCafe,
            caption: 'Kopi berdua',
            zIndex: 12,
            edits: { ...DEFAULT_PHOTO_EDITS, rotation: 5, frameStyle: 'polaroid' },
          },
          {
            id: 's3-photo-3',
            pageSide: 'right',
            x: 18,
            y: 24,
            widthPct: 66,
            aspectRatio: '4/3',
            src: imgCrosswalk,
            caption: 'Every street feels like a movie scene',
            zIndex: 11,
            edits: { ...DEFAULT_PHOTO_EDITS, rotation: -2, frameStyle: 'taped' },
          },
        ],
        texts: [
          {
            id: 's3-quote',
            pageSide: 'left',
            x: 12,
            y: 78,
            widthPct: 76,
            rotation: 0,
            variant: 'diary-paragraph',
            content: 'Little footsteps, shared playlists, and golden afternoons we never want to forget.',
            accentWord: 'shared playlists',
          },
          {
            id: 's3-title',
            pageSide: 'right',
            x: 18,
            y: 10,
            widthPct: 68,
            rotation: 1,
            variant: 'highlighted-title',
            tint: 'mint',
            content: 'Captured On Our Favorite Day',
          },
        ],
        stickers: [
          { id: 's3-st-1', kind: 'cd-lovestory', x: 78, y: 74, size: 78, rotation: -10, zIndex: 23 },
          { id: 's3-st-2', kind: 'butterfly', x: 38, y: 12, size: 46, rotation: 10, zIndex: 23 },
          { id: 's3-st-3', kind: 'gingham-heart', x: 54, y: 75, size: 46, rotation: -8, zIndex: 23 },
        ],
      },
    ],
    backCover: {
      quote: 'Every photograph is a quiet promise that this moment mattered.',
      signature: 'Made with Momori',
      year: '2026',
    },
  };
}

export function createNewSpread(index: number, template: 'classic' | 'twin' | 'collage'): BookSpread {
  const samples = getSamplePhotos();
  const sA = samples[index % samples.length]?.src ?? '';
  const sB = samples[(index + 1) % samples.length]?.src ?? '';
  const sC = samples[(index + 2) % samples.length]?.src ?? '';
  const uid = `spread-${Date.now()}`;
  const pageNumStart = index * 2 + 1;

  if (template === 'twin') {
    return {
      id: uid,
      label: `Halaman ${pageNumStart}–${pageNumStart + 1}`,
      photos: [
        {
          id: `${uid}-p1`,
          pageSide: 'left',
          x: 16,
          y: 22,
          widthPct: 68,
          aspectRatio: '3/4',
          src: sA,
          caption: 'Momen pertama',
          zIndex: 10,
          edits: { ...DEFAULT_PHOTO_EDITS, rotation: -2, frameStyle: 'polaroid' },
        },
        {
          id: `${uid}-p2`,
          pageSide: 'right',
          x: 16,
          y: 22,
          widthPct: 68,
          aspectRatio: '3/4',
          src: sB,
          caption: 'Momen kedua',
          zIndex: 10,
          edits: { ...DEFAULT_PHOTO_EDITS, rotation: 2, frameStyle: 'taped' },
        },
      ],
      texts: [
        {
          id: `${uid}-t1`,
          pageSide: 'left',
          x: 16,
          y: 9,
          widthPct: 70,
          rotation: -1,
          variant: 'highlighted-title',
          tint: 'butter',
          content: 'New Memory Chapter',
        },
        {
          id: `${uid}-t2`,
          pageSide: 'right',
          x: 16,
          y: 78,
          widthPct: 70,
          rotation: 0,
          variant: 'diary-paragraph',
          content: 'Tulis cerita singkatmu di sini. Klik teks untuk mengganti kata-katanya.',
        },
      ],
      stickers: [
        { id: `${uid}-st1`, kind: 'sparkles', x: 84, y: 10, size: 50, rotation: 0, zIndex: 20 },
      ],
    };
  }

  if (template === 'collage') {
    return {
      id: uid,
      label: `Halaman ${pageNumStart}–${pageNumStart + 1}`,
      photos: [
        {
          id: `${uid}-p1`,
          pageSide: 'left',
          x: 12,
          y: 18,
          widthPct: 52,
          aspectRatio: '1/1',
          src: sA,
          caption: 'Snap 01',
          zIndex: 10,
          edits: { ...DEFAULT_PHOTO_EDITS, rotation: -4, frameStyle: 'polaroid' },
        },
        {
          id: `${uid}-p2`,
          pageSide: 'left',
          x: 42,
          y: 48,
          widthPct: 48,
          aspectRatio: '1/1',
          src: sB,
          caption: 'Snap 02',
          zIndex: 11,
          edits: { ...DEFAULT_PHOTO_EDITS, rotation: 4, frameStyle: 'polaroid' },
        },
        {
          id: `${uid}-p3`,
          pageSide: 'right',
          x: 16,
          y: 22,
          widthPct: 68,
          aspectRatio: '4/3',
          src: sC,
          caption: 'Favorite frame',
          zIndex: 10,
          edits: { ...DEFAULT_PHOTO_EDITS, rotation: -2, frameStyle: 'polaroid' },
        },
      ],
      texts: [
        {
          id: `${uid}-t1`,
          pageSide: 'right',
          x: 16,
          y: 70,
          widthPct: 68,
          rotation: -1,
          variant: 'sticky-note',
          tint: 'sky',
          content: 'Catatan kenangan...\nSimpan momen terbaik hari ini!',
        },
      ],
      stickers: [
        { id: `${uid}-st1`, kind: 'dual-hearts', x: 42, y: 20, size: 48, rotation: 8, zIndex: 20 },
        { id: `${uid}-st2`, kind: 'bunny-carrot', x: 84, y: 78, size: 52, rotation: -6, zIndex: 20 },
      ],
    };
  }

  // 'classic'
  return {
    id: uid,
    label: `Halaman ${pageNumStart}–${pageNumStart + 1}`,
    photos: [
      {
        id: `${uid}-p1`,
        pageSide: 'left',
        x: 16,
        y: 28,
        widthPct: 66,
        aspectRatio: '4/3',
        src: sA,
        caption: '',
        zIndex: 10,
        edits: { ...DEFAULT_PHOTO_EDITS, rotation: -2, frameStyle: 'polaroid' },
      },
      {
        id: `${uid}-p2`,
        pageSide: 'right',
        x: 50,
        y: 12,
        widthPct: 38,
        aspectRatio: '1/1',
        src: sB,
        caption: 'Love ♡',
        zIndex: 11,
        edits: { ...DEFAULT_PHOTO_EDITS, rotation: 4, frameStyle: 'polaroid' },
      },
    ],
    texts: [
      {
        id: `${uid}-t1`,
        pageSide: 'left',
        x: 14,
        y: 12,
        widthPct: 74,
        rotation: -1,
        variant: 'highlighted-title',
        tint: 'butter',
        content: 'Another Bright Page Together',
      },
      {
        id: `${uid}-t2`,
        pageSide: 'left',
        x: 14,
        y: 76,
        widthPct: 74,
        rotation: 0,
        variant: 'diary-paragraph',
        content: 'Klik foto mana saja untuk mengganti gambar atau mengatur warna & zoom.',
      },
      {
        id: `${uid}-t3`,
        pageSide: 'right',
        x: 12,
        y: 12,
        widthPct: 36,
        rotation: -3,
        variant: 'sticky-note',
        tint: 'blush',
        content: 'Sweet note ♡\nKetuk teks untuk mengubah isi catatan.',
      },
    ],
    stickers: [
      { id: `${uid}-st1`, kind: 'gingham-heart', x: 9, y: 26, size: 46, rotation: -12, zIndex: 21 },
      { id: `${uid}-st2`, kind: 'cd-lovestory', x: 80, y: 72, size: 78, rotation: 10, zIndex: 21 },
    ],
  };
}
