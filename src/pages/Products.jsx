import {
  useMemo,
  useState,
} from 'react';

import {
  Link,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import {
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  Search,
} from 'lucide-react';

import {
  catalog,
  company,
  products,
  whatsapp,
} from '../data/site';

import {
  Breadcrumb,
  Button,
  CTASection,
  PageHeading,
  Picture,
  ProductCard,
  SectionHeading,
} from '../components/ui';

import {
  NotFound,
} from './CompanyPages';


/* =========================================================
   YARDIMCI FONKSİYONLAR
========================================================= */

function normalizeText(value = '') {
  return String(value)
    .toLocaleLowerCase('tr-TR')
    .trim();
}


function getFullImageHref(name) {
  if (!name) {
    return '#';
  }

  if (
    name.endsWith('-photo') ||
    name.endsWith('-hq')
  ) {
    return `/media/${name}.webp`;
  }

  return `/${name}.png`;
}


function getSourceHref(source) {
  if (!source) {
    return '#';
  }

  if (
    source.startsWith('/') ||
    source.startsWith('http://') ||
    source.startsWith('https://')
  ) {
    return source;
  }

  return `/${source}`;
}


function WhatsAppButtons({
  product,
  system = false,
}) {
  const message = system
    ? `Merhaba, ${product.name} hakkında bilgi almak istiyorum.`
    : `Merhaba, ${product.name} hakkında bilgi ve teklif almak istiyorum.`;

  return (
    <>
      <Button
        href={whatsapp(
          message,
          company.phone,
        )}
        variant="outline"
        target="_blank"
        rel="noopener noreferrer"
      >
        WhatsApp {company.phone}
      </Button>

      {company.secondPhone && (
        <Button
          href={whatsapp(
            message,
            company.secondPhone,
          )}
          variant="outline"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp {company.secondPhone}
        </Button>
      )}
    </>
  );
}


/* =========================================================
   ÜRÜNLER SAYFASI
========================================================= */

export function Products() {
  const [
    params,
    setParams,
  ] = useSearchParams();

  const categories =
    useMemo(
      () => [
        'Tümü',
        ...new Set(
          products
            .map(
              (product) =>
                product.category,
            )
            .filter(Boolean),
        ),
      ],
      [],
    );

  const rawCategory =
    params.get('kategori') ||
    'Tümü';

  const category =
    categories.includes(
      rawCategory,
    )
      ? rawCategory
      : 'Tümü';

  const query =
    params.get('ara') || '';

  const filtered =
    useMemo(() => {
      const normalizedQuery =
        normalizeText(query);

      return products.filter(
        (product) => {
          const categoryMatches =
            category === 'Tümü' ||
            product.category ===
              category;

          const searchableText =
            normalizeText(
              [
                product.name,
                product.category,
                product.opening,
                product.description,
                ...(product.features ||
                  []),
              ].join(' '),
            );

          const queryMatches =
            !normalizedQuery ||
            searchableText.includes(
              normalizedQuery,
            );

          return (
            categoryMatches &&
            queryMatches
          );
        },
      );
    }, [
      category,
      query,
    ]);

  function updateParam(
    key,
    value,
  ) {
    const next =
      new URLSearchParams(
        params,
      );

    if (
      !value ||
      value === 'Tümü'
    ) {
      next.delete(key);
    } else {
      next.set(
        key,
        value,
      );
    }

    setParams(
      next,
      {
        replace: true,
        preventScrollReset: true,
      },
    );
  }

  function clearFilters() {
    setParams(
      new URLSearchParams(),
      {
        replace: true,
        preventScrollReset: true,
      },
    );
  }

  return (
    <>
      <PageHeading
        eyebrow="Ürünler"
        title={
          <>
            Her yapıya uygun.
            <br />
            Her detayı düşünülmüş.
          </>
        }
        text="Kat ve kabin kapıları, yönsüz mekanizmalar ve eşik çözümleri. Ürün ailesini keşfedin, teknik detayları karşılaştırın."
      >
        <Link
          className="text-link"
          to="/katalog"
        >
          Kataloğu görüntüle

          <ArrowUpRight
            size={16}
            aria-hidden="true"
          />
        </Link>
      </PageHeading>

      <section className="section container">
        <div className="product-toolbar">

          {/* KATEGORİLER */}

          <div
            className="filters"
            role="group"
            aria-label="Ürün kategorileri"
          >
            {categories.map(
              (
                currentCategory,
              ) => {
                const count =
                  currentCategory ===
                  'Tümü'
                    ? products.length
                    : products.filter(
                        (
                          product,
                        ) =>
                          product.category ===
                          currentCategory,
                      ).length;

                const selected =
                  category ===
                  currentCategory;

                return (
                  <button
                    key={
                      currentCategory
                    }
                    type="button"
                    aria-pressed={
                      selected
                    }
                    className={
                      selected
                        ? 'selected'
                        : ''
                    }
                    onClick={() =>
                      updateParam(
                        'kategori',
                        currentCategory,
                      )
                    }
                  >
                    {
                      currentCategory
                    }

                    <span
                      aria-hidden="true"
                    >
                      {count}
                    </span>
                  </button>
                );
              },
            )}
          </div>

          {/* ARAMA */}

          <label className="product-search">
            <Search
              size={16}
              aria-hidden="true"
            />

            <span className="sr-only">
              Ürün ara
            </span>

            <input
              type="search"
              placeholder="Ürün ara"
              value={query}
              autoComplete="off"
              onChange={(
                event,
              ) =>
                updateParam(
                  'ara',
                  event.target
                    .value,
                )
              }
            />
          </label>
        </div>

        <p
          className="result-count"
          aria-live="polite"
        >
          {filtered.length}{' '}
          ürün / sistem
          listeleniyor
        </p>

        {/* ÜRÜN LİSTESİ */}

        {filtered.length >
        0 ? (
          <div className="product-grid">
            {filtered.map(
              (product) => (
                <ProductCard
                  key={
                    product.slug
                  }
                  product={
                    product
                  }
                  index={products.indexOf(
                    product,
                  )}
                />
              ),
            )}
          </div>
        ) : (
          <div className="empty-state">
            <h2>
              Aramanıza uygun
              ürün bulunamadı.
            </h2>

            <p>
              Farklı bir terim
              deneyin veya tüm
              ürünlere tekrar göz
              atın.
            </p>

            <button
              type="button"
              className="button button-dark"
              onClick={
                clearFilters
              }
            >
              Filtreleri Temizle
            </button>
          </div>
        )}

        {/* KATALOG */}

        <div className="catalog-banner">
          <div>
            <p className="eyebrow">
              TEKNİK
              DOKÜMANTASYON
            </p>

            <h2>
              Detayları birlikte
              inceleyelim.
            </h2>

            <p>
              Ölçü tabloları,
              mekanizma bilgileri
              ve çizimler tek
              katalogda.
            </p>
          </div>

          <Button
            href="/katalog.pdf"
            variant="outline"
            download
          >
            Kataloğu İndir
          </Button>
        </div>
      </section>

      <CTASection />
    </>
  );
}


/* =========================================================
   ÜRÜN DETAY YÖNLENDİRMESİ
========================================================= */

export function ProductDetail() {
  const {
    slug,
  } = useParams();

  const product =
    products.find(
      (item) =>
        item.slug === slug,
    );

  if (!product) {
    return <NotFound />;
  }

  if (
    product.type ===
    'system'
  ) {
    return (
      <SystemSheet
        key={slug}
        product={product}
      />
    );
  }

  return (
    <ProductSheet
      key={slug}
      product={product}
    />
  );
}


/* =========================================================
   KAPI ÜRÜN DETAYI
========================================================= */

function ProductSheet({
  product: p,
}) {
  const gallery =
    Array.isArray(
      p.gallery,
    ) &&
    p.gallery.length >
      0
      ? p.gallery
      : [p.image];

  const [
    selected,
    setSelected,
  ] = useState(
    p.image,
  );

  const related =
    products
      .filter(
        (product) =>
          product.slug !==
          p.slug,
      )
      .slice(0, 3);

  const isMainImage =
    selected === p.image;

  const isPhoto =
    isMainImage &&
    p.visualType ===
      'photo';

  const caption =
    isMainImage
      ? p.visualLabel ||
        'Katalog görseli'
      : 'Orijinal katalog sayfası';

  const fullImageHref =
    getFullImageHref(
      selected,
    );

  return (
    <>
      <section className="container product-detail">
        <Breadcrumb
          items={[
            {
              label: 'Ürünler',
              to: '/urunler',
            },

            {
              label: p.name,
            },
          ]}
        />

        <div className="detail-grid">

          {/* GÖRSELLER */}

          <div>
            <div className="detail-image">
              <Picture
                name={selected}
                alt={`${p.name} — ${caption.toLocaleLowerCase(
                  'tr-TR',
                )}`}
                priority
              />

              <a
                href={
                  fullImageHref
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.name} seçili görselini tam boy aç`}
                className="image-arrow"
              >
                <ArrowUpRight
                  aria-hidden="true"
                />
              </a>
            </div>

            <p className="technical-note">
              {isPhoto
                ? 'Bu görsel, Has Door’un mevcut kataloğundaki ürün fotoğrafından hazırlanmıştır.'
                : 'Bu görsel, Has Door’un orijinal katalog teknik çizimidir.'}
            </p>

            {gallery.length >
              1 && (
              <div
                className="detail-thumbnails"
                role="group"
                aria-label={`${p.name} ürün görselleri`}
              >
                {gallery.map(
                  (
                    name,
                    index,
                  ) => {
                    const active =
                      name ===
                      selected;

                    const thumbCaption =
                      name ===
                      p.image
                        ? p.visualLabel ||
                          'Ürün görseli'
                        : 'Orijinal katalog sayfası';

                    return (
                      <button
                        type="button"
                        key={
                          name
                        }
                        aria-label={`${index + 1}. görsel: ${thumbCaption}`}
                        aria-pressed={
                          active
                        }
                        onClick={() =>
                          setSelected(
                            name,
                          )
                        }
                      >
                        <Picture
                          name={
                            name
                          }
                          alt=""
                        />
                      </button>
                    );
                  },
                )}
              </div>
            )}
          </div>

          {/* ÜRÜN BİLGİLERİ */}

          <div className="detail-copy">
            <p className="eyebrow">
              {p.category}
              {' / '}
              {p.opening}
            </p>

            <h1>
              {p.name}
            </h1>

            <p className="detail-lead">
              {p.description}
            </p>

            {Array.isArray(
              p.features,
            ) &&
              p.features.length >
                0 && (
                <ul className="feature-list">
                  {p.features.map(
                    (
                      feature,
                    ) => (
                      <li
                        key={
                          feature
                        }
                      >
                        <Check
                          size={
                            17
                          }
                          aria-hidden="true"
                        />

                        {
                          feature
                        }
                      </li>
                    ),
                  )}
                </ul>
              )}

            <dl className="spec-list">
              <div>
                <dt>
                  Panel sayısı
                </dt>

                <dd>
                  2 panel
                </dd>
              </div>

              <div>
                <dt>
                  Açılım biçimi
                </dt>

                <dd>
                  {p.opening}
                </dd>
              </div>

              <div>
                <dt>
                  Net giriş
                </dt>

                <dd>
                  700–1100 mm
                </dd>
              </div>

              <div>
                <dt>
                  Kapı yüksekliği
                </dt>

                <dd>
                  2000–2200 mm
                </dd>
              </div>

              {(p.extra ||
                []).map(
                ([
                  key,
                  value,
                ]) => (
                  <div
                    key={
                      key
                    }
                  >
                    <dt>
                      {key}
                    </dt>

                    <dd>
                      {value}
                    </dd>
                  </div>
                ),
              )}
            </dl>

            <div className="button-row">
              <Button
                to={`/iletisim?urun=${p.slug}`}
              >
                Bu Ürün İçin
                Teklif Al
              </Button>

              <WhatsAppButtons
                product={p}
              />
            </div>

            <p className="technical-note">
              Ölçü ve bileşen
              bilgileri mevcut
              ürün kataloğundan
              alınmıştır.
              Projenize uygun
              seçimi teklif
              aşamasında birlikte
              netleştirelim.
            </p>
          </div>
        </div>
      </section>

      {/* TEKNİK VERİLER */}

      <section className="section technical-section">
        <div className="container">
          <SectionHeading
            eyebrow="TEKNİK VERİLER"
            title="Ölçüler ve uygulama detayları."
            text="Tablodaki tüm ölçüler milimetre cinsindendir."
          />

          <div className="technical-grid">
            <div>
              <div
                className="table-scroll"
                tabIndex="0"
                role="region"
                aria-label={`${p.name} ölçü tablosu`}
              >
                <table>
                  <caption>
                    {p.name} —
                    katalog ölçü
                    tablosu
                  </caption>

                  <thead>
                    <tr>
                      <th scope="col">
                        Net giriş
                        (EO)
                      </th>

                      <th scope="col">
                        Eşik (SA)
                      </th>

                      <th scope="col">
                        Toplam
                        uzunluk
                        (TL)
                      </th>

                      <th scope="col">
                        Yükseklik
                        (DH)
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {(p.dimensions ||
                      []).map(
                      ([
                        eo,
                        sa,
                        tl,
                      ]) => (
                        <tr
                          key={
                            eo
                          }
                        >
                          <th scope="row">
                            {eo}
                          </th>

                          <td>
                            {sa}
                          </td>

                          <td>
                            {tl}
                          </td>

                          <td>
                            2000–2200
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>

              {p.source && (
                <p className="technical-note">
                  Kaynak:{' '}

                  <a
                    href={getSourceHref(
                      p.source,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Orijinal katalog
                    çizimi
                  </a>

                  . Uygulama
                  boşlukları ve
                  bağlantı ölçüleri
                  için ilgili teknik
                  çizimi inceleyin.
                </p>
              )}

              <a
                className="text-link"
                href="/katalog.pdf"
                download
              >
                Tüm teknik
                çizimleri indir

                <ArrowDownToLine
                  size={16}
                  aria-hidden="true"
                />
              </a>
            </div>

            {p.drawing && (
              <a
                href={`/${p.drawing}.png`}
                target="_blank"
                rel="noopener noreferrer"
                className="drawing-preview"
                aria-label={`${p.name} teknik çizimini tam boy aç`}
              >
                <Picture
                  name={
                    p.drawing
                  }
                  alt={`${p.name} ölçülendirilmiş teknik çizimi`}
                />

                <span>
                  Çizimi büyüt

                  <ArrowUpRight
                    size={15}
                    aria-hidden="true"
                  />
                </span>
              </a>
            )}
          </div>

          <div className="application-copy">
            <div>
              <p className="eyebrow">
                KULLANIM ALANLARI
              </p>

              <h3>
                Yapınızın
                gereksinimlerine
                göre.
              </h3>
            </div>

            <p>
              Konut, ticari yapı
              ve endüstriyel
              projelerde kapı
              seçimi; net giriş,
              açılım alanı ve
              kabin yerleşimiyle
              birlikte
              değerlendirilir.
              Teknik
              gereksinimlerinizi
              paylaşın, uygun
              çözümü birlikte
              belirleyelim.
            </p>
          </div>
        </div>
      </section>

      {/* İLGİLİ ÜRÜNLER */}

      {related.length >
        0 && (
        <section className="section container">
          <SectionHeading
            eyebrow="ÜRÜN AİLESİNİ KEŞFEDİN"
            title="İlgili kapı sistemleri"
          />

          <div className="product-grid home-products">
            {related.map(
              (product) => (
                <ProductCard
                  key={
                    product.slug
                  }
                  product={
                    product
                  }
                  index={products.indexOf(
                    product,
                  )}
                />
              ),
            )}
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}


/* =========================================================
   KATALOG SAYFASI
========================================================= */

export function Catalog() {
  const [
    index,
    setIndex,
  ] = useState(0);

  const current =
    catalog[index];

  if (!current) {
    return null;
  }

  function previousPage() {
    setIndex(
      (currentIndex) =>
        Math.max(
          0,
          currentIndex - 1,
        ),
    );
  }

  function nextPage() {
    setIndex(
      (currentIndex) =>
        Math.min(
          catalog.length - 1,
          currentIndex + 1,
        ),
    );
  }

  return (
    <>
      <PageHeading
        eyebrow="Ürün kataloğu"
        title="Teknik detaylar, tek yerde."
        text="Ürün görselleri, kapı ölçüleri ve mekanizma detaylarıyla mevcut Has Door kataloğunun tamamı."
      >
        <Button
          href="/katalog.pdf"
          download
        >
          PDF Kataloğu
          İndir
        </Button>
      </PageHeading>

      <section className="section container catalog-layout">

        {/* KATALOG MENÜSÜ */}

        <nav
          className="catalog-index"
          aria-label="Katalog sayfaları"
        >
          <h2>
            Katalog içeriği
          </h2>

          {catalog.map(
            (
              page,
              pageIndex,
            ) => (
              <button
                key={
                  page.image
                }
                type="button"
                onClick={() =>
                  setIndex(
                    pageIndex,
                  )
                }
                aria-current={
                  pageIndex ===
                  index
                    ? 'page'
                    : undefined
                }
              >
                <span
                  aria-hidden="true"
                >
                  {String(
                    pageIndex +
                      1,
                  ).padStart(
                    2,
                    '0',
                  )}
                </span>

                {page.label}
              </button>
            ),
          )}
        </nav>

        {/* KATALOG GÖRSELİ */}

        <div>
          <div className="catalog-controls">
            <button
              type="button"
              disabled={
                index === 0
              }
              className="button button-outline"
              onClick={
                previousPage
              }
            >
              Önceki
            </button>

            <span aria-live="polite">
              {index + 1}
              {' / '}
              {catalog.length}
            </span>

            <button
              type="button"
              disabled={
                index ===
                catalog.length -
                  1
              }
              className="button button-outline"
              onClick={
                nextPage
              }
            >
              Sonraki
            </button>
          </div>

          <h2 className="catalog-current">
            {current.label}
          </h2>

          <a
            href={`/${current.image}.png`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${current.label} katalog sayfasını tam boy aç`}
          >
            <Picture
              name={
                current.image
              }
              alt={
                current.label
              }
              className="catalog-page"
              priority
            />
          </a>

          <p className="technical-note">
            Tam boy görüntülemek
            için sayfaya
            dokunun. Orijinal
            katalog içeriği
            korunmuştur.
          </p>
        </div>
      </section>
    </>
  );
}


