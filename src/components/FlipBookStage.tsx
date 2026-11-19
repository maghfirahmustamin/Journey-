import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { MomoriBook, SelectedElement } from '../types/momori';
import { BookSpreadView } from './BookSpreadView';

interface FlipBookStageProps {
  book: MomoriBook;
  /** 0 = Front Cover, 1..spreads.length = Spreads, spreads.length + 1 = Back Cover */
  currentPageIndex: number;
  direction: 1 | -1;
  isEditMode: boolean;
  selected: SelectedElement;
  onChangePage: (nextIndex: number) => void;
  onSelect: (sel: SelectedElement) => void;
  onReplacePhoto: (spreadId: string | 'cover', photoId: string, newSrc: string) => void;
  onUpdateStickerPos: (spreadId: string, stickerId: string, x: number, y: number) => void;
  onAddSpreadModal: () => void;
}

const BACKDROP_STYLES: Record<MomoriBook['backdrop'], string> = {
  linen: 'bg-[#e9e4dc]',
  'milan-street':
    'bg-gradient-to-b from-[#6ea6df] via-[#bfd8ef] to-[#d6d0c7]',
  'warm-desk':
    'bg-gradient-to-br from-[#e2d6c4] via-[#ede5d8] to-[#d8cbb8]',
  twilight:
    'bg-gradient-to-b from-[#1f2430] via-[#2b303f] to-[#1c1f29]',
};

