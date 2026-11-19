import React from 'react';
import { X } from 'lucide-react';

interface AddSpreadModalProps {
  onClose: () => void;
  onAddTemplate: (template: 'classic' | 'twin' | 'collage') => void;
}

export const AddSpreadModal: React.FC<AddSpreadModalProps> = ({
  onClose,
  onAddTemplate,
}) => {
  const templates: Array<{
    id: 'classic' | 'twin' | 'collage';
    title: string;
    desc: string;
    preview: React.ReactNode;
  }> = [
    {
      id: 'classic',
      title: 'Klasik Momori',
      desc: '1 foto utama + catatan tempel + polaroid kecil',
      preview: (
        <div className="w-full aspect-[3/2] bg-[#f3efe7] rounded-lg border border-stone-200 p-2 flex gap-2">
          <div className="w-1/2 flex flex-col justify-center gap-1.5 px-1">
            <div className="h-2 w-4/5 bg-amber-200 rounded-xs" />
            <div className="aspect-[4/3] bg-white border border-stone-200 shadow-xs p-1">
              <div className="w-full h-full bg-stone-300/70" />
            </div>
          </div>
          <div className="w-1/2 flex flex-col justify-between py-1 px-1">
            <div className="flex gap-1.5">
              <div className="w-1/2 h-8 bg-sky-200/80 rounded-xs" />
              <div className="w-1/2 aspect-square bg-white border border-stone-200 p-0.5">
                <div className="w-full h-full bg-stone-300/70" />
              </div>
            </div>
            <div className="h-5 w-5 rounded-full bg-rose-200 self-end" />
          </div>
        </div>
      ),
    },
    {
      id: 'twin',
      title: 'Dua Potret',
      desc: '2 foto vertikal bersebelahan dengan pita perekat',
      preview: (
        <div className="w-full aspect-[3/2] bg-[#f3efe7] rounded-lg border border-stone-200 p-2 flex gap-2 items-center">
          <div className="w-1/2 h-4/5 bg-white border border-stone-200 p-1 shadow-xs">
            <div className="w-full h-full bg-stone-300/70" />
          </div>
          <div className="w-1/2 h-4/5 bg-white border border-stone-200 p-1 shadow-xs">
            <div className="w-full h-full bg-stone-300/70" />
          </div>
        </div>
      ),
    },
    {
      id: 'collage',
      title: 'Kolase Tiga',
      desc: '2 polaroid tumpang-tindih + 1 foto lanskap besar',
      preview: (
        <div className="w-full aspect-[3/2] bg-[#f3efe7] rounded-lg border border-stone-200 p-2 flex gap-2">
          <div className="w-1/2 relative">
            <div className="w-3/5 aspect-square bg-white border border-stone-200 p-0.5 shadow-xs">
              <div className="w-full h-full bg-stone-300/70" />
            </div>
            <div className="w-3/5 aspect-square bg-white border border-stone-200 p-0.5 shadow-xs absolute right-0 bottom-0">
              <div className="w-full h-full bg-stone-400/50" />
            </div>
          </div>
          <div className="w-1/2 flex flex-col gap-1.5">
            <div className="aspect-[4/3] bg-white border border-stone-200 p-1 shadow-xs">
              <div className="w-full h-full bg-stone-300/70" />
            </div>
            <div className="h-5 bg-sky-200/80 rounded-xs" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/45 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="text-base font-semibold text-stone-900">Tambah Halaman Baru</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => {
                onAddTemplate(tpl.id);
                onClose();
              }}
              className="group text-left p-3 rounded-xl border border-stone-200 hover:border-rose-500 hover:bg-rose-50/30 transition-all cursor-pointer space-y-2.5"
            >
              {tpl.preview}
              <div>
                <p className="text-xs font-semibold text-stone-900 group-hover:text-rose-700">
                  {tpl.title}
                </p>
                <p className="text-[11px] text-stone-500 leading-snug mt-0.5">
                  {tpl.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
