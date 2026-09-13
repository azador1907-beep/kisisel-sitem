import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
await mkdir('public/media', { recursive: true });
const names = ['logo', 'logo1', 'asansorkapi', 'asansorkapi1', 'katalog', 'katalog1', 'katalog2', 'katalog3', 'katalog5', 'katalog6', 'katalog7', 'katalog8', 'katalog9', 'katalog10', 'katalog11', 'katalog12', 'katalog13', 'katalog14'];
for (const name of names) {
  const input = `public/${name}.png`;
  await sharp(input).resize({ width: name === 'logo' ? 480 : 1000, withoutEnlargement: true }).webp({ quality: 88 }).toFile(`public/media/${name}.webp`);
  await sharp(input).resize({ width: 360, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`public/media/${name}-360.webp`);
}
await sharp('public/favicon.png').resize(48, 48).png().toFile('public/media/favicon.png');
console.log('Original images preserved; optimized derivatives created.');
