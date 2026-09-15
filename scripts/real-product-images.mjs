import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

// These crops use only photographs already supplied in Has Door's own catalog.
// No generated parts, renders, or third-party product imagery are introduced.
const products = [
  { name: 'teleskopik-kat-photo', source: 'public/katalog1.png', crop: { left: 56, top: 82, width: 462, height: 662 } },
  { name: 'merkezi-kat-photo', source: 'public/katalog9.png', crop: { left: 32, top: 86, width: 498, height: 626 } },
  { name: 'teleskopik-kabin-photo', source: 'public/katalog2.png', crop: { left: 32, top: 118, width: 518, height: 410 } },
  { name: 'yonsuz-mekanizma-photo', source: 'public/katalog.png', crop: { left: 0, top: 0, width: 588, height: 298 } },
  { name: 'kanalsiz-esik-photo', source: 'public/katalog.png', crop: { left: 290, top: 474, width: 298, height: 312 } },
];

const sizes = JSON.parse(await readFile('src/data/imageSizes.json', 'utf8'));
const responsive = JSON.parse(await readFile('src/data/responsiveImages.json', 'utf8'));

for (const product of products) {
  const cropped = await sharp(product.source)
    .extract(product.crop)
    .resize({ width: 930, height: 1210, fit: 'contain', background: '#f7f4ec' })
    .flatten({ background: '#f7f4ec' })
    .toBuffer();
  const output = sharp({ create: { width: 1120, height: 1400, channels: 3, background: '#f7f4ec' } })
    .composite([{ input: cropped, gravity: 'center' }]);
  const rendered = await output.png().toBuffer();

  await sharp(rendered).webp({ quality: 88 }).toFile(`public/media/${product.name}.webp`);
  sizes[product.name] = [1120, 1400];
  responsive[product.name] = [];
  for (const width of [360, 720, 1120]) {
    const file = `${product.name}-${width}.avif`;
    await sharp(rendered).resize({ width }).avif({ quality: 58, effort: 6 }).toFile(`public/media/${file}`);
    responsive[product.name].push({ src: `/media/${file}`, width });
  }
}

await writeFile('src/data/imageSizes.json', `${JSON.stringify(sizes, null, 2)}\n`);
await writeFile('src/data/responsiveImages.json', `${JSON.stringify(responsive, null, 2)}\n`);
console.log('Created responsive crops from Has Door catalog product photographs.');
