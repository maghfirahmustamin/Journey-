export interface SamplePhotoAsset {
  id: string;
  label: string;
  src: string;
}

const cachedSamples: Record<string, string> = {};

function createCanvasScene(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  draw(ctx, width, height);
  return canvas.toDataURL('image/jpeg', 0.9);
}

function drawFilmGrain(ctx: CanvasRenderingContext2D, w: number, h: number, amount = 10) {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 248, 235, 0.04)';
  for (let i = 0; i < 420; i++) {
    const x = ((i * 73) % w);
    const y = ((i * 137) % h);
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.fillStyle = `rgba(20, 15, 10, ${amount / 400})`;
  for (let i = 0; i < 300; i++) {
    const x = ((i * 97 + 19) % w);
    const y = ((i * 193 + 41) % h);
    ctx.fillRect(x, y, 1.5, 1.5);
  }
  ctx.restore();
}

export function getSamplePhotos(): SamplePhotoAsset[] {
  if (Object.keys(cachedSamples).length === 0) {
    // 1. Milan Street & Blue Sky (reminiscent of the main Polaroid in the reference)
    cachedSamples['milan-street'] = createCanvasScene(640, 480, (ctx, w, h) => {
      const sky = ctx.createLinearGradient(0, 0, 0, h * 0.72);
      sky.addColorStop(0, '#2d76c9');
      sky.addColorStop(1, '#85b9ec');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Sunlit cream historic building left
      ctx.fillStyle = '#efe5d1';
      ctx.fillRect(24, 90, 265, 315);
      ctx.fillStyle = '#d9cbb2';
      ctx.fillRect(24, 90, 265, 22);
      ctx.fillRect(24, 185, 265, 12);
      ctx.fillRect(24, 285, 265, 12);

      // Windows with dark green shutters
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 3; col++) {
          const wx = 50 + col * 80;
          const wy = 128 + row * 96;
          ctx.fillStyle = '#334155';
          ctx.fillRect(wx, wy, 36, 48);
          ctx.fillStyle = '#93c5fd';
          ctx.fillRect(wx + 4, wy + 4, 12, 18);
          ctx.fillRect(wx + 20, wy + 4, 12, 18);
          ctx.fillStyle = '#475569';
          ctx.fillRect(wx - 4, wy + 48, 44, 5);
        }
      }

      // Warm terracotta corner building right
      ctx.fillStyle = '#c88d74';
      ctx.fillRect(435, 145, 205, 265);
      ctx.fillStyle = '#a76e56';
      ctx.fillRect(435, 145, 205, 18);
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
          ctx.fillStyle = '#292524';
          ctx.fillRect(470 + col * 76, 185 + row * 84, 34, 48);
        }
      }

      // Street ground
      ctx.fillStyle = '#44403c';
      ctx.fillRect(0, 395, w, 85);

      // Traveler silhouette with white tee & black backpack looking up
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.ellipse(360, 385, 62, 82, 0, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(298, 385, 124, 95);

      // Backpack
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.roundRect(322, 346, 86, 118, 20);
      ctx.fill();

      // Head & blonde hair
      ctx.fillStyle = '#e6c99b';
      ctx.beginPath();
      ctx.arc(365, 286, 36, 0, Math.PI * 2);
      ctx.fill();

      // Street sign
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(140, 290, 6, 110);
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(143, 282, 17, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(132, 279, 22, 6);

      // Soft tree foliage top left
      ctx.fillStyle = '#1f2d1e';
      ctx.beginPath();
      ctx.arc(20, 40, 75, 0, Math.PI * 2);
      ctx.arc(85, 15, 55, 0, Math.PI * 2);
      ctx.fill();

      drawFilmGrain(ctx, w, h, 8);
    });

    // 2. Outdoor Café Smile
    cachedSamples['piazza-cafe'] = createCanvasScene(520, 520, (ctx, w, h) => {
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#f3e5d0');
      bg.addColorStop(1, '#c8b39a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Arched colonnade in background
      ctx.fillStyle = '#e2d2bc';
      ctx.fillRect(0, 40, w, 260);
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#5c4b3c';
        ctx.beginPath();
        ctx.arc(70 + i * 130, 190, 44, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(26 + i * 130, 190, 88, 110);
      }

      // White cafe umbrellas
      ctx.fillStyle = '#faf8f5';
      ctx.beginPath();
      ctx.moveTo(40, 240);
      ctx.lineTo(175, 170);
      ctx.lineTo(310, 240);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(260, 248);
      ctx.lineTo(395, 182);
      ctx.lineTo(520, 248);
      ctx.closePath();
      ctx.fill();

      // Person sitting smiling with coffee
      ctx.fillStyle = '#292524';
      ctx.fillRect(205, 320, 110, 140);
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(218, 305, 84, 110, 18);
      ctx.fill();
      ctx.fillStyle = '#f1c29b';
      ctx.beginPath();
      ctx.arc(260, 265, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e5c17d';
      ctx.beginPath();
      ctx.arc(260, 255, 29, Math.PI, 0);
      ctx.fill();

      // Cafe table & espresso cup
      ctx.fillStyle = '#f5f5f4';
      ctx.beginPath();
      ctx.ellipse(260, 445, 95, 26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(246, 412, 26, 20);
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.ellipse(259, 412, 11, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      drawFilmGrain(ctx, w, h, 9);
    });

    // 3. Cobblestone Morning Walk
    cachedSamples['street-walk'] = createCanvasScene(520, 520, (ctx, w, h) => {
      const sky = ctx.createLinearGradient(0, 0, 0, h * 0.55);
      sky.addColorStop(0, '#3b82f6');
      sky.addColorStop(1, '#bfdbfe');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Side facades
      ctx.fillStyle = '#ebe3d5';
      ctx.fillRect(0, 80, 165, 290);
      ctx.fillStyle = '#d6c7b2';
      ctx.fillRect(365, 110, 155, 260);

      // Street
      ctx.fillStyle = '#6b7280';
      ctx.fillRect(0, 350, w, 170);

      // Tram tracks
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(190, 350);
      ctx.lineTo(120, 520);
      ctx.moveTo(270, 350);
      ctx.lineTo(310, 520);
      ctx.stroke();

      // Parked vintage scooter red
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.roundRect(45, 360, 75, 48, 16);
      ctx.fill();
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(62, 416, 16, 0, Math.PI * 2);
      ctx.arc(105, 416, 16, 0, Math.PI * 2);
      ctx.fill();

      // Person standing in white shirt & denim jeans
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(226, 268, 68, 78, 12);
      ctx.fill();
      ctx.fillStyle = '#3b5978';
      ctx.fillRect(234, 344, 24, 92);
      ctx.fillRect(264, 344, 24, 92);
      ctx.fillStyle = '#f1c29b';
      ctx.beginPath();
      ctx.arc(260, 240, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#292524';
      ctx.beginPath();
      ctx.arc(260, 232, 23, Math.PI, 0);
      ctx.fill();

      drawFilmGrain(ctx, w, h, 8);
    });

    // 4. Crosswalk Candid
    cachedSamples['crosswalk-candid'] = createCanvasScene(520, 520, (ctx, w, h) => {
      const sky = ctx.createLinearGradient(0, 0, 0, h * 0.5);
      sky.addColorStop(0, '#60a5fa');
      sky.addColorStop(1, '#dbeafe');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#e7dfd3';
      ctx.fillRect(40, 75, 440, 260);
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = '#475569';
        ctx.fillRect(80 + i * 95, 120, 48, 72);
        ctx.fillRect(80 + i * 95, 220, 48, 72);
      }

      // Pavement & crosswalk stripes
      ctx.fillStyle = '#57534e';
      ctx.fillRect(0, 330, w, 190);
      ctx.fillStyle = '#f5f5f4';
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(35 + i * 105, 435, 62, 24);
      }

      // Subject holding camera
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(210, 255, 90, 92, 14);
      ctx.fill();
      ctx.fillStyle = '#334e68';
      ctx.fillRect(225, 345, 28, 95);
      ctx.fillRect(258, 345, 28, 95);
      ctx.fillStyle = '#f0c4a0';
      ctx.beginPath();
      ctx.arc(255, 222, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e8c584';
      ctx.beginPath();
      ctx.arc(255, 214, 25, Math.PI, 0);
      ctx.fill();

      drawFilmGrain(ctx, w, h, 8);
    });

    // 5. Golden Hour Sea Promenade
    cachedSamples['golden-sea'] = createCanvasScene(640, 480, (ctx, w, h) => {
      const sky = ctx.createLinearGradient(0, 0, 0, h * 0.65);
      sky.addColorStop(0, '#f59e0b');
      sky.addColorStop(0.55, '#fb923c');
      sky.addColorStop(1, '#fde68a');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Glowing sun
      ctx.fillStyle = 'rgba(255, 251, 235, 0.9)';
      ctx.beginPath();
      ctx.arc(460, 175, 48, 0, Math.PI * 2);
      ctx.fill();

      // Calm shimmering ocean
      const sea = ctx.createLinearGradient(0, h * 0.56, 0, h);
      sea.addColorStop(0, '#335c81');
      sea.addColorStop(1, '#1e3a5f');
      ctx.fillStyle = sea;
      ctx.fillRect(0, h * 0.56, w, h * 0.44);

      // Sun reflection on water
      ctx.fillStyle = 'rgba(253, 224, 71, 0.45)';
      for (let i = 0; i < 12; i++) {
        ctx.fillRect(420 - i * 4, h * 0.58 + i * 14, 80 + i * 8, 5);
      }

      // Silhouette couple on promenade railing
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, h * 0.82, w, 12);
      ctx.beginPath();
      ctx.arc(210, 315, 24, 0, Math.PI * 2);
      ctx.arc(260, 326, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(184, 340, 52, 85, 16);
      ctx.roundRect(236, 350, 48, 75, 16);
      ctx.fill();

      drawFilmGrain(ctx, w, h, 10);
    });

    // 6. Morning Desk & Roses
    cachedSamples['morning-roses'] = createCanvasScene(520, 640, (ctx, w, h) => {
      ctx.fillStyle = '#f5efe6';
      ctx.fillRect(0, 0, w, h);

      // Diagonal window sunlight beam
      ctx.fillStyle = 'rgba(255, 249, 230, 0.65)';
      ctx.beginPath();
      ctx.moveTo(80, 0);
      ctx.lineTo(360, 0);
      ctx.lineTo(520, 460);
      ctx.lineTo(140, 460);
      ctx.closePath();
      ctx.fill();

      // Ceramic vase with soft pink roses
      ctx.fillStyle = '#e7e5e4';
      ctx.beginPath();
      ctx.roundRect(205, 310, 110, 155, 28);
      ctx.fill();

      // Stems
      ctx.strokeStyle = '#4d7c0f';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(260, 310);
      ctx.lineTo(220, 210);
      ctx.moveTo(260, 310);
      ctx.lineTo(295, 200);
      ctx.moveTo(260, 310);
      ctx.lineTo(260, 180);
      ctx.stroke();

      // Blooms
      const blooms = [
        { x: 215, y: 200, r: 34, c: '#f472b6' },
        { x: 300, y: 196, r: 30, c: '#fb7185' },
        { x: 260, y: 168, r: 38, c: '#f9a8d4' },
      ];
      for (const b of blooms) {
        ctx.fillStyle = b.c;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.28)';
        ctx.beginPath();
        ctx.arc(b.x - 8, b.y - 8, b.r * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }

      // Open notebook on table
      ctx.fillStyle = '#ffffff';
      ctx.save();
      ctx.translate(150, 495);
      ctx.rotate(-0.08);
      ctx.fillRect(-90, -50, 180, 110);
      ctx.strokeStyle = '#d6d3d1';
      ctx.lineWidth = 2;
      ctx.strokeRect(-90, -50, 180, 110);
      ctx.restore();

      drawFilmGrain(ctx, w, h, 8);
    });
  }

  return [
    { id: 'milan-street', label: 'Milan Skyline', src: cachedSamples['milan-street'] },
    { id: 'piazza-cafe', label: 'Piazza Café', src: cachedSamples['piazza-cafe'] },
    { id: 'street-walk', label: 'Morning Stroll', src: cachedSamples['street-walk'] },
    { id: 'crosswalk-candid', label: 'Crosswalk Candid', src: cachedSamples['crosswalk-candid'] },
    { id: 'golden-sea', label: 'Golden Promenade', src: cachedSamples['golden-sea'] },
    { id: 'morning-roses', label: 'Window Roses', src: cachedSamples['morning-roses'] },
  ];
}

export async function compressImageFile(file: File, maxDim = 1280): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Format gambar tidak didukung.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.86));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
