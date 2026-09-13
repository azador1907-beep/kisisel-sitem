import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getMeta, structuredData } from '../lib/seo';
export default function SEO() {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = getMeta(pathname);
    document.title = meta.title;
    const tags = [ ['name','description',meta.description], ['name','robots',meta.noindex ? 'noindex, follow' : 'index, follow'], ['property','og:title',meta.title], ['property','og:description',meta.description], ['property','og:url',meta.canonical], ['property','og:image',meta.image], ['property','og:type','website'], ['property','og:locale','tr_TR'], ['property','og:site_name','Has Door'], ['name','twitter:card','summary_large_image'], ['name','twitter:title',meta.title], ['name','twitter:description',meta.description], ['name','twitter:image',meta.image] ];
    for (const [attribute,key,value] of tags) { let el = document.head.querySelector(`meta[${attribute}="${key}"]`); if (!el) { el = document.createElement('meta'); el.setAttribute(attribute,key); document.head.append(el); } el.setAttribute('content',value); }
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
    canonical.href = meta.canonical;
    let json = document.getElementById('structured-data');
    if (!json) { json = document.createElement('script'); json.id = 'structured-data'; json.type = 'application/ld+json'; document.head.append(json); }
    json.textContent = JSON.stringify(structuredData(meta));
  }, [pathname]);
  return null;
}
