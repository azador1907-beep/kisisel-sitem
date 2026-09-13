import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { render } from '../dist-server/entry-server.js';
import { routes, getMeta, headHtml } from '../src/lib/seo.js';
import { company } from '../src/data/site.js';
const template = await readFile('dist/index.html','utf8');
for (const route of [...routes, '/404']) {
  const html = template.replace(/<!--seo-start-->[\s\S]*?<!--seo-end-->/, headHtml(getMeta(route)))
    .replace('<div id="root"></div>', `<div id="root">${render(route)}</div>`);
  const target = route === '/' ? 'dist/index.html' : route === '/404' ? 'dist/404.html' : `dist${route}/index.html`;
  await mkdir(dirname(target),{recursive:true});
  await writeFile(target, html);
}
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(r => `<url><loc>${company.url}${r}</loc></url>`).join('')}</urlset>`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${company.url}/sitemap.xml\n`);
console.log(`Prerendered ${routes.length} public routes and 404, sitemap and robots.`);
