import React from 'react';
import {
  ImagePlus,
  RotateCcw,
  Trash2,
  Type,
  Smile,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';
import {
  BackdropTheme,
  BookCover,
  BookSpread,
  FrameStyle,
  NoteTint,
  PhotoEdits,
  PhotoSlot,
  SelectedElement,
  StickerItem,
  StickerKind,
  TextBlock,
} from '../types/momori';
import { DEFAULT_PHOTO_EDITS, FILTER_PRESETS } from '../data/defaultBook';
import { compressImageFile, getSamplePhotos } from '../utils/samplePhotos';
import { STICKER_CATALOG, StickerGraphic } from './ScrapbookStickers';

interface PhotoEditorPanelProps {
  selected: SelectedElement;
  cover: BookCover;
  currentSpread?: BookSpread;
  backdrop: BackdropTheme;
  canDeleteSpread: boolean;
  onSelect: (sel: SelectedElement) => void;
  onUpdatePhoto: (spreadId: string | 'cover', photoId: string, updater: (p: PhotoSlot) => PhotoSlot) => void;
  onUpdateText: (spreadId: string, textId: string, updater: (t: TextBlock) => TextBlock) => void;
  onUpdateSticker: (spreadId: string, stickerId: string, updater: (s: StickerItem) => StickerItem) => void;
  onAddSticker: (spreadId: string, kind: StickerKind) => void;
  onDeleteSticker: (spreadId: string, stickerId: string) => void;
  onUpdateCoverMeta: (patch: Partial<Pick<BookCover, 'title' | 'subtitle' | 'dateLabel'>>) => void;
  onChangeBackdrop: (backdrop: BackdropTheme) => void;
  onDeleteSpread: (spreadId: string) => void;
}

const SliderRow: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}> = ({ label, value, min, max, step = 1, unit = '', onChange }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-xs">
      <span className="text-stone-600 font-medium">{label}</span>
      <span className="font-mono-tabular text-stone-800">
        {value}
        {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-rose-600 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
    />
  </div>
);

export const PhotoEditorPanel: React.FC<PhotoEditorPanelProps> = ({
  selected,
  cover,
  currentSpread,
  backdrop,
  canDeleteSpread,
  onSelect,
  onUpdatePhoto,
  onUpdateText,
  onUpdateSticker,
  onAddSticker,
  onDeleteSticker,
  onUpdateCoverMeta,
  onChangeBackdrop,
  onDeleteSpread,
}) => {
  const samplePhotos = getSamplePhotos();

  // Resolve selected photo
  let activePhoto: PhotoSlot | undefined;
  let activePhotoSpreadId: string | 'cover' | undefined;
  if (selected?.type === 'photo') {
    if (selected.spreadId === 'cover') {
      activePhoto = cover.photo;
      activePhotoSpreadId = 'cover';
    } else if (currentSpread && currentSpread.id === selected.spreadId) {
      activePhoto = currentSpread.photos.find((p) => p.id === selected.photoId);
      activePhotoSpreadId = currentSpread.id;
    }
  }

  // Resolve selected text
  const activeText =
    selected?.type === 'text' && currentSpread?.id === selected.spreadId
      ? currentSpread.texts.find((t) => t.id === selected.textId)
      : undefined;

  // Resolve selected sticker
  const activeSticker =
    selected?.type === 'sticker' && currentSpread?.id === selected.spreadId
      ? currentSpread.stickers.find((s) => s.id === selected.stickerId)
      : undefined;

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activePhoto || !activePhotoSpreadId) return;
    try {
      const compressed = await compressImageFile(file);
      onUpdatePhoto(activePhotoSpreadId, activePhoto.id, (p) => ({
        ...p,
        src: compressed,
      }));
    } catch {
      // ignore invalid
    }
    e.target.value = '';
  };

  return (
    <aside className="w-full lg:w-[340px] shrink-0 bg-white border-t lg:border-t-0 lg:border-l border-stone-200 flex flex-col max-h-[55vh] lg:max-h-[calc(100vh-65px)] overflow-y-auto">
      <div className="p-5 space-y-6">
        {/* PHOTO EDITOR VIEW */}
        {activePhoto && activePhotoSpreadId && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-rose-600" />
                <h2 className="text-sm font-semibold text-stone-900">Edit & Ganti Foto</h2>
              </div>
              <button
                type="button"
                onClick={() => onSelect(null)}
                className="text-xs text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                Tutup
              </button>
            </div>

            {/* Upload / Replace Photo */}
            <div className="space-y-2.5">
              <label className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer">
                <ImagePlus className="w-4 h-4" />
                <span>Unggah Foto dari Perangkat</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadPhoto}
                  className="hidden"
                />
              </label>

              <div>
                <p className="text-[11px] font-medium text-stone-500 mb-1.5">
                  Atau pilih foto contoh:
                </p>
                <div className="grid grid-cols-6 gap-1.5">
                  {samplePhotos.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      title={sample.label}
                      onClick={() =>
                        onUpdatePhoto(activePhotoSpreadId!, activePhoto!.id, (p) => ({
                          ...p,
                          src: sample.src,
                        }))
                      }
                      className={`aspect-square rounded-md overflow-hidden border transition-all cursor-pointer ${
                        activePhoto.src === sample.src
                          ? 'border-rose-600 ring-2 ring-rose-500/30'
                          : 'border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <img
                        src={sample.src}
                        alt={sample.label}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Presets */}
            <div className="space-y-2 pt-3 border-t border-stone-100">
              <p className="text-xs font-semibold text-stone-800">Preset Warna</p>
              <div className="grid grid-cols-3 gap-1.5">
                {FILTER_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() =>
                      onUpdatePhoto(activePhotoSpreadId!, activePhoto!.id, (p) => ({
                        ...p,
                        edits: {
                          ...p.edits,
                          preset: preset.id,
                          ...preset.values,
                        },
                      }))
                    }
                    className={`px-2 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                      activePhoto.edits.preset === preset.id
                        ? 'bg-rose-50 border-rose-500 text-rose-700'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Sliders */}
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-stone-800">Penyesuaian Cahaya & Warna</p>
                <button
                  type="button"
                  onClick={() =>
                    onUpdatePhoto(activePhotoSpreadId!, activePhoto!.id, (p) => ({
                      ...p,
                      edits: {
                        ...DEFAULT_PHOTO_EDITS,
                        rotation: p.edits.rotation,
                        frameStyle: p.edits.frameStyle,
                      },
                    }))
                  }
                  className="inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-900 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
              <SliderRow
                label="Kecerahan"
                value={activePhoto.edits.brightness}
                min={50}
                max={150}
                unit="%"
                onChange={(val) =>
                  onUpdatePhoto(activePhotoSpreadId!, activePhoto!.id, (p) => ({
                    ...p,
                    edits: { ...p.edits, brightness: val },
                  }))
                }
              />
              <SliderRow
                label="Kontras"
                value={activePhoto.edits.contrast}
                min={50}
                max={150}
                unit="%"
                onChange={(val) =>
                  onUpdatePhoto(activePhotoSpreadId!, activePhoto!.id, (p) => ({
                    ...p,
                    edits: { ...p.edits, contrast: val },
                  }))
                }
              />
              <SliderRow
                label="Saturasi"
                value={activePhoto.edits.saturate}
                min={0}
                max={180}
                unit="%"
                onChange={(val) =>
                  onUpdatePhoto(activePhotoSpreadId!, activePhoto!.id, (p) => ({
                    ...p,
                    edits: { ...p.edits, saturate: val },
                  }))
                }
              />
              <SliderRow
                label="Hangat / Sepia"
                value={activePhoto.edits.sepia}
                min={0}
                max={100}
                unit="%"
                onChange={(val) =>
                  onUpdatePhoto(activePhotoSpreadId!, activePhoto!.id, (p) => ({
                    ...p,
                    edits: { ...p.edits, sepia: val },
                  }))
                }
              />
            </div>

            {/* Crop, Zoom, Tilt */}
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <p className="text-xs font-semibold text-stone-800">Zoom, Posisi & Kemiringan</p>
              <SliderRow
                label="Zoom"
                value={Number(activePhoto.edits.zoom.toFixed(2))}
                min={1}
                max={2.4}
                step={0.05}
                unit="x"
                onChange={(val) =>
                  onUpdatePhoto(activePhotoSpreadId!, activePhoto!.id, (p) => ({
                    ...p,
                    edits: { ...p.edits, zoom: val },
                  }))
                }
              />
              <SliderRow
                label="Geser Horizontal"
                value={activePhoto.edits.panX}
                min={-35}
                max={35}
                unit="%"
                onChange={(val) =>
                  onUpdatePhoto(activePhotoSpreadId!, activePhoto!.id, (p) => ({
                    ...p,
                    edits: { ...p.edits, panX: val },
                  }))
                }
              />
              <SliderRow
                label="Geser Vertikal"
                value={activePhoto.edits.panY}
                min={-35}
                max={35}
                unit="%"
                onChange={(val) =>
                  onUpdatePhoto(activePhotoSpreadId!, activePhoto!.id, (p) => ({
                    ...p,
                    edits: { ...p.edits, panY: val },
                  }))
                }
              />
              <SliderRow
                label="Putar Bingkai"
                value={activePhoto.edits.rotation}
                min={-15}
                max={15}
                unit="°"
                onChange={(val) =>
                  onUpdatePhoto(activePhotoSpreadId!, activePhoto!.id, (p) => ({
                    ...p,
                    edits: { ...p.edits, rotation: val },
                  }))
                }
              />
            </div>

            {/* Frame Style & Caption */}
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <p className="text-xs font-semibold text-stone-800">Gaya Bingkai & Catatan</p>
              <div className="grid grid-cols-4 gap-1.5">
                {(['polaroid', 'taped', 'rounded', 'stamp'] as FrameStyle[]).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() =>
                      onUpdatePhoto(activePhotoSpreadId!, activePhoto!.id, (p) => ({
                        ...p,
                        edits: { ...p.edits, frameStyle: style },
                      }))
                    }
                    className={`py-1.5 px-2 rounded-md text-xs font-medium capitalize border transition-colors cursor-pointer ${
                      activePhoto.edits.frameStyle === style
                        ? 'bg-stone-900 border-stone-900 text-white'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">
                  Teks di bawah foto (Caption)
                </label>
                <input
                  type="text"
                  value={activePhoto.caption || ''}
                  placeholder="Contoh: Love ♡♡"
                  onChange={(e) =>
                    onUpdatePhoto(activePhotoSpreadId!, activePhoto!.id, (p) => ({
                      ...p,
                      caption: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                />
              </div>
            </div>
          </div>
        )}

        {/* TEXT EDITOR VIEW */}
        {activeText && currentSpread && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-rose-600" />
                <h2 className="text-sm font-semibold text-stone-900">Edit Teks & Catatan</h2>
              </div>
              <button
                type="button"
                onClick={() => onSelect(null)}
                className="text-xs text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">
                Isi Tulisan
              </label>
              <textarea
                rows={4}
                value={activeText.content}
                onChange={(e) =>
                  onUpdateText(currentSpread.id, activeText.id, (t) => ({
                    ...t,
                    content: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
              />
            </div>

            {(activeText.variant === 'sticky-note' ||
              activeText.variant === 'highlighted-title' ||
              activeText.variant === 'caption-hand') && (
              <div>
                <p className="text-xs font-medium text-stone-600 mb-1.5">Warna Kertas / Stabilo</p>
                <div className="flex items-center gap-2">
                  {(
                    [
                      { id: 'sky', bg: 'bg-[#cbe0f7]', label: 'Biru' },
                      { id: 'butter', bg: 'bg-[#fef3b8]', label: 'Kuning' },
                      { id: 'blush', bg: 'bg-[#fad7e2]', label: 'Pink' },
                      { id: 'mint', bg: 'bg-[#d5f0de]', label: 'Mint' },
                      { id: 'cream', bg: 'bg-[#efe9dc]', label: 'Krem' },
                    ] as Array<{ id: NoteTint; bg: string; label: string }>
                  ).map((tint) => (
                    <button
                      key={tint.id}
                      type="button"
                      title={tint.label}
                      onClick={() =>
                        onUpdateText(currentSpread.id, activeText.id, (t) => ({
                          ...t,
                          tint: tint.id,
                        }))
                      }
                      className={`w-7 h-7 rounded-full border cursor-pointer ${tint.bg} ${
                        activeText.tint === tint.id
                          ? 'ring-2 ring-rose-600 ring-offset-2 border-stone-400'
                          : 'border-stone-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <SliderRow
              label="Kemiringan Teks"
              value={activeText.rotation}
              min={-10}
              max={10}
              step={0.5}
              unit="°"
              onChange={(val) =>
                onUpdateText(currentSpread.id, activeText.id, (t) => ({
                  ...t,
                  rotation: val,
                }))
              }
            />
          </div>
        )}

        {/* STICKER EDITOR VIEW */}
        {activeSticker && currentSpread && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-rose-600" />
                <h2 className="text-sm font-semibold text-stone-900">Edit Stiker</h2>
              </div>
              <button
                type="button"
                onClick={() => onSelect(null)}
                className="text-xs text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="flex items-center justify-center py-4 bg-stone-50 rounded-xl border border-stone-100">
              <div className="w-20 h-20">
                <StickerGraphic kind={activeSticker.kind} />
              </div>
            </div>

            <SliderRow
              label="Ukuran Stiker"
              value={activeSticker.size}
              min={28}
              max={130}
              unit="px"
              onChange={(val) =>
                onUpdateSticker(currentSpread.id, activeSticker.id, (s) => ({
                  ...s,
                  size: val,
                }))
              }
            />
            <SliderRow
              label="Putar Stiker"
              value={activeSticker.rotation}
              min={-45}
              max={45}
              unit="°"
              onChange={(val) =>
                onUpdateSticker(currentSpread.id, activeSticker.id, (s) => ({
                  ...s,
                  rotation: val,
                }))
              }
            />

            <button
              type="button"
              onClick={() => {
                onDeleteSticker(currentSpread.id, activeSticker.id);
                onSelect(null);
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Stiker Ini</span>
            </button>
          </div>
        )}

        {/* COVER META EDITOR */}
        {selected?.type === 'cover-meta' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-stone-900">Edit Sampul Buku</h2>
              <button
                type="button"
                onClick={() => onSelect(null)}
                className="text-xs text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                Tutup
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Judul Sampul
              </label>
              <input
                type="text"
                value={cover.title}
                onChange={(e) => onUpdateCoverMeta({ title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Subjudul
              </label>
              <input
                type="text"
                value={cover.subtitle}
                onChange={(e) => onUpdateCoverMeta({ subtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Tanggal / Kota
              </label>
              <input
                type="text"
                value={cover.dateLabel}
                onChange={(e) => onUpdateCoverMeta({ dateLabel: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
              />
            </div>
          </div>
        )}

        {/* DEFAULT OVERVIEW WHEN NOTHING SPECIFIC IS SELECTED */}
        {!activePhoto && !activeText && !activeSticker && selected?.type !== 'cover-meta' && (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-600" />
              <h2 className="text-sm font-semibold text-stone-900">Alat Halaman Momori</h2>
            </div>

            {currentSpread ? (
              <>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-stone-700">
                    Foto di Halaman Ini (Klik untuk edit)
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {currentSpread.photos.map((photo, idx) => (
                      <button
                        key={photo.id}
                        type="button"
                        onClick={() =>
                          onSelect({
                            type: 'photo',
                            spreadId: currentSpread.id,
                            photoId: photo.id,
                          })
                        }
                        className="group relative aspect-square rounded-lg overflow-hidden border border-stone-200 hover:border-rose-500 transition-colors cursor-pointer"
                      >
                        <img
                          src={photo.src}
                          alt={`Foto ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-stone-900/75 text-white text-[10px] font-mono-tabular">
                          {idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sticker Tray */}
                <div className="space-y-2 pt-3 border-t border-stone-100">
                  <p className="text-xs font-semibold text-stone-700">
                    Tambah Stiker ke Halaman
                  </p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {STICKER_CATALOG.map((item) => (
                      <button
                        key={item.kind}
                        type="button"
                        title={`Tambah ${item.label}`}
                        onClick={() => onAddSticker(currentSpread.id, item.kind)}
                        className="flex flex-col items-center justify-center p-2 rounded-lg border border-stone-200 hover:border-rose-400 hover:bg-rose-50/40 transition-colors cursor-pointer"
                      >
                        <div className="w-8 h-8">
                          <StickerGraphic kind={item.kind} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {canDeleteSpread && (
                  <div className="pt-3 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => onDeleteSpread(currentSpread.id)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-stone-200 text-stone-600 hover:text-rose-700 hover:border-rose-200 hover:bg-rose-50 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Halaman Ini</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs text-stone-500 leading-relaxed">
                Klik foto atau teks di sampul untuk mengganti gambar, mengatur filter warna, dan
                mengubah judul buku kenanganmu.
              </p>
            )}

            {/* Backdrop Theme Selector */}
            <div className="space-y-2 pt-3 border-t border-stone-100">
              <p className="text-xs font-semibold text-stone-700">Latar Meja / Suasana</p>
              <div className="grid grid-cols-2 gap-1.5">
                {(
                  [
                    { id: 'linen', label: 'Linen Hangat' },
                    { id: 'milan-street', label: 'Langit Cerah' },
                    { id: 'warm-desk', label: 'Kertas Kraft' },
                    { id: 'twilight', label: 'Meja Malam' },
                  ] as Array<{ id: BackdropTheme; label: string }>
                ).map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => onChangeBackdrop(bg.id)}
                    className={`py-1.5 px-2.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                      backdrop === bg.id
                        ? 'bg-stone-900 border-stone-900 text-white'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
