export const CEILING_COLORS = [
  { id: 'silver', name: 'Gümüş', color: '#89969b' },
  { id: 'gold', name: 'Altın', color: '#b39850' },
  { id: 'bronze', name: 'Bronz', color: '#907061' },
  { id: 'champagne', name: 'Şampanya', color: '#b8a58a' },
  { id: 'black', name: 'Siyah', color: '#353a3e' },
  { id: 'blue', name: 'Mavi', color: '#326780' },
  { id: 'copper', name: 'Bakır', color: '#aa7352' },
];
// Fixed outer strips, with every selected design restricted to the center.
export const CEILING_CENTER = { left: 0.18, width: 0.64 };
export const ceilingColor = id => CEILING_COLORS.find(item => item.id === id) || CEILING_COLORS[0];

export function composeCeiling(image, colorId, sideColorId = 'silver') {
  const size = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const color = ceilingColor(colorId).color;
  ctx.fillStyle = ceilingColor(sideColorId).color;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = color;
  ctx.fillRect(size * CEILING_CENTER.left, 0, size * CEILING_CENTER.width, size);
  const shine = ctx.createLinearGradient(0, 0, size, 0);
  shine.addColorStop(0, '#ffffff18'); shine.addColorStop(0.45, '#00000018'); shine.addColorStop(1, '#ffffff12');
  ctx.fillStyle = shine; ctx.fillRect(0, 0, size, size);

  const left = Math.round(size * CEILING_CENTER.left);
  const width = Math.round(size * CEILING_CENTER.width);
  const mask = document.createElement('canvas');
  mask.width = width; mask.height = size - 80;
  const mx = mask.getContext('2d');
  const designSize = width * .9;
  mx.drawImage(image, (width - designSize) / 2, (mask.height - designSize) / 2, designSize, designSize);
  const pixels = mx.getImageData(0, 0, width, mask.height);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const light = (pixels.data[i] + pixels.data[i + 1] + pixels.data[i + 2]) / 3;
    const alpha = Math.max(0, Math.min(1, (light - 216) / 24));
    pixels.data[i] = 245; pixels.data[i + 1] = 247; pixels.data[i + 2] = 244;
    pixels.data[i + 3] = Math.round(pixels.data[i + 3] * alpha);
  }
  mx.putImageData(pixels, 0, 0);
  ctx.drawImage(mask, left, 40);
  ctx.strokeStyle = '#4a555e'; ctx.lineWidth = 5;
  for (const x of [left, left + width]) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, size); ctx.stroke(); }
  // These four spots stay identical for every ceiling pattern.
  for (const x of [left / 2, size - left / 2]) for (const y of [size * .22, size * .78]) {
    ctx.fillStyle = '#fff2d9'; ctx.fillRect(x - 32, y - 32, 64, 64);
    ctx.strokeStyle = '#617079'; ctx.lineWidth = 9; ctx.strokeRect(x - 35, y - 35, 70, 70);
  }
  ctx.strokeStyle = '#fff2d9'; ctx.lineWidth = 9;
  ctx.strokeRect(left + 18, 40, width - 36, size - 80);
  ctx.strokeStyle = '#67747c'; ctx.lineWidth = 12; ctx.strokeRect(6, 6, size - 12, size - 12);
  return canvas;
}