/* =========================================================
   MEKANİZMA / EŞİK SİSTEM DETAYI
========================================================= */

function SystemSheet({
  product: p,
}) {
  return (
    <>
      <PageHeading
        eyebrow={p.category}
        title={p.name}
        text={p.description}
      />

      <section className="section container detail-grid">

        {/* GÖRSEL */}

        <div>
          <div className="detail-image">
            <Picture
              name={p.image}
              alt={`${p.name} — sistem görseli`}
              priority
            />

            <a
              href={getFullImageHref(
                p.image,
              )}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${p.name} görselini tam boy aç`}
              className="image-arrow"
            >
              <ArrowUpRight
                aria-hidden="true"
              />
            </a>
          </div>

          {p.visualLabel && (
            <p className="technical-note">
              {p.visualLabel}
            </p>
          )}
        </div>

        {/* BİLGİLER */}

        <div className="detail-copy">
          <p className="eyebrow">
            SİSTEM DETAYI
          </p>

          <h2>
            {p.opening}
          </h2>

          <p className="detail-lead">
            {p.detail}
          </p>

          {Array.isArray(
            p.features,
          ) &&
            p.features.length >
              0 && (
              <ul className="feature-list">
                {p.features.map(
                  (
                    feature,
                  ) => (
                    <li
                      key={
                        feature
                      }
                    >
                      <Check
                        size={
                          17
                        }
                        aria-hidden="true"
                      />

                      {
                        feature
                      }
                    </li>
                  ),
                )}
              </ul>
            )}

          {Array.isArray(
            p.extra,
          ) &&
            p.extra.length >
              0 && (
              <dl className="spec-list">
                {p.extra.map(
                  ([
                    key,
                    value,
                  ]) => (
                    <div
                      key={
                        key
                      }
                    >
                      <dt>
                        {key}
                      </dt>

                      <dd>
                        {value}
                      </dd>
                    </div>
                  ),
                )}
              </dl>
            )}

          <p className="technical-note">
            Görsel, mevcut
            katalogdan
            hazırlanmıştır.
            Teknik ayrıntılar
            için orijinal
            kaynağı inceleyin.
          </p>

          <div className="button-row">
            <Button
              to={`/iletisim?urun=${p.slug}`}
            >
              Bilgi ve Teklif Al
            </Button>

            <WhatsAppButtons
              product={p}
              system
            />
          </div>

          {p.source && (
            <a
              className="text-link system-source"
              href={getSourceHref(
                p.source,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Orijinal katalog
              sayfası

              <ArrowUpRight
                size={16}
                aria-hidden="true"
              />
            </a>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}