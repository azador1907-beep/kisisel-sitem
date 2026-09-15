import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowUpRight,
  Layers3,
  MoveHorizontal,
  ScanLine,
} from 'lucide-react';

import {
  Button,
  Picture,
  SectionHeading,
  ProductCard,
  CTASection,
} from '../components/ui';

import { products, services } from '../data/site';

const principles = [
  {
    Icon: Layers3,
    title: 'Üretim odaklı',
    text: 'Asansör kapı sistemlerinde uzmanlık',
  },
  {
    Icon: MoveHorizontal,
    title: 'Projeye uygun',
    text: 'Merkezi ve teleskopik çözümler',
  },
  {
    Icon: ScanLine,
    title: 'Detaylara özen',
    text: 'İşlev ve estetiği buluşturan yaklaşım',
  },
];

const studioFeatures = [
  'Duvar ve panel malzemeleri',
  'Ayna, tavan ve zemin seçenekleri',
  'Etkileşimli üç boyutlu önizleme',
];

export default function Home() {
  const featuredProducts = products.slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section
        className="home-hero"
        aria-labelledby="home-hero-title"
      >
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <span
                className="live-line"
                aria-hidden="true"
              />
              MÜHENDİSLİK. ESTETİK. GÜVEN.
            </p>

            <h1 id="home-hero-title">
              Her katta kalite.
              <br />

              <span>
                Her detayda
                <br className="desktop-break" />
                {' '}Has Door.
              </span>
            </h1>

            <p className="hero-description">
              Yapınıza değer katan otomatik asansör kapı sistemleri.
              Şanlıurfa’da üretim, projenize özel çözümler.
            </p>

            <div className="button-row">
              <Button
                to="/urunler"
                variant="gold"
              >
                Ürünleri İncele
              </Button>

              <Button
                to="/iletisim"
                variant="outline-light"
              >
                Teklif Al
              </Button>
            </div>

            <a
              className="hero-scroll"
              href="#cozumler"
              aria-label="Ürün çözümlerimizi keşfedin"
            >
              <ArrowDown
                size={16}
                aria-hidden="true"
              />

              ÇÖZÜMLERİMİZİ KEŞFEDİN
            </a>
          </div>

          <div className="hero-visual">
            <Picture
              name="door-enhanced"
              alt="Has Door cam panelli otomatik asansör kapısı"
              priority
            />

            <div className="hero-image-caption">
              <span>
                HAS DOOR
                <br />
                <strong>Asansör kapı sistemleri</strong>
              </span>

              <span
                className="caption-cross"
                aria-hidden="true"
              >
                +
              </span>
            </div>

            <span
              className="vertical-note"
              aria-hidden="true"
            >
              TASARIMDAN ÜRETİME, HER DETAYDA ÖZEN
            </span>
          </div>
        </div>
      </section>

      {/* PRENSİPLER */}
      <section
        className="principles"
        aria-label="Has Door çalışma yaklaşımı"
      >
        <div className="container principles-grid">
          {principles.map(({ Icon, title, text }, index) => (
            <div key={title}>
              <span
                className="principle-number"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <Icon
                size={25}
                strokeWidth={1.3}
                aria-hidden="true"
              />

              <div>
                <h2>{title}</h2>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ÜRÜNLER */}
      <section
        id="cozumler"
        className="section container"
        aria-labelledby="home-products-title"
      >
        <SectionHeading
          eyebrow="ÜRÜN AİLEMİZ"
          title={
            <span id="home-products-title">
              Doğru kapı.
              <br />
              Güçlü bir başlangıç.
            </span>
          }
          text="Farklı açılım biçimleri, ortak bir kalite anlayışı. Projenize uygun kat ve kabin kapılarını keşfedin."
        >
          <Link
            className="text-link"
            to="/urunler"
          >
            Tüm ürünleri incele

            <ArrowUpRight
              size={19}
              aria-hidden="true"
            />
          </Link>
        </SectionHeading>

        <div className="product-grid home-products">
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* KABİN TASARIM */}
      <section
        className="studio-section"
        aria-labelledby="studio-title"
      >
        <div className="container studio-grid">
          <div
            className="studio-art"
            aria-hidden="true"
          >
            <div className="studio-frame">
              <div className="studio-ceiling" />

              <div className="studio-wall left-wall" />

              <div className="studio-back">
                <span />
                <span />
                <span />
              </div>

              <div className="studio-wall right-wall" />
              <div className="studio-floor" />
            </div>

            <div className="material-swatches">
              <span />
              <span />
              <span />
              <span />
            </div>

            <span className="studio-art-label">
              MALZEME. DOKU. KARAKTER.
            </span>
          </div>

          <div className="studio-copy">
            <p className="eyebrow">
              HAS DOOR / TASARIM STÜDYOSU
            </p>

            <h2 id="studio-title">
              Sizin çizginiz.
              <br />
              Sizin kabininiz.
            </h2>

            <p>
              Malzemeleri bir araya getirin. Duvarlardan tavana,
              aynadan zemine kadar seçimlerinizi canlı 3D
              önizlemede keşfedin.
            </p>

            <ul className="studio-features">
              {studioFeatures.map((feature, index) => (
                <li key={feature}>
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {feature}
                </li>
              ))}
            </ul>

            <Button
              to="/kabin-tasarla"
              variant="gold"
            >
              Kabinini Tasarla
            </Button>
          </div>
        </div>
      </section>

      {/* HİZMETLER */}
      <section
        className="section container"
        aria-labelledby="services-title"
      >
        <SectionHeading
          eyebrow="NASIL ÇALIŞIYORUZ?"
          title={
            <span id="services-title">
              İhtiyacınızı anlar, detayları birlikte çözeriz.
            </span>
          }
        />

        <div className="service-list">
          {services.map((service, index) => (
            <Link
              to={service.to}
              className="service-row"
              key={service.id}
              aria-label={`${service.title}: detayları incele`}
            >
              <span
                className="row-number"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <h3>{service.title}</h3>

              <p>{service.text}</p>

              <ArrowUpRight
                size={27}
                strokeWidth={1.3}
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* HAKKIMIZDA */}
      <section
        className="about-teaser"
        aria-labelledby="about-teaser-title"
      >
        <div className="container about-teaser-grid">
          <div>
            <p className="eyebrow">
              BİZ HAS DOOR’UZ
            </p>

            <h2 id="about-teaser-title">
              Güven, her detayda
              <br />
              yeniden üretilir.
            </h2>
          </div>

          <div>
            <p>
              Şanlıurfa merkezli Has Door olarak konut,
              ticari yapı ve endüstriyel projeler için
              asansör kapı sistemleri üretiyoruz.
              Mühendislik bakış açısını titiz işçilikle
              bir araya getiriyoruz.
            </p>

            <Link
              className="text-link"
              to="/hakkimizda"
            >
              Bizi yakından tanıyın

              <ArrowUpRight
                size={18}
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}