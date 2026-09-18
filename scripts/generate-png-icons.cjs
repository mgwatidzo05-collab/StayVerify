const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

function generatePNG(width, height, isMaskable = false) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  // Scanlines: for each row, 1 filter byte (0) + width * 4 bytes RGBA
  const rawData = Buffer.alloc(height * (1 + width * 4));
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.45;
  const innerRadius = width * (isMaskable ? 0.28 : 0.35);

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter None
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Base rose color (#e11d48 -> r:225, g:29, b:72)
      let r = 225, g = 29, b = 72, a = 255;

      // Subtle gradient from top to bottom
      const grad = y / height;
      r = Math.min(255, Math.round(244 * (1 - grad * 0.25)));
      g = Math.min(255, Math.round(40 * (1 - grad * 0.3)));
      b = Math.min(255, Math.round(90 * (1 - grad * 0.3)));

      // Rounded rect boundary if not maskable
      if (!isMaskable) {
        const cornerDistX = Math.max(0, Math.abs(dx) - (cx - width * 0.2));
        const cornerDistY = Math.max(0, Math.abs(dy) - (cy - height * 0.2));
        if (Math.sqrt(cornerDistX * cornerDistX + cornerDistY * cornerDistY) > width * 0.2) {
          a = 0; // transparent corners for non-maskable
        }
      }

      // Draw stylized white shield & house symbol inside
      if (a > 0) {
        // Shield shape: x between -innerRadius and innerRadius, y between -innerRadius and innerRadius*1.1
        const sx = dx / innerRadius;
        const sy = dy / innerRadius;

        // Inside shield or checkmark
        const inShield = (sy >= -0.8 && sy <= 0.8 && Math.abs(sx) <= (1 - Math.max(0, sy) * 0.5));
        const inHouse = (sy >= -0.4 && sy <= 0.5 && Math.abs(sx) <= 0.45);
        const inRoof = (sy < -0.2 && sy >= -0.7 && Math.abs(sx) <= (1 - (sy + 0.7) / 0.5 * 0.6));

        if (inRoof || inHouse) {
          // White symbol
          r = 255; g = 255; b = 255;
        } else if (inShield && (Math.abs(sx) > 0.85 || sy > 0.7 || sy < -0.7)) {
          // White shield outline
          r = 255; g = 255; b = 255;
        }
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const idat = makeChunk('IDAT', zlib.deflateSync(rawData));
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

const pubDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(pubDir)) {
  fs.mkdirSync(pubDir, { recursive: true });
}

// Generate PWA icons
fs.writeFileSync(path.join(pubDir, 'pwa-192x192.png'), generatePNG(192, 192, false));
fs.writeFileSync(path.join(pubDir, 'pwa-512x512.png'), generatePNG(512, 512, false));
fs.writeFileSync(path.join(pubDir, 'pwa-maskable-512x512.png'), generatePNG(512, 512, true));
fs.writeFileSync(path.join(pubDir, 'apple-touch-icon.png'), generatePNG(180, 180, false));
fs.writeFileSync(path.join(pubDir, 'favicon.ico'), generatePNG(64, 64, false));

console.log('Successfully generated all PWA PNG icons in /public');
