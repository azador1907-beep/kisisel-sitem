# Has Door kurumsal web sitesi

React 19, React Router 7, Vite 8, Tailwind 4 ve yerel Manrope fontu. Vite SSR ile kurumsal sayfalar build sırasında statik HTML'e dönüştürülür. Kabin tasarımının mevcut Three.js uygulaması kendi lazy paketinde tutulur.

## Çalıştırma
```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5175
npm run lint
npm test
npm run build
node scripts/verify-build.mjs
node scripts/serve-dist.mjs 4177
```
Geliştirme: http://127.0.0.1:5175/ . Üretim çıktısı önizlemesi: http://127.0.0.1:4177/ . Çıktı: `dist`.

## Sayfalar ve içerik
Ana sayfa, ürünler, 6 kapı/sistem detayı, hizmetler, proje çözümleri, hakkımızda, iletişim, katalog, gizlilik, çerezler, 404. `/kabin-tasarla` korunmuştur. Dört kapı türü ile yönsüz mekanizma ve kanalsız alt eşik, mevcut katalogdan alınmıştır. Proje sayfası uygulama alanlarını açıklar; uydurma referans/proje/rakam içermez.

Merkezi içerik: `src/data/site.js`. Tasarım tokenları: `src/site.css`. Yenilenen sayfalar: `src/pages`. Ortak navbar, footer, CTA, breadcrumb, görsel ve kart bileşenleri: `src/components`. Kabin tasarım dosyaları bu yenileme kapsamında değiştirilmez.

## Görseller
Orijinal PNG'ler korunmuştur. Optimize WebP'ler `public/media` içindedir. Altı ürün görseli ve ana sayfa görseli referanslardan ImageGen ile hazırlanmış temsili görsellerdir; teknik belge yerine geçmez. Kaynak/istem bilgisi: `docs/IMAGE-PROVENANCE.md`. `public/katalog.pdf`, 14 orijinal katalog sayfasını içerir. PDF görsel QA'sı yapılmıştır.

## Form
Mevcut Formspree `mnjepbzy` adresi korunur. Ad/e-posta/mesaj doğrulaması, uzunluk sınırları, honeypot, çift gönderim önleme, 20 saniye zaman aşımı, başarı/hata mesajları vardır. Bir dakikalık istemci bekleme kontrolü sunucu rate-limit'i değildir; sunucu spam koruması Formspree tarafındadır. Gerçek müşteri mesajı gönderilmemiştir; Formspree hesabının alıcısı ve teslimatı panelden doğrulanmalıdır. Doğrulanmış firma e-postası, çalışma saatleri ve sosyal hesap bulunmadığı için uydurulmamıştır.

## SEO / performans
16 kamuya açık rota için özgün title, description, canonical, OG/Twitter bilgileri; Organization, Product ve Breadcrumb JSON-LD. Sitemap, robots, gerçek 404 çıktısı. Ağır 3D/PDF bağımlılıkları sadece kabin aracında yüklenir. Kurumsal ana JS yaklaşık 294 KB / 92 KB gzip; CSS yaklaşık 62 KB / 14 KB gzip. Fontlar ve görseller yereldir; responsive görüntüler, lazy loading ve sabit boyutlar kullanılır. Kabin chunk'ı mevcut yapısı nedeniyle 500 KB uyarısı verir; kullanıcı talebiyle kabin uygulaması değiştirilmez.

## Doğrulama
- Lint ve build başarılı.
- 12 Node testi başarılı (7 mevcut kabin testi + 5 site testi).
- 16 statik sayfada 185 yerel dosya bağlantısı, tek H1, alt metin, JSON-LD ve 404 kontrolü başarılı.
- Kabin dışındaki 16 sayfa/404 × 9 genişlik = 144 kontrol: 320, 375, 390, 414, 768, 1024, 1280, 1440, 1920 px; yatay taşma yok.
- Ürün filtresi, arama boş durumu, form hata/focus davranışı, mobil menü ve Kabin Tasarla bağlantısı test edildi.
- Test edilen üretim önizlemesinde console error kaydı yok.
- Lighthouse puanı ölçülmedi; formun gerçek e-posta teslimatı doğrulanmadı.

## Yayınlama
Vercel yapılandırması `vercel.json` içindedir; mevcut URL'ler korunur. Otomatik GitHub yayını bağlıysa `main` güncellemesi Vercel build'ini başlatır. Aksi halde ilgili Vercel hesabında oturum açılıp mevcut `kisisel-sitem` projesine deploy edilmelidir. Yeni proje/alan adı oluşturulmaz.
