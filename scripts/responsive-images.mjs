import sharp from 'sharp';
import fs from 'node:fs/promises';

// Encode existing images without generating or inventing product details.
const names = ['door-enhanced', 'teleskopik-kat-hq', 'merkezi-kat-hq', 'teleskopik-kabin-hq', 'merkezi-kabin-hq', 'yonsuz-mekanizma-hq', 'kanalsiz-esik-hq'];
const manifest = {};
for (const name of names) {
  const input = `public/media/${name}.webp`;
  const { width } = await sharp(input).metadata();
  manifest[name] = [];
  for (const size of [360, 720, width]) {
    const filename = `${name}-${size}.avif`;
    await sharp(input).resize({ width: size, withoutEnlargement: true }).avif({ quality: 58, effort: 6 }).toFile(`public/media/${filename}`);
    manifest[name].push({ src: `/media/${filename}`, width: size });
  }
}
await fs.writeFile('src/data/responsiveImages.json', JSON.stringify(manifest, null, 2) + '\n');
console.log('Responsive AVIF images created; existing WebP fallback and source images preserved.');
