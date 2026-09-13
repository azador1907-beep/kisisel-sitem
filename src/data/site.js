export const company = {
  name: 'Has Door Asansör Kapı Sistemleri',
  url: 'https://www.hasdoorasansor.com',
  phone: '+90 544 389 01 85', phoneHref: 'tel:+905443890185',
  secondPhone: '+90 542 409 36 17', secondPhoneHref: 'tel:+905424093617',
  address: 'Kadıkendi Mah. 8515 Cad. No: 2 B, Eyyübiye / Şanlıurfa',
  formEndpoint: 'https://formspree.io/f/mnjepbzy',
  map: 'https://www.google.com/maps?q=37.1585807,38.749009',
};
export const whatsapp = (text = 'Merhaba, Has Door asansör kapı sistemleri hakkında bilgi almak istiyorum.') => `https://wa.me/905443890185?text=${encodeURIComponent(text)}`;
export const catalog = ['', '1', '2', '3', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'].map((n, i) => ({ image: `katalog${n}`, label: [
  'Yönsüz mekanizma ve kanalsız alt eşik', '2 panel teleskopik kat kapısı', '2 panel teleskopik kabin kapısı ve mekanizma',
  'Teleskopik kat kapısı açılım çizimi', 'Teleskopik kat kapısı kasa çizimi', 'Mekanizma bilgileri ve eşik detayları',
  'Teleskopik kat kapısı ölçü tablosu', 'Teleskopik kabin kapısı ölçü tablosu', '2 panel merkezi kat kapısı',
  'Merkezi kat kapısı kasa çizimi', 'Merkezi kat kapısı açılım çizimi', 'Merkezi kat kapısı yan görünümü',
  'Merkezi kat kapısı ölçü tablosu', 'Merkezi kabin kapısı ölçü tablosu',
][i] }));
export const products = [
  { slug: 'teleskopik-kat-kapisi', name: 'Teleskopik kat kapısı', category: 'Kat kapıları', image: 'katalog1', drawing: 'katalog7', opening: 'Teleskopik',
    description: 'Aynı yöne hareket eden iki panel. Kat girişleri için, proje ölçülerine göre seçilebilen teleskopik kapı sistemi.',
    features: ['2 panel teleskopik açılım', 'Alüminyum eşik', '700–1100 mm net giriş seçenekleri'],
    dimensions: [[700,950,1070],[800,1100,1220],[900,1250,1370],[1000,1400,1520],[1100,1550,1670]], extra: [],
    gallery: ['katalog1','katalog3','katalog5','katalog7'], source: 'katalog7.png',
  },
  { slug: 'merkezi-kat-kapisi', name: 'Merkezi kat kapısı', category: 'Kat kapıları', image: 'katalog9', drawing: 'katalog13', opening: 'Merkezi',
    description: 'Ortadan iki yana açılan panellerle dengeli bir giriş. Merkezi açılıma uygun kat yerleşimleri için kapı sistemi.',
    features: ['2 panel merkezi açılım', 'Alüminyum eşik', '700–1100 mm net giriş seçenekleri'],
    dimensions: [[700,1400,1450],[800,1500,1650],[900,1600,1850],[1000,1700,2050],[1100,1800,2250]], extra: [],
    gallery: ['katalog9','katalog10','katalog11','katalog12','katalog13'], source: 'katalog13.png',
  },
  { slug: 'teleskopik-kabin-kapisi', name: 'Teleskopik kabin kapısı', category: 'Kabin kapıları', image: 'katalog2', drawing: 'katalog8', opening: 'Teleskopik',
    description: 'Kabin girişinde iki panelli teleskopik çözüm. Mekanizma ve kapı ölçülerini projenizin gereksinimleriyle birlikte değerlendirin.',
    features: ['2 panel teleskopik açılım', 'KM10S kontrol kartı', 'Kormas motor, Astra fiş kontak'],
    dimensions: [[700,950,1070],[800,1100,1220],[900,1250,1370],[1000,1400,1520],[1100,1550,1670]],
    extra: [['Kontrol kartı','KM10S'],['Motor','Kormas'],['Fiş kontak','Astra'],['S ölçüsü (katalog)','240–320 mm']],
    gallery: ['katalog2','katalog8','katalog6'], source: 'katalog8.png',
  },
  { slug: 'merkezi-kabin-kapisi', name: 'Merkezi kabin kapısı', category: 'Kabin kapıları', image: 'katalog14', drawing: 'katalog14', opening: 'Merkezi',
    description: 'Kabin girişinde ortadan açılan iki panel. Merkezi kat kapısıyla birlikte değerlendirebileceğiniz, teknik çizimlerle sunulan çözüm.',
    features: ['2 panel merkezi açılım', '700–1100 mm net giriş seçenekleri', '2000–2200 mm kapı yüksekliği'],
    dimensions: [[700,1400,1450],[800,1500,1650],[900,1600,1850],[1000,1700,2050],[1100,1800,2250]], extra: [],
    gallery: ['katalog14'], source: 'katalog14.png',
  },
];
const enhancedImages = ['teleskopik-kat-hq','merkezi-kat-hq','teleskopik-kabin-hq','merkezi-kabin-hq'];
products.forEach((product,index) => {
  product.originalImage = product.image;
  product.image = enhancedImages[index];
  product.gallery = [product.image,...product.gallery];
});
products.push(
  { slug:'yonsuz-mekanizma', name:'Yönsüz kapı mekanizması', category:'Mekanizma ve eşik', type:'system', opening:'Yönsüz sistem', image:'yonsuz-mekanizma-hq', originalImage:'katalog', gallery:['yonsuz-mekanizma-hq','katalog'], source:'katalog.png',
    description:'Yengeç kilit sistemiyle mekanizmayı ihtiyaç duyulan yönde kullanmaya yönelik, katalogda sunulan yönsüz sistem.',
    features:['Yönsüz mekanizma yapısı','Yengeç kilit sistemi','Katalogda iki yön görünümü'],
    extra:[['Sistem','Yönsüz kapı mekanizması'],['Kilit yapısı','Yengeç kilit sistemi']],
    detail:'Mekanizma seçimi, kapı tipi ve açılım yönüyle birlikte değerlendirilir. Katalogdaki iki yön görünümünü inceleyerek projeniz için uygun yapılandırmayı görüşebilirsiniz.' },
  { slug:'kanalsiz-alt-esik', name:'Kanalsız alt eşik sistemi', category:'Mekanizma ve eşik', type:'system', opening:'Alt eşik sistemi', image:'kanalsiz-esik-hq', originalImage:'katalog', gallery:['kanalsiz-esik-hq','katalog'], source:'katalog.png',
    description:'Kapı girişindeki alt eşik detayını odağa alan, mevcut katalogda gösterilen kanalsız sistem çözümü.',
    features:['Kanalsız alt eşik yaklaşımı','Kapı girişinde eşik detayı','Projeye göre birlikte değerlendirme'],
    extra:[['Sistem','Kanalsız alt eşik'],['Uygulama','Asansör kapısı alt eşik detayı']],
    detail:'Eşik uygulaması kapı sistemi, giriş ölçüleri ve montaj detaylarıyla birlikte belirlenir. Kataloğun sistem tanıtım sayfasındaki görünümü inceleyin; uygunluğu ve uygulama ölçülerini teknik görüşmede netleştirelim.' }
);
export const services = [
  { id: 'uretim', title: 'Asansör kapısı üretimi', text: 'Konut, ticari yapı ve endüstriyel projeler için teleskopik ve merkezi asansör kapı sistemleri.', detail: 'Kat ve kabin kapısı seçeneklerini, net giriş ölçüsü ve açılım biçimine göre birlikte değerlendirin.', cta: 'Ürünleri incele', to: '/urunler' },
  { id: 'proje', title: 'Projeye özel çözümler', text: 'Yapınızın ihtiyaçlarına, kapı yerleşimine ve kullanım amacına odaklanan bir çalışma anlayışı.', detail: 'Proje çizimlerinizi, kat sayısını ve ihtiyaç duyduğunuz kapı tipini paylaşarak görüşmeyi başlatabilirsiniz.', cta: 'Projenizi konuşalım', to: '/iletisim' },
  { id: 'tasarim', title: 'Kabin tasarım deneyimi', text: 'Duvar, ayna, tavan ve zemin seçeneklerini üç boyutlu ortamda bir araya getirin.', detail: 'Malzeme seçimlerini canlı önizlemede karşılaştırın. Oluşturduğunuz görünümü teklif görüşmenize başlangıç olarak kullanın.', cta: 'Kabin tasarla', to: '/kabin-tasarla' },
];
