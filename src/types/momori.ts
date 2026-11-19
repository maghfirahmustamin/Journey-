export type FrameStyle = 'polaroid' | 'taped' | 'rounded' | 'stamp';

export type FilterPresetId =
  | 'original'
  | 'warm-film'
  | 'vintage-sepia'
  | 'soft-pastel'
  | 'bw-classic'
  | 'cool-breeze';

export interface PhotoEdits {
  brightness: number; // 50 - 150 (100 default)
  contrast: number;   // 50 - 150 (100 default)
  saturate: number;   // 0 - 180 (100 default)
  sepia: number;      // 0 - 100 (0 default)
  zoom: number;       // 1 - 2.4 (1 default)
  panX: number;       // -50 - 50 (0 default)
  panY: number;       // -50 - 50 (0 default)
  rotation: number;   // -15 - 15 degrees
  frameStyle: FrameStyle;
  preset: FilterPresetId;
}

export interface PhotoSlot {
  id: string;
  pageSide: 'left' | 'right' | 'cover';
  /** Percentage position inside its half-page (0-100) */
  x: number;
  y: number;
  /** Width percentage relative to its half-page */
  widthPct: number;
  aspectRatio: '4/3' | '1/1' | '3/4' | '16/10';
  src: string;
  caption?: string;
  zIndex: number;
  edits: PhotoEdits;
}

export type TextBlockVariant =
  | 'highlighted-title'
  | 'diary-paragraph'
  | 'sticky-note'
  | 'ripped-quote'
  | 'caption-hand';

export type NoteTint = 'sky' | 'butter' | 'blush' | 'mint' | 'cream';

export interface TextBlock {
  id: string;
  pageSide: 'left' | 'right';
  x: number;
  y: number;
  widthPct: number;
  rotation: number;
  variant: TextBlockVariant;
  tint?: NoteTint;
  content: string;
  /** Optional words inside paragraph to highlight (comma-separated or specific) */
  accentWord?: string;
  underlineWord?: string;
}

export type StickerKind =
  | 'cheers-love'
  | 'gingham-heart'
  | 'dual-hearts'
  | 'bunny-carrot'
  | 'cd-lovestory'
  | 'digicam'
  | 'butterfly'
  | 'sparkles'
  | 'cat-doodle'
  | 'exclaim-doodle'
  | 'glass-heart'
  | 'peach-heart';

export interface StickerItem {
  id: string;
  kind: StickerKind;
  /** Percentage coordinates across full spread (0-100) */
  x: number;
  y: number;
  size: number; // px reference at 900px spread width
  rotation: number;
  zIndex: number;
}

export interface BookSpread {
  id: string;
  label: string;
  leftTitle?: string;
  photos: PhotoSlot[];
  texts: TextBlock[];
  stickers: StickerItem[];
}

export interface BookCover {
  title: string;
  subtitle: string;
  dateLabel: string;
  coverColor: string;
  photo: PhotoSlot;
}

export interface BackCover {
  quote: string;
  signature: string;
  year: string;
}

export type BackdropTheme = 'linen' | 'milan-street' | 'warm-desk' | 'twilight';

export interface MomoriBook {
  id: string;
  bookName: string;
  backdrop: BackdropTheme;
  cover: BookCover;
  spreads: BookSpread[];
  backCover: BackCover;
  updatedAt: string;
}

export type SelectedElement =
  | { type: 'photo'; spreadId: string | 'cover'; photoId: string }
  | { type: 'text'; spreadId: string; textId: string }
  | { type: 'sticker'; spreadId: string; stickerId: string }
  | { type: 'cover-meta' }
  | null;
