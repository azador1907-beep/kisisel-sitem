// Standalone steel-only regeneration; ceiling, stone and wood stay intact.
import { mkdirSync, writeFileSync } from 'node:fs';
const dir = new URL('../public/kabin-materyalleri/hd/', import.meta.url);
mkdirSync(dir, { recursive: true });
const names = ['Fırçalı Gümüş','Fırçalı Altın','Parlak Gümüş','Parlak Altın','Okyanus Mavisi','Buz Mavisi','Siyah İnoks','Oval Gümüş','Oval Altın','Kare Gümüş','Kare Altın','Benekli Gümüş','Benekli Altın','Yaprak Gümüş','Yaprak Altın','Arabesk Gümüş','Arabesk Altın','Çizgili Gümüş','Çizgili Altın','Örgü Gümüş','Örgü Altın','Dama Gümüş','Dama Altın','Altıgen Gümüş','Altıgen Altın','Kabartma Gümüş','Kabartma Altın'];
const goldIds = [2,4,9,11,13,15,17,19,21,23,25,27];
const gradient = (id, colors, vertical=false) => `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical?0:1}" y2="${vertical?1:0}">${colors.map((c,i)=>`<stop offset="${i/(colors.length-1)}" stop-color="${c}"/>`).join('')}</linearGradient>`;
for(let n=1;n<=27;n++) {
  const gold=goldIds.includes(n);
  const dark=gold?'#69501b':'#626c72';
  const mid=gold?'#b39443':'#adb6ba';
  const light=gold?'#fff0ac':'#edf1f2';
  let defs=gradient('base',gold?['#96762d','#dbc477','#b99c4a']:['#9aa5ac','#d3dadd','#b3bec3']);
  defs+=gradient('facet',[dark,mid,light,mid]);
  defs+=gradient('pressed',[light,mid,dark],true);
  const outlined = (path, fill='url(#facet)', stroke=dark, sw=5) => `<path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  let pattern='';
  let tile=256;
  if(n<=7) {
    const colors = {
      1:['#a3adb4','#c7cfd3','#a7b2ba'], 2:['#aa8634','#e6ce7b','#b69a49'],
      3:['#7b898f','#e9eff0','#a1afb5','#cfd8dc'],4:['#88601e','#f5e1a2','#b79a43','#e0c473'],
      5:['#124666','#397c9e','#1c5474'],6:['#759fc0','#b6deee','#5e8db3'],7:['#24282d','#42484d','#171d23'],
    };
    defs+=gradient('plain',colors[n]);
    pattern='<rect width="1024" height="1024" fill="url(#plain)"/>';
    if([1,2,5,7].includes(n)) for(let x=0;x<1024;x+=2)
      pattern+=`<path d="M${x} 0V1024" stroke="${x%6===0?'#fff':'#000'}" stroke-opacity="${0.025+(x%5)*0.008}" stroke-width=".8"/>`;
  } else {
    pattern='<rect width="256" height="256" fill="url(#base)"/>';
    if(n===8||n===9) {
      // Interlocking elongated ovals, alternating recessed and polished cells.
      for(let x=-64;x<=256;x+=64) for(let y=-128;y<=256;y+=128)
        pattern+=`<ellipse cx="${x+32}" cy="${y+64+(x%128?64:0)}" rx="28" ry="57" fill="url(#pressed)" stroke="${dark}" stroke-width="4"/>`;
    } else if(n===10||n===11) {
      for(let y=0;y<256;y+=128) for(let x=0;x<256;x+=128) {
        pattern+=`<rect x="${x+12}" y="${y+12}" width="104" height="104" rx="3" fill="${dark}"/>`;
        pattern+=`<rect x="${x+23}" y="${y+23}" width="82" height="82" fill="none" stroke="${light}" stroke-width="10"/>`;
        pattern+=`<rect x="${x+42}" y="${y+42}" width="44" height="44" fill="${mid}"/>`;
      }
    } else if(n===12||n===13) {
      // Deterministic irregular etched islands, intentionally high contrast.
      let seed=34897;
      const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
      for(let i=0;i<140;i++) {
        const x=rand()*256,y=rand()*256,r=4+rand()*13;
        const pts=Array.from({length:8},(_,j)=>{const a=j*Math.PI/4,rr=r*(.5+rand()*.65);return `${x+Math.cos(a)*rr},${y+Math.sin(a)*rr}`;});
        pattern+=`<polygon points="${pts.join(' ')}" fill="${i%3===0?light:dark}"/>`;
      }
    } else if(n===14||n===15) {
      for(let y=0;y<256;y+=128) for(let x=0;x<256;x+=128) {
        pattern+=`<g transform="translate(${x+64} ${y+64})">`;
        for(let a=0;a<360;a+=90) pattern+=`<g transform="rotate(${a})">${outlined('M0 0 Q-62 -6 -56 -56 Q-6 -62 0 0')}</g>`;
        pattern+='</g>';
      }
    } else if(n===16||n===17) {
      pattern+=outlined('M128 8 Q150 64 184 72 Q192 106 248 128 Q192 150 184 184 Q150 192 128 248 Q106 192 72 184 Q64 150 8 128 Q64 106 72 72 Q106 64 128 8',dark,light,5);
      pattern+=outlined('M128 40 Q144 92 164 92 Q164 112 216 128 Q164 144 164 164 Q144 164 128 216 Q112 164 92 164 Q92 144 40 128 Q92 112 92 92 Q112 92 128 40','url(#base)',mid,5);
      for(let a=0;a<360;a+=90) pattern+=`<g transform="translate(128 128) rotate(${a})"><path d="M0 0C-55 -16 -44 -68 -15 -54C12 -39 -22 -20 -20 -39" fill="none" stroke="${light}" stroke-width="5"/></g>`;
    } else if(n===18||n===19) {
      for(let y=0;y<256;y+=64) {
        pattern+=`<rect y="${y}" width="256" height="30" fill="${dark}"/>`;
        pattern+=`<rect y="${y+30}" width="256" height="5" fill="${light}"/>`;
      }
    } else if(n===20||n===21) {
      pattern+=`<rect width="256" height="256" fill="${dark}"/>`;
      for(let y=0;y<256;y+=128) for(let x=0;x<256;x+=128) {
        pattern+=`<g transform="translate(${x+64} ${y+64})">`;
        pattern+=outlined('M0 -56 L56 0 0 56 -56 0Z','none',light,10);
        pattern+=outlined('M-36 -36H36V36H-36Z','none',mid,9);
        pattern+=`<path d="M-56 0H56M0 -56V56" stroke="${light}" stroke-width="5"/></g>`;
      }
    } else if(n===22||n===23) {
      for(let y=0;y<256;y+=64) for(let x=0;x<256;x+=64) {
        const odd=(x+y)%128===0;
        pattern+=`<rect x="${x}" y="${y}" width="64" height="64" fill="${odd?'url(#pressed)':'url(#facet)'}"/>`;
        pattern+=`<path d="M${x} ${y+63}V${y}H${x+63}" fill="none" stroke="${light}" stroke-width="2"/>`;
      }
    } else if(n===24||n===25) {
      tile=256;
      // Rectangular periodic cell for a flat topped honeycomb lattice.
      for(let y=-128;y<=384;y+=128) for(let x=-128;x<=384;x+=128) {
        const cy=y+(x%256===0?64:0);
        pattern+=`<g transform="translate(${x} ${cy})">${outlined('M0 -64L56 -32V32L0 64 -56 32V-32Z',dark,light,5)}${outlined('M0 -43L37 -21V21L0 43 -37 21V-21Z','url(#facet)',mid,5)}</g>`;
      }
    } else {
      for(let y=-64;y<320;y+=64) for(let x=-32;x<288;x+=64) {
        pattern+=`<g transform="translate(${x+32} ${y+32}) rotate(${(x+y)%128===0?0:90})"><rect x="-12" y="-25" width="24" height="50" rx="10" fill="url(#pressed)" stroke="${dark}" stroke-width="3"/><path d="M-8 10V-12Q-8 -20 0 -20" fill="none" stroke="${light}" stroke-width="3"/></g>`;
      }
    }
    defs+=`<pattern id="motif" width="${tile}" height="${tile}" patternUnits="userSpaceOnUse" patternTransform="scale(2)">${pattern}</pattern>`;
    pattern='<rect width="1024" height="1024" fill="url(#motif)"/>';
  }
  const body=`<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="2048" viewBox="0 0 1024 1024"><title>${names[n-1]}</title><defs>${defs}</defs>${pattern}</svg>`;
  writeFileSync(new URL(`paslanmaz-${n}.svg`,dir),body);
}
console.log('Created 27 distinct steel finishes: silver, gold, blue, black and 10 patterned pairs.');

