// Deterministic vector assets: geometric ceiling apertures and etched steel.
// Run from the project root: node scripts/build-cabin-patterns.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
const dir = new URL('../public/kabin-materyalleri/hd/', import.meta.url);
mkdirSync(dir, { recursive: true });
const svg = body => `<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="2048" viewBox="0 0 1024 1024">${body}</svg>`;
const rect = (x,y,w,h,fill,rx=0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
const led = (x,y,w,h,r=2) => rect(x-2,y-2,w+4,h+4,'#45515a',r+1)+rect(x,y,w,h,'#f3f5f2',r);
for (let n=1;n<=23;n++) {
  let body=rect(0,0,1024,1024,n%4===0?'#454f57':'#89969b');
  const mode=(n-1)%8, inset=60+(Math.floor((n-1)/8)*14);
  if (mode===0) {
    body+=led(405,inset,214,1024-inset*2);
    for(const x of [inset,1024-inset-252]) for(let c=0;c<3;c++) for(let r=0;r<12;r++)
      body+=led(x+c*87,inset+r*(1024-inset*2)/12,68,(1024-inset*2)/12-16);
  } else if(mode===1) {
    for(let c=0;c<5;c++) body+=led(inset+c*(1024-inset*2)/5,inset,70,1024-inset*2,14);
  } else if(mode===2) {
    for(let r=0;r<6;r++) for(let c=0;c<6;c++) body+=led(inset+c*145,inset+r*145,110,110,4);
  } else if(mode===3) {
    for(let r=0;r<7;r++) for(let c=0;c<7;c++) body+=`<circle cx="${inset+50+c*125}" cy="${inset+50+r*125}" r="29" fill="#f4f6f3" stroke="#505d65" stroke-width="3"/>`;
  } else if(mode===4) {
    body+=led(inset,inset,1024-2*inset,1024-2*inset,40);
    body+=rect(inset+36,inset+36,952-2*inset,952-2*inset,'#66757e',22);
    body+=led(420,200,184,624,12);
  } else if(mode===5) {
    for(let r=0;r<9;r++) body+=led(inset,inset+r*100,1024-2*inset,52,8);
  } else if(mode===6) {
    for(let r=0;r<5;r++) for(let c=0;c<5;c++) body+=`<g transform="translate(${130+c*185} ${130+r*185}) rotate(45)">${led(-42,-42,84,84,2)}</g>`;
  } else {
    for(let r=0;r<4;r++) {
      const k=70+r*100;
      body+=`<rect x="${k}" y="${k}" width="${1024-k*2}" height="${1024-k*2}" rx="18" fill="none" stroke="#f1f4f3" stroke-width="24"/>`;
    }
  }
  body+=`<rect x="12" y="12" width="1000" height="1000" fill="none" stroke="#aeb7ba" stroke-width="10"/>`;
  writeFileSync(new URL(`tavan-${n}.svg`,dir),svg(body));
}
import './build-steel-patterns.mjs';
console.log('Created 23 ceiling and 27 stainless steel vector textures at 2048 × 2048.');

