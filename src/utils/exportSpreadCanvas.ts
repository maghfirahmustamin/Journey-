import { BookSpread, MomoriBook, NoteTint, PhotoSlot } from '../types/momori';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = src;
  });
}

function getNoteHex(tint: NoteTint | undefined): string {
  switch (tint) {
    case 'sky':
      return '#cbe0f7';
    case 'butter':
      return '#fef3b8';
    case 'blush':
      return '#fad7e2';
    case 'mint':
      return '#d5f0de';
    case 'cream':
    default:
      return '#efe9dc';
  }
}

function getAspectRatioNumber(aspect: PhotoSlot['aspectRatio']): number {
  switch (aspect) {
    case '4/3':
      return 4 / 3;
    case '1/1':
      return 1;
    case '3/4':
      return 3 / 4;
    case '16/10':
      return 16 / 10;
  }
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  startY: number,
  maxWidth: number,
  lineHeight: number
) {
  const paragraphs = text.split('\n');
  let y = startY;
  for (const para of paragraphs) {
    const words = para.split(' ');
    let line = '';
    for (let i = 0; i < words.length; i++) {
      const testLine = line ? `${line} ${words[i]}` : words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line) {
        ctx.fillText(line, centerX, y);
        line = words[i];
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) {
      ctx.fillText(line, centerX, y);
      y += lineHeight;
    }
  }
}

async function drawPhotoOnCanvas(
  ctx: CanvasRenderingContext2D,
  photo: PhotoSlot,
  halfOffsetX: number,
  halfWidth: number,
  pageHeight: number
) {
  const frameW = (photo.widthPct / 100) * halfWidth;
  const aspect = getAspectRatioNumber(photo.aspectRatio);
  const pad = photo.edits.frameStyle === 'rounded' ? 0 : Math.round(frameW * 0.045);
  const bottomPad =
    photo.edits.frameStyle === 'polaroid'
      ? Math.round(frameW * (photo.caption ? 0.16 : 0.1))
      : pad;

  const imgBoxW = frameW - pad * 2;
  const imgBoxH = imgBoxW / aspect;
  const frameH = imgBoxH + pad + bottomPad;

  const left = halfOffsetX + (photo.x / 100) * halfWidth;
  const top = (photo.y / 100) * pageHeight;
  const cx = left + frameW / 2;
  const cy = top + frameH / 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((photo.edits.rotation * Math.PI) / 180);

  // Drop shadow
  ctx.shadowColor = 'rgba(28, 25, 23, 0.18)';
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 8;

  // Frame Background
  if (photo.edits.frameStyle !== 'rounded') {
    ctx.fillStyle = '#fcfbf8';
    ctx.beginPath();
    ctx.roundRect(-frameW / 2, -frameH / 2, frameW, frameH, 4);
    ctx.fill();
  }

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  if (photo.edits.frameStyle === 'stamp') {
    ctx.strokeStyle = '#d6d3d1';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(-frameW / 2 + 4, -frameH / 2 + 4, frameW - 8, frameH - 8);
    ctx.setLineDash([]);
  }

  // Draw Photo inside clipped box
  const imgX = -frameW / 2 + pad;
  const imgY = -frameH / 2 + pad;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(
    imgX,
    imgY,
    imgBoxW,
    imgBoxH,
    photo.edits.frameStyle === 'rounded' ? 18 : 2
  );
  ctx.clip();

  try {
    const img = await loadImage(photo.src);
    ctx.filter = `brightness(${photo.edits.brightness}%) contrast(${photo.edits.contrast}%) saturate(${photo.edits.saturate}%) sepia(${photo.edits.sepia}%)`;

    // Cover fit + zoom + pan
    const imgRatio = img.width / img.height;
    const boxRatio = imgBoxW / imgBoxH;
    let drawW = imgBoxW;
    let drawH = imgBoxH;
    if (imgRatio > boxRatio) {
      drawH = imgBoxH;
      drawW = imgBoxH * imgRatio;
    } else {
      drawW = imgBoxW;
      drawH = imgBoxW / imgRatio;
    }

    drawW *= photo.edits.zoom;
    drawH *= photo.edits.zoom;

    const offsetX = (photo.edits.panX / 100) * imgBoxW;
    const offsetY = (photo.edits.panY / 100) * imgBoxH;

    ctx.drawImage(
      img,
      imgX + (imgBoxW - drawW) / 2 + offsetX,
      imgY + (imgBoxH - drawH) / 2 + offsetY,
      drawW,
      drawH
    );
  } catch {
    ctx.fillStyle = '#e7e5e4';
    ctx.fillRect(imgX, imgY, imgBoxW, imgBoxH);
  }
  ctx.restore();

  // Washi tape on top if taped style
  if (photo.edits.frameStyle === 'taped') {
    ctx.save();
    ctx.rotate(-0.04);
    ctx.fillStyle = 'rgba(180, 173, 162, 0.7)';
    ctx.fillRect(-44, -frameH / 2 - 10, 88, 22);
    ctx.restore();
  }

  // Caption
  if (photo.caption) {
    ctx.fillStyle = '#292524';
    ctx.font = '600 28px Caveat, cursive';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(photo.caption, -frameW / 2 + pad + 4, frameH / 2 - bottomPad / 2 + 2);
  }

  ctx.restore();
}