export const FlipBookStage: React.FC<FlipBookStageProps> = ({
  book,
  currentPageIndex,
  direction,
  isEditMode,
  selected,
  onChangePage,
  onSelect,
  onReplacePhoto,
  onUpdateStickerPos,
  onAddSpreadModal,
}) => {
  const totalViews = book.spreads.length + 2; // Cover + spreads + Back Cover
  const swipeStartX = useRef<number | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' && currentPageIndex < totalViews - 1) {
        onChangePage(currentPageIndex + 1);
      } else if (e.key === 'ArrowLeft' && currentPageIndex > 0) {
        onChangePage(currentPageIndex - 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentPageIndex, totalViews, onChangePage]);

  const isCover = currentPageIndex === 0;
  const isBack = currentPageIndex === totalViews - 1;
  const currentSpread =
    !isCover && !isBack ? book.spreads[currentPageIndex - 1] : undefined;

  const pageLabel = isCover
    ? 'Sampul Depan'
    : isBack
    ? 'Sampul Belakang'
    : currentSpread?.label || `Halaman ${currentPageIndex}`;

  const isDarkBackdrop = book.backdrop === 'twilight';

  return (
    <div
      className={`relative flex-1 flex flex-col justify-between min-h-[540px] lg:min-h-[640px] px-3 sm:px-8 py-5 sm:py-7 transition-colors duration-300 overflow-hidden ${
        BACKDROP_STYLES[book.backdrop]
      }`}
    >
      {/* Top subtle spread indicator & swipe hint */}
      <div className="flex items-center justify-between max-w-[980px] w-full mx-auto z-10 mb-3">
        <div
          className={`flex items-center gap-2 text-xs font-medium ${
            isDarkBackdrop ? 'text-stone-300' : 'text-stone-600'
          }`}
        >
          <span className="font-mono-tabular">
            {String(currentPageIndex + 1).padStart(2, '0')} /{' '}
            {String(totalViews).padStart(2, '0')}
          </span>
          <span aria-hidden="true">·</span>
          <span>{pageLabel}</span>
        </div>
        <p
          className={`hidden sm:block text-xs ${
            isDarkBackdrop ? 'text-stone-400' : 'text-stone-500'
          }`}
        >
          {isEditMode
            ? 'Klik foto, teks, atau geser stiker untuk mengubah'
            : 'Geser atau gunakan tombol panah untuk membuka halaman'}
        </p>
      </div>

      {/* Main 3D Flipbook Stage */}
      <div
        className="relative flex-1 flex items-center justify-center book-perspective my-1"
        onPointerDown={(e) => {
          if (isEditMode) return;
          swipeStartX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (isEditMode || swipeStartX.current === null) return;
          const diff = e.clientX - swipeStartX.current;
          swipeStartX.current = null;
          if (diff < -55 && currentPageIndex < totalViews - 1) {
            onChangePage(currentPageIndex + 1);
          } else if (diff > 55 && currentPageIndex > 0) {
            onChangePage(currentPageIndex - 1);
          }
        }}
      >
        {/* Prev Page Floating Button */}
        <button
          type="button"
          aria-label="Halaman sebelumnya"
          disabled={currentPageIndex === 0}
          onClick={() => onChangePage(currentPageIndex - 1)}
          className={`hidden md:flex items-center justify-center w-11 h-11 rounded-full border shadow-md transition-all z-30 mr-3 shrink-0 cursor-pointer ${
            currentPageIndex === 0
              ? 'opacity-30 cursor-not-allowed bg-white/50 border-stone-300 text-stone-400'
              : 'bg-white/95 border-stone-200 text-stone-800 hover:bg-white hover:scale-105'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Animated Page Container */}
        <div className="relative w-full max-w-[920px] flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={currentPageIndex}
              custom={direction}
              initial={{
                opacity: 0,
                x: direction > 0 ? 70 : -70,
                rotateY: direction > 0 ? 16 : -16,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                x: 0,
                rotateY: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: direction > 0 ? -70 : 70,
                rotateY: direction > 0 ? -16 : 16,
                scale: 0.97,
              }}
              transition={{
                duration: 0.36,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ transformStyle: 'preserve-3d' }}
              className="w-full"
            >
              <BookSpreadView
                pageType={isCover ? 'cover' : isBack ? 'back' : 'spread'}
                cover={book.cover}
                spread={currentSpread}
                backCover={book.backCover}
                isEditMode={isEditMode}
                selected={selected}
                onSelect={onSelect}
                onReplacePhoto={onReplacePhoto}
                onUpdateStickerPos={onUpdateStickerPos}
                onOpenBook={() => onChangePage(1)}
                onRestartBook={() => onChangePage(0)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next Page Floating Button */}
        <button
          type="button"
          aria-label="Halaman berikutnya"
          disabled={currentPageIndex >= totalViews - 1}
          onClick={() => onChangePage(currentPageIndex + 1)}
          className={`hidden md:flex items-center justify-center w-11 h-11 rounded-full border shadow-md transition-all z-30 ml-3 shrink-0 cursor-pointer ${
            currentPageIndex >= totalViews - 1
              ? 'opacity-30 cursor-not-allowed bg-white/50 border-stone-300 text-stone-400'
              : 'bg-white/95 border-stone-200 text-stone-800 hover:bg-white hover:scale-105'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Book Scrubber / Page Strip */}
      <div className="mt-4 flex items-center justify-center gap-2 flex-wrap z-20">
        {/* Mobile arrows */}
        <button
          type="button"
          aria-label="Halaman sebelumnya"
          disabled={currentPageIndex === 0}
          onClick={() => onChangePage(currentPageIndex - 1)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/90 border border-stone-200 text-stone-800 disabled:opacity-35"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/85 backdrop-blur-sm border border-stone-200/80 shadow-sm overflow-x-auto max-w-[75vw]">
          <button
            type="button"
            onClick={() => onChangePage(0)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentPageIndex === 0
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Sampul
          </button>

          {book.spreads.map((sp, idx) => {
            const targetIdx = idx + 1;
            const active = currentPageIndex === targetIdx;
            return (
              <button
                key={sp.id}
                type="button"
                onClick={() => onChangePage(targetIdx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {idx * 2 + 1}–{idx * 2 + 2}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => onChangePage(totalViews - 1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentPageIndex === totalViews - 1
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Penutup
          </button>

          <button
            type="button"
            onClick={onAddSpreadModal}
            title="Tambah halaman baru"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Halaman</span>
          </button>
        </div>

        {/* Mobile next arrow */}
        <button
          type="button"
          aria-label="Halaman berikutnya"
          disabled={currentPageIndex >= totalViews - 1}
          onClick={() => onChangePage(currentPageIndex + 1)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/90 border border-stone-200 text-stone-800 disabled:opacity-35"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
