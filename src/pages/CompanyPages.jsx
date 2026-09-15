import { Link } from 'react-router-dom';

import {
  ArrowUpRight,
  Building2,
  Factory,
  House,
  Layers3,
  ScanLine,
  Settings2,
} from 'lucide-react';

import {
  company,
  services,
} from '../data/site';

import {
  Button,
  CTASection,
  PageHeading,
  Picture,
  SectionHeading,
} from '../components/ui';


/* =========================================================
   HAKKIMIZDA
========================================================= */

const values = [
  {
    Icon: Settings2,
    title: 'Mühendislik bakışı',
    text:
      'Her ürünü, yapının teknik gereksinimleri ve kullanım deneyimiyle birlikte değerlendiriyoruz.',
  },

  {
    Icon: Layers3,
    title: 'Üretimde özen',
    text:
      'Kalite ve dayanıklılığı malzeme seçiminden işçiliğe kadar tüm sürecin odağında tutuyoruz.',
  },

  {
    Icon: ScanLine,
    title: 'Müşteri odaklılık',
    text:
      'İhtiyaçları dinliyor, projeye özel çözümlerle uzun vadeli bir çalışma ilişkisi kurmayı hedefliyoruz.',
  },
];


export function About() {
  return (
    <>
      <PageHeading
        eyebrow="Hakkımızda"
        title={
          <>
            Güvenle açılan
            <br />
            bir geleceğe.
          </>
        }
        text="Şanlıurfa’da asansör kapı sistemleri üretiyor, mühendislik ve titiz işçiliği aynı noktada buluşturuyoruz."
      />

      <section
        className="section container company-story"
        aria-labelledby="about-story-title"
      >
        <div className="story-visual">
          <Picture
            name="door-enhanced"
            alt="Has Door otomatik asansör kapı sistemi"
            priority
          />

          <span>
            HAS DOOR / ASANSÖR KAPI SİSTEMLERİ
          </span>
        </div>

        <div>
          <p className="eyebrow">
            ÜRETTİĞİMİZ HER DETAYDA
          </p>

          <h2 id="about-story-title">
            Kaliteyi bir çalışma biçimi olarak görüyoruz.
          </h2>

          <p>
            Has Door, Şanlıurfa merkezli, asansör kapı sistemleri
            üretimi alanında faaliyet gösteren bir imalat firmasıdır.
            Kalite, güvenlik ve dayanıklılığı temel prensip edinerek
            konut, ticari yapı ve endüstriyel projeler için modern
            kapı çözümleri üretiyoruz.
          </p>

          <p>
            Üretim süreçlerimizde teknolojiyi, mühendislik bakış
            açısını ve titiz işçiliği bir araya getiriyoruz.
            Uzun ömürlü kullanım, performans ve estetik, ürün
            geliştirme yaklaşımımızın merkezinde yer alıyor.
          </p>

          <p>
            Proje ihtiyaçlarına özel çözümler sunuyor; üretimden
            teslimata kadar güvenilir bir iş ortağı olmayı
            hedefliyoruz.
          </p>

          <Button
            to="/iletisim"
            variant="outline"
          >
            Tanışalım
          </Button>
        </div>
      </section>

      <section
        className="values-section"
        aria-labelledby="values-title"
      >
        <div className="container section">
          <SectionHeading
            eyebrow="ÇALIŞMA ANLAYIŞIMIZ"
            title={
              <span id="values-title">
                Sağlam bir yaklaşım.
                <br />
                Ortak bir hedef.
              </span>
            }
          />

          <div className="values-grid">
            {values.map(
              ({
                Icon,
                title,
                text,
              }) => (
                <article key={title}>
                  <Icon
                    size={28}
                    strokeWidth={1.3}
                    aria-hidden="true"
                  />

                  <h3>
                    {title}
                  </h3>

                  <p>
                    {text}
                  </p>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      <section
        className="section container vision-grid"
        aria-label="Has Door vizyon ve misyonu"
      >
        <div>
          <p className="eyebrow">
            VİZYONUMUZ
          </p>

          <h2>
            Yerelden geleceğe.
          </h2>

          <p>
            Türkiye’de asansör kapı sistemleri sektörünün öncü
            markalarından biri olmak ve kaliteli üretim anlayışımızı
            uluslararası pazarlara taşımak.
          </p>
        </div>

        <div>
          <p className="eyebrow">
            MİSYONUMUZ
          </p>

          <h2>
            Kalıcı değer üretmek.
          </h2>

          <p>
            Güvenli, dayanıklı ve yenilikçi ürünlerle müşterilerimize
            uzun yıllar değer katmak. Kaliteyi, güveni ve sürdürülebilir
            üretimi ön planda tutmak.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}


/* =========================================================
   HİZMETLER
========================================================= */

const serviceImages = [
  {
    name: 'asansorkapi1',
    alt:
      'Asansör kapı sistemi mekanizması ve panelleri',
  },

  {
    name: 'katalog10',
    alt:
      'Merkezi kat kapısı teknik ölçü çizimi',
  },
];


const processSteps = [
  {
    title:
      'İhtiyacı paylaşın',

    text:
      'Kapı tipi, ölçüler ve uygulama alanını bize iletin.',
  },

  {
    title:
      'Detayları değerlendirelim',

    text:
      'Ürün seçeneklerini ve proje gereksinimlerini birlikte inceleyelim.',
  },

  {
    title:
      'Teklifi netleştirelim',

    text:
      'Üretim ve teslimat detaylarını görüşerek projenizi ilerletelim.',
  },
];


export function Services() {
  return (
    <>
      <PageHeading
        eyebrow="Hizmetler"
        title={
          <>
            Bir üründen fazlası.
            <br />
            Birlikte geliştirilen çözümler.
          </>
        }
        text="Kapı sistemi üretiminden projenize uygun seçime kadar, ihtiyaçlarınıza odaklanan bir çalışma anlayışı."
      />

      <section
        className="section container"
        aria-label="Has Door hizmetleri"
      >
        {services.map(
          (
            service,
            index,
          ) => (
            <article
              className="service-detail"
              key={service.id}
              id={service.id}
            >
              <div
                className="service-detail-number"
                aria-hidden="true"
              >
                {String(
                  index + 1,
                ).padStart(
                  2,
                  '0',
                )}
              </div>

              <div>
                <p className="eyebrow">
                  HAS DOOR ÇÖZÜMLERİ
                </p>

                <h2>
                  {service.title}
                </h2>

                <p>
                  {service.text}
                </p>

                <p>
                  {service.detail}
                </p>

                <Button
                  to={service.to}
                  variant="outline"
                >
                  {service.cta}
                </Button>
              </div>

              <div
                className="service-detail-art"
                aria-label={`${service.title} görseli`}
              >
                {index < 2 ? (
                  <Picture
                    name={
                      serviceImages[
                        index
                      ].name
                    }
                    alt={
                      serviceImages[
                        index
                      ].alt
                    }
                  />
                ) : (
                  <div
                    className="material-display"
                    aria-label="Kabin malzeme seçenekleri"
                  >
                    <span
                      aria-hidden="true"
                    />

                    <span
                      aria-hidden="true"
                    />

                    <span
                      aria-hidden="true"
                    />

                    <p>
                      DUVAR / AYNA / TAVAN / ZEMİN
                    </p>
                  </div>
                )}
              </div>
            </article>
          ),
        )}
      </section>

      <section
        className="process-section"
        aria-labelledby="process-title"
      >
        <div className="container section">
          <SectionHeading
            eyebrow="BİRLİKTE İLERLEYELİM"
            title={
              <span id="process-title">
                Projenizden doğru kapıya.
              </span>
            }
          />

          <ol className="process-grid">
            {processSteps.map(
              (
                step,
                index,
              ) => (
                <li
                  key={
                    step.title
                  }
                >
                  <span
                    aria-hidden="true"
                  >
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      '0',
                    )}
                  </span>

                  <h3>
                    {step.title}
                  </h3>

                  <p>
                    {step.text}
                  </p>
                </li>
              ),
            )}
          </ol>
        </div>
      </section>

      <CTASection />
    </>
  );
}


/* =========================================================
   PROJELER
========================================================= */

const projectSectors = [
  {
    Icon: House,

    title:
      'Konut projeleri',

    text:
      'Günlük yaşamın doğal bir parçası. Kat ve kabin kapılarını bina yerleşimi ve giriş ölçüleriyle birlikte değerlendirin.',

    detail:
      'Kapı açılımı, net giriş ve kabin görünümü.',
  },

  {
    Icon: Building2,

    title:
      'Ticari yapılar',

    text:
      'İş merkezleri ve ticari yapılar için işlev ile estetiği bir arada düşünün. Proje detaylarını teknik ekibimizle paylaşın.',

    detail:
      'Kullanım senaryosu, kapı tipi ve mimari uyum.',
  },

  {
    Icon: Factory,

    title:
      'Endüstriyel projeler',

    text:
      'Projenizin teknik gereksinimlerini belirleyerek uygun asansör kapısı seçeneklerini birlikte inceleyin.',

    detail:
      'Yerleşim, teknik çizimler ve uygulama ölçüleri.',
  },
];


const projectRequirements = [
  'Yapının kullanım amacı ve konumu',

  'İhtiyaç duyulan kat ve kabin kapısı adedi',

  'Net giriş ve kapı yüksekliği',

  'Varsa proje çizimleri ve açılım tercihi',
];


export function Projects() {
  return (
    <>
      <PageHeading
        eyebrow="Proje çözümleri"
        title={
          <>
            Farklı yapılar.
            <br />
            Aynı özen.
          </>
        }
        text="Konut, ticari yapı ve endüstriyel projeler için asansör kapı sistemleri. Kullanım alanınıza uygun çözümü birlikte belirleyelim."
      />

      <section
        className="section container"
        aria-labelledby="project-sectors-title"
      >
        <SectionHeading
          eyebrow="UYGULAMA ALANLARI"
          title={
            <span id="project-sectors-title">
              Yapınızın ihtiyaçlarını merkeze alıyoruz.
            </span>
          }
        />

        <div className="project-sectors">
          {projectSectors.map(
            (
              {
                Icon,
                title,
                text,
                detail,
              },
              index,
            ) => (
              <article
                key={title}
              >
                <div className="sector-top">
                  <span
                    aria-hidden="true"
                  >
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      '0',
                    )}
                  </span>

                  <Icon
                    size={55}
                    strokeWidth={1}
                    aria-hidden="true"
                  />
                </div>

                <h2>
                  {title}
                </h2>

                <p>
                  {text}
                </p>

                <p className="sector-detail">
                  {detail}
                </p>

                <Link
                  className="text-link"
                  to="/iletisim"
                >
                  Projenizi paylaşın

                  <ArrowUpRight
                    size={17}
                    aria-hidden="true"
                  />
                </Link>
              </article>
            ),
          )}
        </div>

        <div className="project-brief">
          <div>
            <p className="eyebrow">
              PROJE GÖRÜŞMESİ
            </p>

            <h2>
              İlk adım için
              <br />
              neler gerekli?
            </h2>
          </div>

          <ul>
            {projectRequirements.map(
              (
                requirement,
              ) => (
                <li
                  key={
                    requirement
                  }
                >
                  {requirement}
                </li>
              ),
            )}
          </ul>

          <Button to="/iletisim">
            Projemi Görüşmek İstiyorum
          </Button>
        </div>
      </section>

      <CTASection />
    </>
  );
}


