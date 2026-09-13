import fs from 'node:fs/promises';
import sharp from 'sharp';
const root='C:/Users/azado/.codex/generated_images/01a09a1a-5783-79d3-a577-2eac72e0eb8d/';
const items=[['teleskopik-kat-hq','exec-e5c7e457-fe0c-416e-a8e7-4e69095b62bd.png'],['merkezi-kat-hq','exec-83300368-c08b-48f0-be48-f4402891e4ff.png'],['teleskopik-kabin-hq','exec-766a525d-7870-46b0-b249-89932b1e7f2d.png'],['merkezi-kabin-hq','exec-d9cda228-cfde-43ec-ade8-3e6b7f7f7a89.png'],['yonsuz-mekanizma-hq','exec-df90b62f-1b5f-48c7-9b86-1f0121238d91.png'],['kanalsiz-esik-hq','exec-6035cc2e-567e-4d7d-8610-695de7c1152a.png']];
await fs.mkdir('docs/image-sources',{recursive:true});
for(const [name,file] of items){await fs.copyFile(root+file,`docs/image-sources/${name}.png`);for(const [suffix,width,quality] of [['',1120,91],['-360',360,88]])await sharp(root+file).resize({width}).webp({quality}).toFile(`public/media/${name}${suffix}.webp`);}
const sizes={};for(const f of (await fs.readdir('public/media')).filter(f=>f.endsWith('.webp')&&!f.includes('-360'))){const m=await sharp('public/media/'+f).metadata();sizes[f.replace('.webp','')]=[m.width,m.height];}await fs.writeFile('src/data/imageSizes.json',JSON.stringify(sizes,null,2));
