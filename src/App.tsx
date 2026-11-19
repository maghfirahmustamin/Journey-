/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import {
  BackdropTheme,
  BookCover,
  MomoriBook,
  PhotoSlot,
  SelectedElement,
  StickerItem,
  StickerKind,
  TextBlock,
} from './types/momori';
import { createDefaultBook, createNewSpread } from './data/defaultBook';
import { FlipBookStage } from './components/FlipBookStage';
import { PhotoEditorPanel } from './components/PhotoEditorPanel';
import { SaveExportModal } from './components/SaveExportModal';
import { AddSpreadModal } from './components/AddSpreadModal';

const STORAGE_KEY = 'momori_scrapbook_v1';

function loadInitialBook(): MomoriBook {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as MomoriBook;
      if (parsed && parsed.cover && Array.isArray(parsed.spreads) && parsed.spreads.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback to default book
  }
  return createDefaultBook();
}

export default function App() {
  const [book, setBook] = useState<MomoriBook>(() => loadInitialBook());
  // Start open on Spread 1 so the 2-page Momori scrapbook has immediate hero presence
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [selected, setSelected] = useState<SelectedElement>(null);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showReferenceModal, setShowReferenceModal] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const persistBook = useCallback((nextBook: MomoriBook) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBook));
    } catch {
      // Ignore storage quota overflow gracefully
    }
  }, []);

  useEffect(() => {
    persistBook(book);
  }, [book, persistBook]);

  const handleChangePage = useCallback(
    (nextIndex: number) => {
      const maxIndex = book.spreads.length + 1;
      const clamped = Math.max(0, Math.min(maxIndex, nextIndex));
      if (clamped === currentPageIndex) return;
      setDirection(clamped > currentPageIndex ? 1 : -1);
      setCurrentPageIndex(clamped);
      setSelected(null);
    },
    [book.spreads.length, currentPageIndex]
  );

  const handleReplacePhoto = useCallback(
    (spreadId: string | 'cover', photoId: string, newSrc: string) => {
      setBook((prev) => {
        if (spreadId === 'cover') {
          return {
            ...prev,
            updatedAt: new Date().toISOString(),
            cover: {
              ...prev.cover,
              photo: { ...prev.cover.photo, src: newSrc },
            },
          };
        }
        return {
          ...prev,
          updatedAt: new Date().toISOString(),
          spreads: prev.spreads.map((sp) =>
            sp.id !== spreadId
              ? sp
              : {
                  ...sp,
                  photos: sp.photos.map((p) =>
                    p.id === photoId ? { ...p, src: newSrc } : p
                  ),
                }
          ),
        };
      });
    },
    []
  );

  const handleUpdatePhoto = useCallback(
    (
      spreadId: string | 'cover',
      photoId: string,
      updater: (p: PhotoSlot) => PhotoSlot
    ) => {
      setBook((prev) => {
        if (spreadId === 'cover') {
          return {
            ...prev,
            updatedAt: new Date().toISOString(),
            cover: {
              ...prev.cover,
              photo: updater(prev.cover.photo),
            },
          };
        }
        return {
          ...prev,
          updatedAt: new Date().toISOString(),
          spreads: prev.spreads.map((sp) =>
            sp.id !== spreadId
              ? sp
              : {
                  ...sp,
                  photos: sp.photos.map((p) =>
                    p.id === photoId ? updater(p) : p
                  ),
                }
          ),
        };
      });
    },
    []
  );

  const handleUpdateText = useCallback(
    (spreadId: string, textId: string, updater: (t: TextBlock) => TextBlock) => {
      setBook((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        spreads: prev.spreads.map((sp) =>
          sp.id !== spreadId
            ? sp
            : {
                ...sp,
                texts: sp.texts.map((t) => (t.id === textId ? updater(t) : t)),
              }
        ),
      }));
    },
    []
  );

  const handleUpdateSticker = useCallback(
    (
      spreadId: string,
      stickerId: string,
      updater: (s: StickerItem) => StickerItem
    ) => {
      setBook((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        spreads: prev.spreads.map((sp) =>
          sp.id !== spreadId
            ? sp
            : {
                ...sp,
                stickers: sp.stickers.map((s) =>
                  s.id === stickerId ? updater(s) : s
                ),
              }
        ),
      }));
    },
    []
  );

  const handleUpdateStickerPos = useCallback(
    (spreadId: string, stickerId: string, x: number, y: number) => {
      handleUpdateSticker(spreadId, stickerId, (s) => ({ ...s, x, y }));
    },
    [handleUpdateSticker]
  );

  const handleAddSticker = useCallback((spreadId: string, kind: StickerKind) => {
    const newSticker: StickerItem = {
      id: `st-${Date.now()}`,
      kind,
      x: 45,
      y: 42,
      size: 64,
      rotation: 0,
      zIndex: 28,
    };
    setBook((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      spreads: prev.spreads.map((sp) =>
        sp.id !== spreadId
          ? sp
          : { ...sp, stickers: [...sp.stickers, newSticker] }
      ),
    }));
    setSelected({ type: 'sticker', spreadId, stickerId: newSticker.id });
  }, []);

  const handleDeleteSticker = useCallback((spreadId: string, stickerId: string) => {
    setBook((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      spreads: prev.spreads.map((sp) =>
        sp.id !== spreadId
          ? sp
          : {
              ...sp,
              stickers: sp.stickers.filter((s) => s.id !== stickerId),
            }
      ),
    }));
  }, []);

  const handleUpdateCoverMeta = useCallback(
    (patch: Partial<Pick<BookCover, 'title' | 'subtitle' | 'dateLabel'>>) => {
      setBook((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        cover: { ...prev.cover, ...patch },
      }));
    },
    []
  );

  const handleChangeBackdrop = useCallback((backdrop: BackdropTheme) => {
    setBook((prev) => ({ ...prev, backdrop, updatedAt: new Date().toISOString() }));
  }, []);

  const handleAddTemplate = useCallback(
    (template: 'classic' | 'twin' | 'collage') => {
      setBook((prev) => {
        const nextSpread = createNewSpread(prev.spreads.length, template);
        const nextSpreads = [...prev.spreads, nextSpread];
        setDirection(1);
        setCurrentPageIndex(nextSpreads.length);
        setIsEditMode(true);
        setSelected(null);
        return {
          ...prev,
          updatedAt: new Date().toISOString(),
          spreads: nextSpreads,
        };
      });
    },
    []
  );

  const handleDeleteSpread = useCallback((spreadId: string) => {
    setBook((prev) => {
      if (prev.spreads.length <= 1) return prev;
      const nextSpreads = prev.spreads.filter((s) => s.id !== spreadId);
      setCurrentPageIndex((idx) => Math.max(1, Math.min(idx, nextSpreads.length)));
      setSelected(null);
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        spreads: nextSpreads,
      };
    });
  }, []);

  const handleSaveManual = useCallback(() => {
    persistBook(book);
    setSaveToast('Buku Momori tersimpan di perangkat');
    setTimeout(() => setSaveToast(null), 2600);
  }, [book, persistBook]);

  const handleResetBook = useCallback(() => {
    const fresh = createDefaultBook();
    setBook(fresh);
    setCurrentPageIndex(1);
    setSelected(null);
    persistBook(fresh);
    setSaveToast('Dikembalikan ke contoh awal');
    setTimeout(() => setSaveToast(null), 2400);
  }, [persistBook]);

  const isSpreadView =
    currentPageIndex >= 1 && currentPageIndex <= book.spreads.length;
  const activeSpread = isSpreadView
    ? book.spreads[currentPageIndex - 1]
    : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-[#e9e4dc] text-stone-900">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 h-16 bg-white/90 backdrop-blur-md border-b border-stone-200 px-4 sm:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleChangePage(0)}
          className="font-hand text-3xl font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 cursor-pointer"
        >
          Momori
        </button>

        {/* Zone 2: Clean single-line nav links */}
        <nav className="flex items-center gap-5 sm:gap-7 text-xs sm:text-sm font-medium text-stone-600 overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setIsEditMode(false);
              setSelected(null);
            }}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              !isEditMode
                ? 'text-stone-900 border-stone-900'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            Baca Buku
          </button>
          <button
            type="button"
            onClick={() => setIsEditMode(true)}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              isEditMode
                ? 'text-stone-900 border-rose-600'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            Edit Foto & Teks
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="hidden sm:inline-block py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 border-transparent hover:text-stone-900"
          >
            Tambah Halaman
          </button>
          <button
            type="button"
            onClick={() => setShowReferenceModal(true)}
            className="hidden md:inline-block py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 border-transparent hover:text-stone-900"
          >
            Referensi
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => setShowSaveModal(true)}
            className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs sm:text-sm font-medium hover:bg-rose-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
          >
            Simpan & Unduh
          </button>
        </div>
      </header>

      {/* Main Workspace: Flipbook Stage + Optional Editor Panel */}
      <main className="flex-1 flex flex-col lg:flex-row">
        <FlipBookStage
          book={book}
          currentPageIndex={currentPageIndex}
          direction={direction}
          isEditMode={isEditMode}
          selected={selected}
          onChangePage={handleChangePage}
          onSelect={setSelected}
          onReplacePhoto={handleReplacePhoto}
          onUpdateStickerPos={handleUpdateStickerPos}
          onAddSpreadModal={() => setShowAddModal(true)}
        />

        {isEditMode && (
          <PhotoEditorPanel
            selected={selected}
            cover={book.cover}
            currentSpread={activeSpread}
            backdrop={book.backdrop}
            canDeleteSpread={book.spreads.length > 1}
            onSelect={setSelected}
            onUpdatePhoto={handleUpdatePhoto}
            onUpdateText={handleUpdateText}
            onUpdateSticker={handleUpdateSticker}
            onAddSticker={handleAddSticker}
            onDeleteSticker={handleDeleteSticker}
            onUpdateCoverMeta={handleUpdateCoverMeta}
            onChangeBackdrop={handleChangeBackdrop}
            onDeleteSpread={handleDeleteSpread}
          />
        )}
      </main>

      {/* Subtle Save Toast */}
      {saveToast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-medium shadow-lg">
          {saveToast}
        </div>
      )}

      {/* Save & Export Modal */}
      {showSaveModal && (
        <SaveExportModal
          book={book}
          currentPageIndex={currentPageIndex}
          onClose={() => setShowSaveModal(false)}
          onSaveLocal={handleSaveManual}
          onImportBook={(imported) => {
            setBook(imported);
            setCurrentPageIndex(1);
            setSelected(null);
            persistBook(imported);
            setSaveToast('Buku berhasil diimpor');
            setTimeout(() => setSaveToast(null), 2400);
          }}
          onResetBook={handleResetBook}
        />
      )}

      {/* Add Spread Template Modal */}
      {showAddModal && (
        <AddSpreadModal
          onClose={() => setShowAddModal(false)}
          onAddTemplate={handleAddTemplate}
        />
      )}

      {/* Reference Inspiration Modal */}
      {showReferenceModal && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowReferenceModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-100">
              <h2 className="text-sm font-semibold text-stone-900">
                Referensi Desain Momori
              </h2>
              <button
                type="button"
                onClick={() => setShowReferenceModal(false)}
                aria-label="Tutup"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-stone-50">
              <img
                src="/assets/aistudio/image_c2d335e8.png"
                alt="Referensi tampilan buku scrapbook Momori"
                referrerPolicy="no-referrer"
                className="w-full rounded-xl border border-stone-200 object-contain max-h-[65vh]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
