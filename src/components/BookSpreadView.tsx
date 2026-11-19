import React, { useRef } from 'react';
import {
  BackCover,
  BookCover,
  BookSpread,
  NoteTint,
  SelectedElement,
  StickerItem,
  TextBlock,
} from '../types/momori';
import { PhotoFrame } from './PhotoFrame';
import { StickerGraphic } from './ScrapbookStickers';

interface BookSpreadViewProps {
  pageType: 'cover' | 'spread' | 'back';
  cover?: BookCover;
  spread?: BookSpread;
  backCover?: BackCover;
  isEditMode: boolean;
  selected: SelectedElement;
  onSelect: (sel: SelectedElement) => void;
  onReplacePhoto: (spreadId: string | 'cover', photoId: string, newSrc: string) => void;
  onUpdateStickerPos: (spreadId: string, stickerId: string, x: number, y: number) => void;
  onOpenBook?: () => void;
  onRestartBook?: () => void;
}

const NOTE_TINT_CLASSES: Record<NoteTint, string> = {
  sky: 'bg-[#cbe0f7]',
  butter: 'bg-[#fef3b8]',
  blush: 'bg-[#fad7e2]',
  mint: 'bg-[#d5f0de]',
  cream: 'bg-[#efe9dc]',
};

const HIGHLIGHT_TINT_HEX: Record<NoteTint, string> = {
  sky: 'rgba(186, 220, 252, 0.72)',
  butter: 'rgba(254, 240, 138, 0.72)',
  blush: 'rgba(251, 207, 232, 0.75)',
  mint: 'rgba(187, 247, 208, 0.72)',
  cream: 'rgba(231, 224, 210, 0.78)',
};

function renderFormattedDiary(block: TextBlock) {
  let parts: React.ReactNode[] = [block.content];

  if (block.accentWord && block.content.includes(block.accentWord)) {
    const split = block.content.split(block.accentWord);
    parts = [];
    split.forEach((segment, idx) => {
      parts.push(segment);
      if (idx < split.length - 1) {
        parts.push(
          <span
            key={`accent-${idx}`}
            className="relative inline-block px-1.5 mx-0.5 rounded-[999px] border-2 border-rose-400/75"
          >
            {block.accentWord}
          </span>
        );
      }
    });
  }

  if (block.underlineWord) {
    const nextParts: React.ReactNode[] = [];
    parts.forEach((node, idx) => {
      if (typeof node === 'string' && node.includes(block.underlineWord!)) {
        const split = node.split(block.underlineWord!);
        split.forEach((seg, sIdx) => {
          nextParts.push(seg);
          if (sIdx < split.length - 1) {
            nextParts.push(
              <span
                key={`ul-${idx}-${sIdx}`}
                className="underline decoration-emerald-600/65 decoration-2 underline-offset-4"
              >
                {block.underlineWord}
              </span>
            );
          }
        });
      } else {
        nextParts.push(node);
      }
    });
    parts = nextParts;
  }

  return parts;
}

