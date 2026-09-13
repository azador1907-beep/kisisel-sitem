import { writeFileSync } from 'node:fs';
const ids=[1,2,3,4,5,6,7,8,9,10,11,12,21,22,23,24];
const rect=(x,y,w,h,r=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
const circle=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}"/>`;
const turn=(angle,shape)=>`<g transform="translate(500 500) rotate(${angle})">${shape}</g>`;
for(let index=0;index<ids.length;index++){
 const id=ids[index];let body='';
 if(id===1){for(let y=85;y<940;y+=105)for(let x=85;x<940;x+=105)if(x<330||x>670||y<330||y>670)body+=rect(x,y,55,55);for(const y of [100,200,770,870])body+=rect(350,y,300,35)}
 if(id===2){for(let n=0;n<5;n++){const k=70+n*80;body+=`<rect x="${k}" y="${k}" width="${1000-k*2}" height="${1000-k*2}" rx="15" fill="none" stroke="#f5f7f4" stroke-width="25"/>`}}
 if(id===3){for(let y=100;y<900;y+=205)for(let x=100;x<900;x+=205){body+=rect(x,y,125,125);for(let j=0;j<3;j++)for(let k=0;k<3;k++)body+=rect(x+140+k*20,y+j*30,10,15)}}
 if(id===4){body+=circle(500,500,28);for(let n=0;n<6;n++){body+=turn(n*60,'<path d="M15 -140 C-90 -230 10 -335 -20 -425 C130 -325 160 -230 15 -140Z"/>');body+=turn(n*60,circle(0,-450,25))}}
 if(id===5){body+=circle(500,500,30);for(let n=0;n<8;n++)body+=turn(n*45,'<path d="M-18 -65 L-70 -315 L70 -315 L18 -65Z"/>');for(let n=0;n<9;n++)for(const y of [60,880])body+=rect(60+n*100,y,55,55);for(let n=1;n<8;n++)for(const x of [60,880])body+=rect(x,60+n*100,55,55)}
 if(id===6){for(let ring=1;ring<6;ring++)for(let n=0;n<12;n++)body+=turn(n*30+ring*9,`<path d="M0 ${-ring*77-32} L25 ${-ring*77} L0 ${-ring*77+32} L-25 ${-ring*77}Z"/>`)}
 if(id===7){for(const offset of [0,180])for(let r=140;r<440;r+=70)for(let angle=-66;angle<=66;angle+=22)body+=turn(angle+offset,rect(-22,-r,44,52,4))}
 if(id===8){for(let y=1;y<=5;y++)for(let x=1;x<=5;x++){const size=48-Math.abs(x-3)*7-Math.abs(y-3)*7;body+=`<path transform="translate(${x*165} ${y*165})" d="M${-size} ${-size} Q0 ${-size/3} ${size} ${-size} Q${size/3} 0 ${size} ${size} Q0 ${size/3} ${-size} ${size} Q${-size/3} 0 ${-size} ${-size}Z"/>`}}
 if(id===9){body+=circle(500,500,32);for(let n=0;n<28;n++)body+=turn(n*360/28,'<path d="M-8 -95 L-23 -390 Q0 -455 23 -390 L8 -95Z"/>')}
 if(id===10){for(let n=0;n<8;n++)body+=turn(n*45,'<path d="M0 -40 L-95 -365 L0 -290 L95 -365Z"/>')}
 if(id===11){for(let n=0;n<12;n++)for(let ring=0;ring<5;ring++)body+=turn(n*30,ring%2?rect(-14-ring*5,-90-ring*75,28+ring*10,35):circle(0,-90-ring*75,12+ring*3))}
 if(id===12||id===22){for(let y=70;y<940;y+=48)for(const x of id===22?[125,520]:[80,705])body+=rect(x,y,id===22?355:210,25,12)}
 if(id===21){body+=circle(500,500,34);for(let n=0;n<8;n++)body+=turn(n*45,'<path d="M-25 -75 C-155 -110 -115 -240 -155 -285 C-235 -360 -130 -400 -110 -340 C-105 -220 60 -190 35 -115 Q15 -80 -25 -75Z"/>')}
 if(id===23){for(let y=-2;y<=2;y++)for(let x=-2;x<=2;x++)if(Math.abs(x)+Math.abs(y)<=2)body+=rect(455+x*130,455+y*130,90,90);for(const ox of [80,770])for(const oy of [80,770])for(let y=0;y<4;y++)for(let x=0;x<4;x++)body+=rect(ox+x*35,oy+y*35,20,20)}
 if(id===24){for(let y=70;y<900;y+=220)for(let x=70;x<900;x+=220){body+=rect(x+62,y+62,60,60);body+=`<path d="M${x} ${y}H${x+185}L${x+132} ${y+50}H${x+53}Z M${x} ${y+185}H${x+185}L${x+132} ${y+135}H${x+53}Z M${x} ${y+15}V${y+170}L${x+50} ${y+130}V${y+55}Z M${x+185} ${y+15}V${y+170}L${x+135} ${y+130}V${y+55}Z"/>`}}
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="2048" viewBox="0 0 1000 1000"><rect width="1000" height="1000" fill="#353c42"/><g fill="#f5f7f4">${body}</g></svg>`;
 writeFileSync(new URL(`../public/kabin-materyalleri/hd/tavan-${24+index}.svg`,import.meta.url),svg);
}
console.log('Created 16 reference ceiling patterns');
