import React, { useState } from 'react';
import { Check, Download, FileJson, RotateCcw, Save, Upload, X } from 'lucide-react';
import { MomoriBook } from '../types/momori';
import { exportCoverAsPng, exportSpreadAsPng } from '../utils/exportSpreadCanvas';

interface SaveExportModalProps {
  book: MomoriBook;
  currentPageIndex: number;
  onClose: () => void;
  onSaveLocal: () => void;
  onImportBook: (imported: MomoriBook) => void;
  onResetBook: () => void;
}

export const SaveExportModal: React.FC<SaveExportModalProps> = ({
  book,
  currentPageIndex,
  onClose,
  onSaveLocal,
  onImportBook,
  onResetBook,
}) => {
  const [savedNotice, setSavedNotice] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isCover = currentPageIndex === 0;
  const isBack = currentPageIndex === book.spreads.length + 1;
  const currentSpread =
    !isCover && !isBack ? book.spreads[currentPageIndex - 1] : undefined;

  const handleSaveNow = () => {
    onSaveLocal();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2200);
  };

  const handleDownloadPng = async () => {
    setErrorMsg('');
    setIsExportingPng(true);
    try {
      const dataUrl = isCover
        ? await exportCoverAsPng(book)
        : currentSpread
        ? await exportSpreadAsPng(book, currentSpread)
        : await exportCoverAsPng(book);

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = isCover
        ? 'momori-cover.png'
        : `momori-${currentSpread?.id || 'page'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      setErrorMsg('Gagal membuat gambar PNG. Coba ulangi beberapa saat.');
    } finally {
      setIsExportingPng(false);
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(book, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${book.bookName.toLowerCase().replace(/\s+/g, '-')}-backup.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as MomoriBook;
        if (!parsed || !Array.isArray(parsed.spreads) || !parsed.cover) {
          setErrorMsg('File JSON bukan format buku Momori yang valid.');
          return;
        }
        onImportBook(parsed);
        onClose();
      } catch {
        setErrorMsg('Gagal membaca file JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/45 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="text-base font-semibold text-stone-900">Simpan & Unduh Buku</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-100 hover:text-stone-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {errorMsg && (
            <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
              {errorMsg}
            </p>
          )}

          {/* 1. Save to LocalStorage */}
          <button
            type="button"
            onClick={handleSaveNow}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-stone-200 hover:border-stone-400 bg-stone-50/70 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-stone-900 text-white flex items-center justify-center shrink-0">
                {savedNotice ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900">
                  {savedNotice ? 'Tersimpan di Browser!' : 'Simpan Perubahan'}
                </p>
                <p className="text-xs text-stone-500">
                  Simpan semua foto, edit warna & catatan agar tidak hilang
                </p>
              </div>
            </div>
          </button>

          {/* 2. Download PNG of Current Spread */}
          <button
            type="button"
            disabled={isExportingPng || isBack}
            onClick={handleDownloadPng}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {isExportingPng
                    ? 'Menyiapkan PNG...'
                    : isCover
                    ? 'Unduh Sampul (PNG)'
                    : 'Unduh Halaman Ini (PNG)'}
                </p>
                <p className="text-xs text-rose-100">
                  {isBack
                    ? 'Buka halaman sampul atau isi untuk mengunduh PNG'
                    : 'Resolusi tinggi 1800×1200 siap dibagikan'}
                </p>
              </div>
            </div>
          </button>

          {/* 3. JSON Backup & Restore */}
          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={handleExportJson}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer"
            >
              <FileJson className="w-4 h-4 text-stone-500" />
              <span>Ekspor Backup</span>
            </button>
            <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer">
              <Upload className="w-4 h-4 text-stone-500" />
              <span>Impor Backup</span>
              <input
                type="file"
                accept="application/json"
                onChange={handleImportJson}
                className="hidden"
              />
            </label>
          </div>

          {/* 4. Reset to Default */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">Ingin mulai ulang?</span>
            <button
              type="button"
              onClick={() => {
                onResetBook();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-rose-600 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ke Contoh Awal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