export const BookSpreadView: React.FC<BookSpreadViewProps> = ({
  pageType,
  cover,
  spread,
  backCover,
  isEditMode,
  selected,
  onSelect,
  onReplacePhoto,
  onUpdateStickerPos,
  onOpenBook,
  onRestartBook,
}) => {
  const spreadContainerRef = useRef<HTMLDivElement>(null);

  const handleStickerPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    spreadId: string,
    sticker: StickerItem
  ) => {
    if (!isEditMode) return;
    e.stopPropagation();
    onSelect({ type: 'sticker', spreadId, stickerId: sticker.id });

    const container = spreadContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = sticker.x;
    const origY = sticker.y;

    const onMove = (moveEvt: PointerEvent) => {
      const dxPct = ((moveEvt.clientX - startX) / rect.width) * 100;
      const dyPct = ((moveEvt.clientY - startY) / rect.height) * 100;
      const clampedX = Math.max(0, Math.min(92, origX + dxPct));
      const clampedY = Math.max(0, Math.min(90, origY + dyPct));
      onUpdateStickerPos(spreadId, sticker.id, clampedX, clampedY);
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // FRONT COVER
  if (pageType === 'cover' && cover) {
    const isCoverPhotoSelected =
      selected?.type === 'photo' &&
      selected.spreadId === 'cover' &&
      selected.photoId === cover.photo.id;

    return (
      <div
        onClick={() => isEditMode && onSelect({ type: 'cover-meta' })}
        className="relative w-full max-w-[460px] sm:max-w-[500px] aspect-[4/5] mx-auto momori-paper rounded-l-md rounded-r-3xl shadow-[0_24px_60px_rgba(28,25,23,0.22),0_4px_12px_rgba(28,25,23,0.08)] border border-stone-300/60 overflow-hidden select-none"
      >
        {/* Hardcover Spine Binding Left */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-7 bg-gradient-to-r from-stone-400/35 via-stone-300/20 to-transparent border-r border-stone-400/25 pointer-events-none z-20"
        />

        <div className="relative w-full h-full pl-9 pr-7 py-8 flex flex-col justify-between">
          {/* Header date & title */}
          <div className="text-center space-y-1.5 z-10">
            <p className="font-mono-tabular text-[11px] tracking-widest uppercase text-stone-500">
              {cover.dateLabel}
            </p>
            <h2 className="font-hand text-3xl sm:text-4xl font-bold text-stone-900 leading-tight px-2">
              <span className="bg-[#fef08a]/75 px-2.5 py-0.5 rounded-sm inline-block -rotate-1">
                {cover.title}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xs mx-auto">
              {cover.subtitle}
            </p>
          </div>

          {/* Center Cover Photo */}
          <div className="relative flex-1 my-4">
            <PhotoFrame
              photo={{ ...cover.photo, x: 16, y: 8, widthPct: 68 }}
              isEditMode={isEditMode}
              isSelected={isCoverPhotoSelected}
              onSelect={() =>
                onSelect({ type: 'photo', spreadId: 'cover', photoId: cover.photo.id })
              }
              onReplaceFile={(newSrc) =>
                onReplacePhoto('cover', cover.photo.id, newSrc)
              }
            />
          </div>

          {/* Bottom Open Book Prompt */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-300/60 z-10">
            <span className="font-hand text-lg text-stone-600">
              Momori Scrapbook Edition
            </span>
            {!isEditMode && onOpenBook && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenBook();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                Buka Buku →
              </button>
            )}
            {isEditMode && (
              <span className="text-[11px] font-medium text-rose-600">
                Klik foto / judul untuk edit
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // BACK COVER
  if (pageType === 'back' && backCover) {
    return (
      <div className="relative w-full max-w-[460px] sm:max-w-[500px] aspect-[4/5] mx-auto momori-paper rounded-r-md rounded-l-3xl shadow-[0_24px_60px_rgba(28,25,23,0.22),0_4px_12px_rgba(28,25,23,0.08)] border border-stone-300/60 overflow-hidden flex flex-col items-center justify-center p-10 text-center select-none">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-7 bg-gradient-to-l from-stone-400/35 via-stone-300/20 to-transparent border-l border-stone-400/25 pointer-events-none"
        />
        <div className="w-14 h-14 mb-5 opacity-90">
          <StickerGraphic kind="gingham-heart" />
        </div>
        <p className="font-hand text-2xl sm:text-3xl text-stone-800 leading-snug max-w-xs mb-6">
          “{backCover.quote}”
        </p>
        <p className="font-mono-tabular text-xs text-stone-500 mb-6">
          {backCover.signature} · {backCover.year}
        </p>
        {onRestartBook && (
          <button
            type="button"
            onClick={onRestartBook}
            className="px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
          >
            ← Kembali ke Sampul Depan
          </button>
        )}
      </div>
    );
  }

  // TWO-PAGE OPEN SPREAD
  if (!spread) return null;

  const renderPageHalf = (side: 'left' | 'right') => {
    const photos = spread.photos.filter((p) => p.pageSide === side);
    const texts = spread.texts.filter((t) => t.pageSide === side);

    return (
      <div className="relative w-1/2 h-full overflow-hidden">
        {/* Photos on this half */}
        {photos.map((photo) => {
          const isSelected =
            selected?.type === 'photo' &&
            selected.spreadId === spread.id &&
            selected.photoId === photo.id;
          return (
            <PhotoFrame
              key={photo.id}
              photo={photo}
              isEditMode={isEditMode}
              isSelected={isSelected}
              onSelect={() =>
                onSelect({ type: 'photo', spreadId: spread.id, photoId: photo.id })
              }
              onReplaceFile={(newSrc) =>
                onReplacePhoto(spread.id, photo.id, newSrc)
              }
            />
          );
        })}

        {/* Text blocks on this half */}
        {texts.map((block) => {
          const isTextSelected =
            selected?.type === 'text' &&
            selected.spreadId === spread.id &&
            selected.textId === block.id;

          return (
            <div
              key={block.id}
              style={{
                left: `${block.x}%`,
                top: `${block.y}%`,
                width: `${block.widthPct}%`,
                transform: `rotate(${block.rotation}deg)`,
              }}
              onClick={(e) => {
                if (!isEditMode) return;
                e.stopPropagation();
                onSelect({ type: 'text', spreadId: spread.id, textId: block.id });
              }}
              className={`absolute z-20 transition-shadow ${
                isEditMode ? 'cursor-pointer hover:ring-2 hover:ring-rose-400/60 rounded-sm' : ''
              } ${
                isTextSelected && isEditMode
                  ? 'ring-2 ring-rose-600 ring-offset-2 ring-offset-[#f3efe7] rounded-sm'
                  : ''
              }`}
            >
              {block.variant === 'highlighted-title' && (
                <h3
                  className="font-hand font-bold text-stone-900 text-center leading-tight px-2 py-0.5 text-[clamp(14px,2.1vw,25px)]"
                  style={{
                    background: `linear-gradient(104deg, transparent 2%, ${
                      HIGHLIGHT_TINT_HEX[block.tint || 'butter']
                    } 6%, ${HIGHLIGHT_TINT_HEX[block.tint || 'butter']} 95%, transparent 99%)`,
                  }}
                >
                  {block.content}
                </h3>
              )}

              {block.variant === 'diary-paragraph' && (
                <p className="font-hand text-stone-800 text-center leading-[1.28] text-[clamp(11px,1.5vw,18px)]">
                  {renderFormattedDiary(block)}
                </p>
              )}

              {block.variant === 'sticky-note' && (
                <div className="relative">
                  {/* Top-left & Bottom-right Washi Tapes */}
                  <div
                    aria-hidden="true"
                    className="absolute -top-2 -left-2 w-8 sm:w-11 h-3 sm:h-4 bg-stone-500/45 -rotate-[32deg] z-10 pointer-events-none"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute -bottom-2 -right-2 w-8 sm:w-11 h-3 sm:h-4 bg-stone-500/45 -rotate-[32deg] z-10 pointer-events-none"
                  />
                  <div
                    className={`torn-note px-3 py-3 sm:px-4 sm:py-4 shadow-sm ${
                      NOTE_TINT_CLASSES[block.tint || 'sky']
                    }`}
                  >
                    <p className="font-hand text-stone-800 text-center whitespace-pre-line leading-[1.2] text-[clamp(10px,1.45vw,17px)]">
                      {block.content}
                    </p>
                  </div>
                </div>
              )}

              {block.variant === 'ripped-quote' && (
                <div className="flex flex-col items-center gap-0.5">
                  {block.content.split('\n').map((line, i) => (
                    <span
                      key={i}
                      className="ripped-strip bg-[#e8e1d3] px-2.5 py-0.5 font-hand font-semibold text-stone-800 text-center shadow-[0_1px_2px_rgba(0,0,0,0.06)] text-[clamp(9.5px,1.3vw,15px)] leading-tight"
                    >
                      {line}
                    </span>
                  ))}
                </div>
              )}

              {block.variant === 'caption-hand' && (
                <div className="px-1 py-0.5 text-center">
                  <p
                    className="font-hand font-semibold text-stone-800 leading-[1.2] text-[clamp(9.5px,1.25vw,14.5px)] inline box-decoration-clone px-1"
                    style={{
                      backgroundColor: HIGHLIGHT_TINT_HEX[block.tint || 'sky'],
                    }}
                  >
                    {block.content}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      ref={spreadContainerRef}
      onClick={() => isEditMode && onSelect(null)}
      className="relative w-full max-w-[920px] aspect-[3/2] mx-auto momori-paper rounded-2xl sm:rounded-[26px] shadow-[0_24px_64px_rgba(28,25,23,0.22),0_4px_14px_rgba(28,25,23,0.08)] border border-stone-300/70 select-none overflow-visible"
    >
      {/* Inner clipped layer for pages & spine */}
      <div className="relative w-full h-full flex rounded-2xl sm:rounded-[26px] overflow-hidden">
        {renderPageHalf('left')}

        {/* Center Book Spine Shadow */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 sm:w-14 momori-spine-shadow pointer-events-none z-20"
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-stone-500/15 pointer-events-none z-20"
        />

        {renderPageHalf('right')}
      </div>

      {/* Stickers Layer (can gently overlap edge just like the reference!) */}
      {spread.stickers.map((sticker) => {
        const isStickerSelected =
          selected?.type === 'sticker' &&
          selected.spreadId === spread.id &&
          selected.stickerId === sticker.id;

        return (
          <div
            key={sticker.id}
            style={{
              left: `${sticker.x}%`,
              top: `${sticker.y}%`,
              width: `${(sticker.size / 920) * 100}%`,
              zIndex: isStickerSelected ? 45 : sticker.zIndex,
              transform: `rotate(${sticker.rotation}deg)`,
            }}
            onPointerDown={(e) => handleStickerPointerDown(e, spread.id, sticker)}
            onClick={(e) => {
              if (!isEditMode) return;
              e.stopPropagation();
              onSelect({ type: 'sticker', spreadId: spread.id, stickerId: sticker.id });
            }}
            className={`absolute aspect-square transition-shadow ${
              isEditMode
                ? 'cursor-grab active:cursor-grabbing hover:scale-105'
                : 'pointer-events-none'
            } ${
              isStickerSelected && isEditMode
                ? 'ring-2 ring-rose-600 rounded-lg bg-rose-500/5'
                : ''
            }`}
          >
            <StickerGraphic kind={sticker.kind} />
          </div>
        );
      })}
    </div>
  );
};
