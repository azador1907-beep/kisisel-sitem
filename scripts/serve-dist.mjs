import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root=resolve('dist');
const port=Number(process.argv[2] || process.env.PORT || 4177);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.pdf':'application/pdf','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.glb':'model/gltf-binary'};
createServer(async(req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});res.end();return;}
  let path;
  try { path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname)); } catch {res.writeHead(400);res.end();return;}
  if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);res.end();return;}
  let status=200;
  try{if((await stat(path)).isDirectory())path=resolve(path,'index.html');await stat(path);}catch{path=resolve(root,'404.html');status=404;}
  try{const body=await readFile(path);res.writeHead(status,{'Content-Type':types[extname(path)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:body);}catch{res.writeHead(500);res.end('Önizleme hazırlanamadı.');}
}).listen(port,'127.0.0.1',()=>console.log(`Production preview: http://127.0.0.1:${port}`));
