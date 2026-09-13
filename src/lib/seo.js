import { company, products } from '../data/site.js';
const pages = {
  '/': ['Asansör Kapı Sistemleri ve İmalatı | Has Door Şanlıurfa','Has Door: Şanlıurfa’da merkezi ve teleskopik asansör kapısı üretimi. Kat ve kabin kapılarını inceleyin, projeniz için teklif alın.'],
  '/urunler': ['Otomatik Asansör Kapıları | Has Door Ürünler','Teleskopik ve merkezi kat ve kabin kapıları. Has Door ürünlerini, teknik çizimleri ve ölçü tablolarını inceleyin.'],
  '/hizmetler': ['Asansör Kapısı Üretimi ve Proje Çözümleri | Has Door','Asansör kapı sistemi imalatı, projeye özel çözümler ve etkileşimli kabin tasarımı. Has Door hizmetlerini keşfedin.'],
  '/projeler': ['Konut, Ticari ve Endüstriyel Proje Çözümleri | Has Door','Konut, ticari yapı ve endüstriyel projeler için asansör kapı çözümleri. Kapı ölçüsü ve açılım tercihinizi birlikte değerlendirelim.'],
  '/hakkimizda': ['Hakkımızda | Has Door Asansör Şanlıurfa','Şanlıurfa merkezli Has Door, asansör kapı sistemlerinde mühendislik ve titiz işçiliği bir araya getirir. Çalışma anlayışımızı tanıyın.'],
  '/iletisim': ['İletişim ve Teklif | Has Door Asansör','Has Door ile iletişime geçin. Şanlıurfa Eyyübiye’de asansör kapı sistemleri için telefon, WhatsApp ve teklif formu.'],
  '/kabin-tasarla': ['3D Kabin Tasarla | Has Door Tasarım Stüdyosu','Duvar, ayna, tavan ve zemin seçeneklerini bir araya getirin. Has Door tasarım stüdyosunda kabininizi 3D önizlemeyle keşfedin.'],
  '/katalog': ['Asansör Kapısı Teknik Kataloğu | Has Door','Has Door ürün kataloğu: merkezi ve teleskopik kapı ölçüleri, mekanizma bilgileri ve teknik çizimler. PDF kataloğunu indirin.'],
  '/gizlilik-politikasi': ['Gizlilik Açıklaması | Has Door','Has Door web sitesi iletişim formu, Formspree, WhatsApp ve harita bağlantılarının kullanımına ilişkin gizlilik açıklaması.'],
  '/cerez-politikasi': ['Çerez ve Bağlantı Tercihleri | Has Door','Has Door web sitesinde çerezler, isteğe bağlı harita ve dış hizmet bağlantıları hakkında bilgi.'],
};
export const routes = [...Object.keys(pages), ...products.map(p => `/urunler/${p.slug}`)];
export function getMeta(pathname) {
  const path = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  const product = products.find(p => `/urunler/${p.slug}` === path);
  const page = product ? [`${product.name} — Teknik Özellikler | Has Door`, `${product.description} Ölçü tabloları, teknik çizimler ve teklif seçenekleri.`] : pages[path];
  return { path, title: page?.[0] || 'Sayfa Bulunamadı | Has Door', description: page?.[1] || 'Aradığınız sayfa bulunamadı. Has Door ürünlerini keşfedin veya bizimle iletişime geçin.', canonical: company.url + (path === '/' ? '/' : path), image: company.url + `/media/${product?.image || 'door-enhanced'}.webp`, noindex: !page, product };
}
export function structuredData(meta) {
  const business = { '@type':'Organization', '@id':company.url+'/#organization', name:company.name, url:company.url, logo:company.url+'/media/logo.webp', telephone:company.phone, address:{'@type':'PostalAddress',streetAddress:'Kadıkendi Mah. 8515 Cad. No: 2 B',addressLocality:'Eyyübiye',addressRegion:'Şanlıurfa',addressCountry:'TR'} };
  const graph = [business];
  if (meta.product) graph.push({'@type':'Product',name:meta.product.name,description:meta.description,image:meta.image,url:meta.canonical,category:meta.product.category});
  if (meta.path !== '/' && !meta.noindex) {
    const crumbs = [{'@type':'ListItem',position:1,name:'Ana Sayfa',item:company.url+'/'}];
    if (meta.product) crumbs.push({'@type':'ListItem',position:2,name:'Ürünler',item:company.url+'/urunler'});
    crumbs.push({'@type':'ListItem',position:crumbs.length+1,name:meta.product?.name || meta.title.split('|')[0].trim(),item:meta.canonical});
    graph.push({'@type':'BreadcrumbList',itemListElement:crumbs});
  }
  return {'@context':'https://schema.org','@graph':graph};
}
export function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
export function headHtml(meta) {
  return `<title>${escapeHtml(meta.title)}</title>\n<meta name="description" content="${escapeHtml(meta.description)}">\n<link rel="canonical" href="${escapeHtml(meta.canonical)}">\n<meta name="robots" content="${meta.noindex ? 'noindex, follow' : 'index, follow'}">\n<meta property="og:locale" content="tr_TR">\n<meta property="og:type" content="website">\n<meta property="og:site_name" content="Has Door">\n<meta property="og:title" content="${escapeHtml(meta.title)}">\n<meta property="og:description" content="${escapeHtml(meta.description)}">\n<meta property="og:url" content="${escapeHtml(meta.canonical)}">\n<meta property="og:image" content="${escapeHtml(meta.image)}">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${escapeHtml(meta.title)}">\n<meta name="twitter:description" content="${escapeHtml(meta.description)}">\n<meta name="twitter:image" content="${escapeHtml(meta.image)}">\n<script id="structured-data" type="application/ld+json">${JSON.stringify(structuredData(meta)).replace(/</g,'\\u003c')}</script>`;
}
