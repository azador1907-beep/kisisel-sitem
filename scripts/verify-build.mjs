import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { routes, getMeta } from '../src/lib/seo.js';
let links=0;
for(const route of routes){
  const file=route==='/'?'dist/index.html':`dist${route}/index.html`;
  const html=await readFile(file,'utf8');
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${route} should have one h1`);
  assert.ok(html.includes(getMeta(route).title.replace(/&/g,'&amp;')),`${route} title`);
  for(const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)){
    const target=match[1];
    if(target==='/'||routes.includes(target))continue;
    assert.ok(existsSync(`dist${target}`)||existsSync(`dist${target}/index.html`),`${route} broken asset/link: ${target}`);
    links++;
  }
  for(const img of html.matchAll(/<img\b[^>]*>/g)) assert.ok(/\balt=/.test(img[0]),`${route} missing alt`);
  const json=html.match(/<script id="structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(json,`${route} missing schema`); JSON.parse(json[1]);
}
assert.ok((await readFile('dist/404.html','utf8')).includes('noindex, follow'));
console.log(`Verified ${routes.length} prerendered pages and ${links} local asset links, headings, alt text, JSON-LD and 404.`);
