# Has Door yenileme analizi — 13 Eylül 2026

## Başlangıç durumu
- React 19, React Router 7, Vite 8, Tailwind 4; Three.js / React Three Fiber / Drei ile kabin tasarım aracı.
- Beş mevcut URL: `/`, `/urunler`, `/kabin-tasarla`, `/hakkimizda`, `/iletisim`.
- `src/components` içinde sayfa bileşenleri ve bağımsız kabin konfigürasyon mantığı; genel footer yok.
- Ana sayfa afişi, açılışta 2 saniye engelleyici karşılama; sabit 400px katalog ve adsız oklar. Tek başlık/meta; 404 yok; içerik yalnız istemci render'ı.
- `public/katalog.pdf` mevcut değil; SPA rewrite dosya isteğini HTML'e çeviriyor.
- İletişim formu mevcut Formspree `mnjepbzy` adresine POST yapıyor. Firma e-postası ve çalışma saatleri kaynaklarda yok.
- Logo 975.881 bayt, favicon 870.602 bayt. Asıl PNG'ler korunarak WebP ve küçük favicon türevleri üretilecek.
- `react-pageflip`, `react-photo-view` yeni akışta gerekli değil. Eski App.css ve başlangıç framework görselleri kullanılmıyor.
- İlk production dependency audit: 0 açık. Frontend'de gizli anahtar gerektiren servis yok; Formspree form ID'si herkese açık bir yönlendirme kimliği.
- Kabin bileşeni, konfigürasyonu, tavan tasarımları ve testlerinde kullanıcıya ait değişiklikler var; korunacak.

## İçerik ve doğrulama
- Firma: Has Door Asansör Kapı Sistemleri; Kadıkendi Mah. 8515 Cad. No: 2 B, Eyyübiye / Şanlıurfa.
- Telefonlar: +90 544 389 01 85, +90 542 409 36 17. Şehitlik V. D., sicil 32913.
- Hakkımızda: kapı sistemi imalatı; konut, ticari, endüstriyel projeler; projeye özel çözümler; üretimden teslimata destek. Kuruluş tarihi, garanti süresi, sertifika numarası, tamamlanmış proje yok.
- 14 katalog PNG'si tek tek görsel olarak incelendi. Teleskopik kat/kabin, merkezi kat/kabin kapıları mevcut. Mekanizma: yönsüz sistem ve yengeç kilidi; alt eşik kanalsız sistem açıklaması korunacak.
- Teknik kaynaklar: katalog6 genel mekanizma, katalog7 teleskopik kat tablosu, katalog8 teleskopik kabin tablosu, katalog13 merkezi kat tablosu, katalog14 merkezi kabin tablosu. Tablolardaki farklar tek değere indirgenmeyecek; çizimlerdeki örnek ölçüler evrensel ürün ölçüsü gibi sunulmayacak.
- Katalogdaki standart işaretleri belge yerine geçmez; sertifika iddiası eklenmeyecek.

## Yeni bilgi mimarisi ve uygulama
- Mevcut URL'ler korunur; dört ürün detay sayfası, hizmetler, tam katalog, gerçek uygulama alanlarını anlatan projeler sayfası, gizlilik/çerez açıklaması, 404 eklenir.
- Projeler sayfası tamamlanmış referans iddiası içermez; konut/ticari/endüstriyel ihtiyaçları ve proje görüşmesi akışını anlatır.
- Grafit / sıcak metal / kırık beyaz tasarım; merkezi CSS tokenları; yerel Türkçe destekli Manrope fontu.
- Ortak navbar, footer, breadcrumb, CTA, ürün kartı, sayfa başlığı. React Router ile geçiş; 3D araç ayrı lazy chunk.
- Vite SSR build ile statik HTML üretimi: tüm kurumsal sayfalarda taranabilir içerik, özgün metadata, canonical, OG, Twitter, Organization/Product/Breadcrumb JSON-LD. Sitemap ve robots.
- Formspree adresi korunur; erişilebilir doğrulama, honeypot, bekleme/başarı/hata, tekrar gönderim kontrolü. Gerçek gönderim yapılmadan testlerde servis yanıtları taklit edilir; teslimat doğrulaması ayrıca gerekir.
- Harita isteğe bağlı yüklenir; analitik ve pazarlama izleyicisi eklenmez. Gerçek e-posta/saat/sosyal hesap uydurulmaz.
- QA: build, lint, mevcut kabin testleri, içerik/link/SEO kontrolleri, istenen 9 genişlikte overflow ve tarayıcı testleri.