/* =========================================================
   GİZLİLİK / ÇEREZLER
========================================================= */

export function Privacy({
  cookies = false,
}) {
  if (cookies) {
    return (
      <>
        <PageHeading
          eyebrow="Çerezler"
          title="Çerez ve bağlantı tercihleri."
          text="Bu sayfa, web sitesindeki dış hizmetlerin ve tarayıcı tercihlerinin kullanımını açıklar."
        />

        <article className="section container legal-copy">
          <h2>
            Site tercihleri
          </h2>

          <p>
            Kurumsal sayfalara analitik veya reklam amaçlı çerez
            eklenmemiştir. Ürün filtreleri sayfa adresindeki
            parametrelerle çalışır.
          </p>

          <h2>
            İsteğe bağlı harita
          </h2>

          <p>
            Google Haritalar yalnızca iletişim sayfasındaki
            “Haritayı yükle” düğmesini seçtiğinizde yüklenir.
            Bu işlem Google’a bağlantı kurar; Google’ın kendi
            çerez ve veri işleme koşulları uygulanabilir.
          </p>

          <h2>
            Dış bağlantılar
          </h2>

          <p>
            WhatsApp ve harita bağlantıları ilgili hizmete
            yönlendirir. Bu hizmetlerin tercihlerini kendi
            uygulamalarından veya tarayıcınızdan yönetebilirsiniz.
          </p>

          <h2>
            Tarayıcı ayarları
          </h2>

          <p>
            Çerez izinlerini tarayıcınızın gizlilik ayarlarından
            değiştirebilir, daha önce kaydedilmiş site verilerini
            temizleyebilirsiniz.
          </p>
        </article>
      </>
    );
  }

  return (
    <>
      <PageHeading
        eyebrow="Gizlilik"
        title="İletişimde gizliliğiniz."
        text="Bu sayfa, web sitesindeki iletişim formu ve dış hizmetlerin kullanımını açıklar."
      />

      <article className="section container legal-copy">
        <h2>
          İletişim formunda paylaşılan bilgiler
        </h2>

        <p>
          Formda adınız, e-posta adresiniz, mesajınız ve isteğe bağlı
          firma veya telefon bilgilerinizi paylaşabilirsiniz.
          Bu bilgiler, talebinizin Has Door’a iletilmesi ve sizinle
          iletişim kurulması için kullanılır. Gereksiz kişisel veya
          hassas bilgi paylaşmayın.
        </p>

        <h2>
          Formun iletilmesi
        </h2>

        <p>
          Mesajlar mevcut Formspree hizmeti üzerinden iletilir.
          Gönder düğmesine bastığınızda formda yazdığınız bilgiler
          bu hizmete aktarılır. Ayrıntıları{' '}

          <a
            href="https://formspree.io/legal/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Formspree gizlilik politikasından
          </a>

          {' '}inceleyebilirsiniz.
        </p>

        <h2>
          WhatsApp ve harita
        </h2>

        <p>
          WhatsApp üzerinden iletişim kurmayı veya haritayı açmayı
          seçtiğinizde ilgili hizmetin koşulları geçerlidir.
          Harita, siz yüklemeyi seçmeden bağlantı kurmaz.
        </p>

        <h2>
          Bilgi ve talepleriniz
        </h2>

        <p>
          Paylaştığınız bilgilerle ilgili sorularınızı ve taleplerinizi
          Has Door’a{' '}

          <a href={company.phoneHref}>
            {company.phone}
          </a>

          {company.secondPhone &&
            company.secondPhoneHref && (
              <>
                {' '}veya{' '}

                <a
                  href={
                    company.secondPhoneHref
                  }
                >
                  {company.secondPhone}
                </a>
              </>
            )}

          {' '}numaralarından ya da{' '}

          <Link to="/iletisim">
            iletişim sayfasından
          </Link>

          {' '}iletebilirsiniz.
        </p>
      </article>
    </>
  );
}


/* =========================================================
   404
========================================================= */

export function NotFound() {
  return (
    <section
      className="container not-found"
      aria-labelledby="not-found-title"
    >
      <p className="eyebrow">
        404 / SAYFA BULUNAMADI
      </p>

      <h1 id="not-found-title">
        Bu kapı başka
        <br />
        bir yere açılıyor.
      </h1>

      <p>
        Aradığınız sayfa taşınmış, silinmiş veya adresi yanlış
        yazılmış olabilir. Ürünlerimize göz atabilir veya bize
        ulaşabilirsiniz.
      </p>

      <div className="button-row">
        <Button to="/">
          Ana Sayfaya Dön
        </Button>

        <Button
          to="/urunler"
          variant="outline"
        >
          Ürünleri İncele
        </Button>

        <Button
          to="/iletisim"
          variant="outline"
        >
          İletişime Geç
        </Button>
      </div>
    </section>
  );
}