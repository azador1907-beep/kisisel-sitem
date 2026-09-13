const fs=require('fs');
const a=require('./A.json'),ceilings=require('./o.json');
const root='public/kabin-materyalleri/eka';fs.mkdirSync(root,{recursive:true});fs.mkdirSync('src/data',{recursive:true});
const origin='https://kabindizayn.emlakkonutasansor.com';
const catalog=[];const jobs=new Map();
function asset(src){if(!src)return null;const name=Buffer.from(src).toString('base64url')+require('path').extname(src);jobs.set(name,src);return '/kabin-materyalleri/eka/'+name}
for(const m of a){
const type=/Paslanmaz/.test(m.group||'')?'paslanmaz':m.group==='MDF'?'laminant':m.group==='Granit'?'granit':null;
if(!type)continue;
const url=asset(type==='paslanmaz'?m.image:m.map||m.image);
catalog.push({id:'eka-'+type+'-'+m.id,type,name:m.translations?.tr?.title||m.title||m.id,group:m.group,url,thumbnail:asset(m.image),color:'#ffffff',source:origin+(m.map||m.image)});
}
const shapes={
Line:'<path d="M330 90V1958M1718 90V1958" />',
Hide:'<path d="M1350 70V1360H1978M70 750H1350M650 750V1978M650 1360H1350" />',
Pool:'<path d="M580 80V1968M1468 80V1968" /><g fill="#fff" stroke="#bac5cb" stroke-width="12"><circle cx="275" cy="480" r="42"/><circle cx="1773" cy="480" r="42"/><circle cx="275" cy="1570" r="42"/><circle cx="1773" cy="1570" r="42"/></g>',
Spark:'<rect x="704" y="704" width="640" height="640" fill="#fff" stroke="#bac5cb" stroke-width="10"/>'
};
for(const c of ceilings){const filename='tavan-'+c.title.toLowerCase()+'.svg';
fs.writeFileSync(root+'/'+filename,'<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="2048" viewBox="0 0 2048 2048"><defs><linearGradient id="s" x2="1" y2="0.7"><stop stop-color="#d9dfe1"/><stop offset=".48" stop-color="#9ca8ad"/><stop offset="1" stop-color="#cad1d4"/></linearGradient></defs><rect width="2048" height="2048" fill="url(#s)"/><rect x="25" y="25" width="1998" height="1998" rx="8" fill="none" stroke="#839096" stroke-width="12"/><g stroke="#fff" stroke-width="24" fill="none">'+shapes[c.title]+'</g></svg>');
catalog.push({id:'eka-tavan-'+c._id,type:'tavan',name:'EKA '+c.title,group:'EKA Tavan',url:'/kabin-materyalleri/eka/'+filename,thumbnail:asset(c.image),color:'#ffffff',source:origin+c.image,adaptation:'Vector ceiling layout adapted to this cabin geometry'});
}
(async()=>{const queue=[...jobs];let done=0;await Promise.all(Array.from({length:4},async()=>{for(;;){const job=queue.shift();if(!job)return;const [name,src]=job;const path=root+'/'+name;if(!fs.existsSync(path)){const r=await fetch(new URL(src,origin));if(!r.ok||!r.headers.get('content-type')?.startsWith('image/'))throw Error(src+': '+r.status);fs.writeFileSync(path,Buffer.from(await r.arrayBuffer()))}done++;}}));fs.writeFileSync('src/data/ekaMaterials.json',JSON.stringify(catalog,null,2));console.log({assets:done,counts:catalog.reduce((r,x)=>(r[x.type]=(r[x.type]||0)+1,r),{})})})().catch(e=>{console.error(e);process.exitCode=1})

