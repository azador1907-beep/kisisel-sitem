# Kabin HD malzemeleri

Bu kaynaklar 12 Eylül 2026 tarihinde bu proje için oluşturuldu. Referans sitenin görselleri kopyalanmadı.

- 23 tavan ve 27 paslanmaz desen: scripts/build-cabin-patterns.mjs ile oluşturulan, 2048 × 2048 raster boyutu tanımlı SVG kaynaklar.
- granite.png, gneiss.png, walnut.png, oak.png, granit-26.png, granit-27.png: yerleşik Imagegen ile yeni üretilen 1254 × 1254 PNG kaynaklar. İsteklerde 2048 talep edildi; araç çıktısı 1254 oldu, yapay boyut büyütme uygulanmadı.
- 25 standart taş seçeneği iki taş kaynağının; 27 laminant seçeneği iki ahşap kaynağının malzeme renk varyantlarıdır. 104 bağımsız fotoğraf değildir.
- KabinTasarim.jsx içindeki materialSource aynı kaynak ve renk eşlemesini menü, 3D yüzey ve zemin yansıması için kullanır.
- Eski düşük çözünürlüklü PNG dosyaları korunur ancak konfigüratörde HD kaynaklar kullanılır.
- Yeni görseller tasarım önizlemesidir; gerçek üretici ürün kodlarının birebir renk/desen garantisi değildir.

## Imagegen prompt set

### granite.png
Generate a production-ready seamless albedo texture for a luxury elevator configurator. Square 2048x2048 texture. Orthographic straight-on scan of natural medium grey salt-and-pepper granite, intricate irregular interlocking quartz feldspar biotite crystals, small and medium angular mineral grains, neutral grayscale palette with rich detail, realistic stone photograph, perfectly uniform diffuse flat lighting, no directional lighting, no gloss hotspots, no shadows, no perspective, no border, no text, no objects. Single continuous stone surface covering every pixel. Tileable matching opposite edges. This is a source texture, not a rendered room or material sphere.

### walnut.png
Create a seamless texture image, square 2048x2048 requested, of premium natural walnut wood veneer in a neutral warm medium brown color. Production albedo source for a 3D elevator laminate wall. Straight-on flat orthographic scan, fine vertical wood grain flows from top to bottom with subtle long cathedral curves, exquisite pores and fine fibers, natural non-repetitive variations, no planks or seams, no gaps, perfectly even diffuse lighting, no shadows no shiny hotspots no perspective, no room no objects no text no border. Entire image is one uninterrupted veneer sheet; opposite edges should tile seamlessly.

### granit-26.png
Production albedo texture for a 3D elevator floor. Square 2048x2048 requested. Exact orthographic top down scan of a complete luxury marble inlay floor panel. Rich black natural marble field with restrained very fine white veins. Inside a centered square double border of ivory marble and narrow warm bronze lines, a precise crisp eight-point compass rose built of ivory, charcoal and warm tan marble. Restrained ornamental corner triangles and double geometric frame. Symmetric sophisticated Italian stone craftsmanship. Motif fills central 65 percent of the square, generous continuous black marble margin to all four edges. All straight edges razor sharp and aligned, physically flat, uniform diffuse lighting, no gloss no reflections no cast shadows no perspective no room no text no logos. One complete design, no repeated motif, fill entire image.

### granit-27.png
Production albedo source texture, square 2048x2048 requested, exact orthographic top-down flat scan of a luxury elevator stone floor inlay. Warm ivory beige natural marble entire field, subtle tiny pale honey veins. One centered elegant eight petal flower rosette made of alternating dark espresso marble and warm reddish travertine petals, occupying central 40 percent, inside a crisp thin double square border of espresso stone and narrow tan stone occupying central 72 percent. Generous ivory marble margins. Precise geometric symmetry, sharp outlines, delicate real stone grain. Full entire floor artwork visible. Uniform diffuse neutral lighting, absolutely no perspective, shadows, gloss, reflections, room, objects, text, watermarks or logos. One single continuous panel, not repeating.

### oak.png
Seamless albedo material texture, square 2048x2048 requested. Natural light silver ivory white oak veneer sheet, subtle very fine vertically aligned long grain and pores, occasional elegant cathedral grain, neutral desaturated pale beige silver wood tones, bright but preserving very fine realistic fibers. Single continuous sheet no planks, perfectly even diffuse light no shadows no gloss no perspective. Orthographic straight on photographic scan for 3D laminate wall textures. No text, no objects, no border, no watermark, opposite edges tile seamlessly.

### gneiss.png
Seamless albedo source texture for architectural 3D floor rendering. Square 2048x2048 requested. Light cool gray natural flowing gneiss granite with elegant medium grey and charcoal mineral ribbons, fine interlocking quartz detail, layered organic diagonal veins, restrained contrast. Looks like a close scan of real premium stone, never clouds or painting. Entire frame one uninterrupted flat stone surface. Orthographic, perfectly even diffuse lighting, no shadows, highlights, polish, perspective, objects, text or borders. Opposite edges should tile seamlessly.

## Paslanmaz seti v2
Paslanmazlar scripts/build-steel-patterns.mjs ile tek başına yenilenebilir. 1–7: fırçalı/parlak gümüş-altın, okyanus mavisi, buz mavisi ve siyah. 8–27: oval, kare, benekli, yaprak, arabesk, yatay çizgi, örgü, dama, altıgen ve kabartma desenlerinin gümüş/altın çiftleri. Referans katalogdaki çeşitlilik esas alınarak özgün SVG geometrileri çizildi. Küçük önizlemelerde okunabilirlik için desen kontrastı artırıldı. Tavan, ahşap ve taş kaynakları değiştirilmedi.
