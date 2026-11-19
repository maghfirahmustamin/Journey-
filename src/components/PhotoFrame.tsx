import React, { useState } from 'react';
import { Camera, ImagePlus, SlidersHorizontal } from 'lucide-react';
import { PhotoSlot } from '../types/momori';
import { compressImageFile } from '../utils/samplePhotos';

interface PhotoFrameProps {
  photo: PhotoSlot;
  isEditMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onReplaceFile: (newSrc: string) => void;
}

const ASPECT_CLASSES: Record<PhotoSlot['aspectRatio'], string> = {
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '3/4': 'aspect-[3/4]',
  '16/10': 'aspect-[16/10]',
};

export const PhotoFrame: React.FC<PhotoFrameProps> = ({
  photo,
  isEditMode,
  isSelected,
  onSelect,
  onReplaceFile,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [imgError, setImgError] = useState(false);

  const { edits } = photo;
  const filterString = `brightness(${edits.brightness}%) contrast(${edits.contrast}%) saturate(${edits.saturate}%) sepia(${edits.sepia}%)`;

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const compressed = await compressImageFile(file);
        onReplaceFile(compressed);
        onSelect();
      } catch {
        // Ignore invalid files silently
      }
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file);
        onReplaceFile(compressed);
        onSelect();
      } catch {
        // Ignore invalid files silently
      }
    }
    e.target.value = '';
  };

  const framePaddingClass =
    edits.frameStyle === 'polaroid'
      ? photo.caption
        ? 'bg-[#fcfbf8] p-2 pb-5 sm:p-2.5 sm:pb-7 shadow-[0_6px_18px_rgba(28,25,23,0.14)] rounded-[2px]'
        : 'bg-[#fcfbf8] p-2 pb-4 sm:p-2.5 sm:pb-5 shadow-[0_6px_18px_rgba(28,25,23,0.14)] rounded-[2px]'
      : edits.frameStyle === 'taped'
      ? 'bg-[#fcfbf8] p-1.5 shadow-[0_5px_16px_rgba(28,25,23,0.13)] rounded-[2px]'
      : edits.frameStyle === 'stamp'
      ? 'bg-[#fcfbf8] p-2 border-2 border-dashed border-stone-300 shadow-[0_4px_14px_rgba(28,25,23,0.12)]'
      : 'bg-transparent p-0 rounded-xl overflow-hidden shadow-[0_8px_20px_rgba(28,25,23,0.15)]';

  return (
    <div
      style={{
        left: `${photo.x}%`,
        top: `${photo.y}%`,
        width: `${photo.widthPct}%`,
        zIndex: isSelected ? 40 : photo.zIndex,
        transform: `rotate(${edits.rotation}deg)`,
      }}
      onClick={(e) => {
        if (!isEditMode) return;
        e.stopPropagation();
        onSelect();
      }}
      onDragOver={(e) => {
        if (!isEditMode) return;
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        if (isEditMode) handleDrop(e);
      }}
      className={`absolute transition-transform duration-200 select-none ${
        isEditMode ? 'cursor-pointer group' : ''
      }`}
    >
      {/* Washi tape for taped frame style */}
      {edits.frameStyle === 'taped' && (
        <div
          aria-hidden="true"
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 bg-stone-300/65 backdrop-blur-[1px] -rotate-2 z-20 pointer-events-none shadow-xs"
        />
      )}

      <div
        className={`relative transition-shadow duration-150 ${framePaddingClass} ${
          isSelected && isEditMode
            ? 'ring-2 ring-rose-600 ring-offset-2 ring-offset-[#f3efe7]'
            : isEditMode
            ? 'group-hover:ring-2 group-hover:ring-rose-400/70'
            : ''
        } ${isDragOver ? 'ring-2 ring-rose-600 scale-[1.02]' : ''}`}
      >
        <div
          className={`relative w-full overflow-hidden bg-stone-200 ${ASPECT_CLASSES[photo.aspectRatio]} ${
            edits.frameStyle === 'rounded' ? 'rounded-xl' : 'rounded-[1px]'
          }`}
        >
          {photo.src && !imgError ? (
            <img
              src={photo.src}
              alt={photo.caption || 'Momori memory photo'}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              draggable={false}
              style={{
                filter: filterString,
                transform: `scale(${edits.zoom}) translate(${edits.panX}%, ${edits.panY}%)`,
              }}
              className="w-full h-full object-cover transition-transform duration-150 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-200 text-stone-500 p-3 text-center">
              <Camera className="w-6 h-6 mb-1 opacity-70" />
              <span className="text-[11px] font-medium">Klik untuk unggah foto</span>
            </div>
          )}

          {/* Edit Mode Hover Controls */}
          {isEditMode && (
            <div
              className={`absolute inset-0 bg-stone-950/35 flex items-center justify-center gap-1.5 transition-opacity duration-150 ${
                isSelected ? 'opacity-100 bg-stone-950/15' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              <label
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white/95 text-stone-900 text-[11px] font-semibold shadow-sm hover:bg-white cursor-pointer whitespace-nowrap"
              >
                <ImagePlus className="w-3.5 h-3.5 text-rose-600" />
                <span>Ganti</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-stone-900/90 text-white text-[11px] font-semibold shadow-sm hover:bg-stone-900 cursor-pointer whitespace-nowrap"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
          )}
        </div>

        {/* Polaroid / Frame handwritten caption */}
        {photo.caption && (
          <p className="font-hand text-stone-800 text-sm sm:text-base md:text-lg leading-tight mt-1.5 pl-0.5 truncate">
            {photo.caption}
          </p>
        )}
      </div>
    </div>
  );
};
