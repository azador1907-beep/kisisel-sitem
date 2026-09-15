import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { products, catalog, whatsapp } from '../src/data/site.js';
import { getMeta, routes, headHtml, structuredData } from '../src/lib/seo.js';
import { validateContact, contactPayload } from '../src/lib/contact.js';

test('Every product has existing source drawings, images and unique URL', () => {
  assert.equal(new Set(products.map(p => p.slug)).size, 6);
  for (const p of products) {
    for (const image of p.gallery) assert.ok(existsSync(`public/media/${image}.webp`) || existsSync(`public/${image}.png`), image);
    assert.ok(existsSync(`public/${p.source}`));
    assert.ok(existsSync(`public/media/${p.image}.webp`));
    if (p.type === 'system') continue;
    assert.equal(p.dimensions.length,5);
    assert.deepEqual(p.dimensions.map(row => row[0]),[700,800,900,1000,1100]);
  }
  assert.equal(catalog.length,14);
  assert.ok(existsSync('public/katalog.pdf'));
});
test('Technical table values stay faithful to catalog, including type differences', () => {
  assert.deepEqual(products[0].dimensions[2], [900,1250,1370]);
  assert.deepEqual(products[1].dimensions[2], [900,1600,1850]);
  assert.equal(products[2].extra.find(([key]) => key === 'Kontrol kartı')[1], 'KM10S');
});
test('All public pages have unique metadata and valid structured data', () => {
  assert.equal(new Set(routes.map(r => getMeta(r).title)).size,routes.length);
  for (const route of routes) {
    const meta=getMeta(route);
    assert.equal(meta.noindex,false);
    assert.ok(meta.description.length > 50);
    assert.ok(meta.canonical.startsWith('https://www.hasdoorasansor.com/'));
    assert.ok(headHtml(meta).includes('application/ld+json'));
    const data=structuredData(meta);
    assert.equal(data['@context'],'https://schema.org');
    if (meta.product) assert.ok(data['@graph'].some(x => x['@type']==='Product'));
  }
  assert.equal(getMeta('/does-not-exist').noindex,true);
  assert.equal(getMeta('/urunler/unknown').noindex,true);
});
test('Contact validation rejects blank, malformed and oversize values', () => {
  const valid={name:'Deneme Kullanıcı',email:'test@example.com',message:'900 mm kapı hakkında bilgi istiyorum.',phone:'+90 544 000 00 00'};
  assert.deepEqual(validateContact(valid),{});
  assert.equal(Object.keys(validateContact({})).length,3);
  assert.ok(validateContact({...valid,email:'invalid'}).email);
  assert.ok(validateContact({...valid,phone:'abc'}).phone);
  assert.ok(validateContact({...valid,message:'x'.repeat(3001)}).message);
  assert.ok(validateContact({...valid,name:'x'.repeat(101)}).name);
  const clean=contactPayload({...valid,name:'  Test  ',unknown:'ignore'});
  assert.equal(clean.name,'Test');
  assert.equal('unknown' in clean,false);
});
test('WhatsApp link encodes product and message text safely', () => {
  const url=new URL(whatsapp('Kapı & panel? ölçü 900 mm'));
  assert.equal(url.hostname,'wa.me');
  assert.equal(url.pathname,'/905443890185');
  assert.equal(url.searchParams.get('text'),'Kapı & panel? ölçü 900 mm');
});