export async function exportSpreadAsPng(
  book: MomoriBook,
  spread: BookSpread
): Promise<string> {
  const W = 1800;
  const H = 1200;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas tidak tersedia');

  // Paper Background
  ctx.fillStyle = '#f3efe7';
  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, 44);
  ctx.fill();
  ctx.clip();

  // Subtle paper dot grain
  ctx.fillStyle = 'rgba(120, 105, 85, 0.045)';
  for (let x = 20; x < W; x += 36) {
    for (let y = 20; y < H; y += 36) {
      ctx.fillRect(x, y, 2, 2);
    }
  }

  // Draw photos sorted by zIndex
  const sortedPhotos = [...spread.photos].sort((a, b) => a.zIndex - b.zIndex);
  for (const photo of sortedPhotos) {
    const halfOffsetX = photo.pageSide === 'right' ? W / 2 : 0;
    await drawPhotoOnCanvas(ctx, photo, halfOffsetX, W / 2, H);
  }

  // Draw text blocks
  for (const block of spread.texts) {
    const halfOffsetX = block.pageSide === 'right' ? W / 2 : 0;
    const boxW = (block.widthPct / 100) * (W / 2);
    const left = halfOffsetX + (block.x / 100) * (W / 2);
    const top = (block.y / 100) * H;

    ctx.save();
    ctx.translate(left + boxW / 2, top + 40);
    ctx.rotate((block.rotation * Math.PI) / 180);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    if (block.variant === 'highlighted-title') {
      ctx.fillStyle = getNoteHex(block.tint || 'butter');
      ctx.fillRect(-boxW / 2, -6, boxW, 56);
      ctx.fillStyle = '#1c1917';
      ctx.font = '700 44px Caveat, cursive';
      ctx.fillText(block.content, 0, 0, boxW);
    } else if (block.variant === 'sticky-note') {
      const noteH = Math.max(150, block.content.split('\n').length * 44 + 60);
      ctx.fillStyle = getNoteHex(block.tint || 'sky');
      ctx.fillRect(-boxW / 2, -20, boxW, noteH);

      // Diagonal tapes
      ctx.save();
      ctx.fillStyle = 'rgba(115, 110, 102, 0.45)';
      ctx.translate(-boxW / 2 + 12, -16);
      ctx.rotate(-0.55);
      ctx.fillRect(-35, -10, 70, 20);
      ctx.restore();

      ctx.save();
      ctx.fillStyle = 'rgba(115, 110, 102, 0.45)';
      ctx.translate(boxW / 2 - 12, noteH - 22);
      ctx.rotate(-0.55);
      ctx.fillRect(-35, -10, 70, 20);
      ctx.restore();

      ctx.fillStyle = '#292524';
      ctx.font = '600 32px Caveat, cursive';
      drawWrappedText(ctx, block.content, 0, 10, boxW - 40, 38);
    } else if (block.variant === 'ripped-quote') {
      const lines = block.content.split('\n');
      lines.forEach((line, i) => {
        ctx.fillStyle = '#e8e1d3';
        ctx.fillRect(-boxW / 2 + 20, i * 40 - 4, boxW - 40, 34);
        ctx.fillStyle = '#292524';
        ctx.font = '600 28px Caveat, cursive';
        ctx.fillText(line, 0, i * 40);
      });
    } else {
      ctx.fillStyle = '#292524';
      ctx.font = '600 30px Caveat, cursive';
      drawWrappedText(ctx, block.content, 0, -10, boxW, 36);
    }
    ctx.restore();
  }

  // Center Spine Shadow
  const spineGrad = ctx.createLinearGradient(W / 2 - 48, 0, W / 2 + 48, 0);
  spineGrad.addColorStop(0, 'rgba(28, 25, 23, 0)');
  spineGrad.addColorStop(0.5, 'rgba(28, 25, 23, 0.14)');
  spineGrad.addColorStop(1, 'rgba(28, 25, 23, 0)');
  ctx.fillStyle = spineGrad;
  ctx.fillRect(W / 2 - 48, 0, 96, H);

  // Subtle footer watermark
  ctx.fillStyle = 'rgba(120, 113, 108, 0.45)';
  ctx.font = '500 18px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`${book.bookName} · ${spread.label}`, W - 36, H - 30);

  return canvas.toDataURL('image/png');
}

export async function exportCoverAsPng(book: MomoriBook): Promise<string> {
  const W = 1000;
  const H = 1250;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas tidak tersedia');

  ctx.fillStyle = '#f3efe7';
  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, [12, 48, 48, 12]);
  ctx.fill();
  ctx.clip();

  // Spine strip
  const spine = ctx.createLinearGradient(0, 0, 56, 0);
  spine.addColorStop(0, 'rgba(120, 113, 108, 0.35)');
  spine.addColorStop(1, 'rgba(120, 113, 108, 0)');
  ctx.fillStyle = spine;
  ctx.fillRect(0, 0, 56, H);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#78716c';
  ctx.font = '500 22px monospace';
  ctx.fillText(book.cover.dateLabel.toUpperCase(), W / 2 + 12, 92);

  ctx.fillStyle = '#fef08a';
  ctx.fillRect(W / 2 - 280, 122, 580, 66);
  ctx.fillStyle = '#1c1917';
  ctx.font = '700 58px Caveat, cursive';
  ctx.fillText(book.cover.title, W / 2 + 12, 174);

  ctx.fillStyle = '#57534e';
  ctx.font = '400 24px sans-serif';
  ctx.fillText(book.cover.subtitle, W / 2 + 12, 232);

  await drawPhotoOnCanvas(
    ctx,
    { ...book.cover.photo, x: 18, y: 24, widthPct: 68 },
    0,
    W,
    H
  );

  return canvas.toDataURL('image/png');
}
