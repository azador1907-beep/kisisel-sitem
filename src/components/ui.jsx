import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowRight,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';

import {
  company,
  products,
  whatsapp,
} from '../data/site';

import imageSizes from '../data/imageSizes.json';
import responsiveImages from '../data/responsiveImages.json';

export function Button({
  to,
  href,
  children,
  variant = 'dark',
  className = '',
  ...props
}) {
  const classes =
    `button button-${variant} ${className}`.trim();

  const content = (
    <>
      <span>{children}</span>

      <ArrowUpRight
        size={18}
        aria-hidden="true"
      />
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      to={to || '/'}
      className={classes}
      {...props}
    >
      {content}
    </Link>
  );
}

export function Picture({
  name,
  alt = '',
  className = '',
  priority = false,
  sizes =
    '(max-width: 600px) 90vw, (max-width: 1000px) 50vw, 550px',
  ...props
}) {
  const dimensions = imageSizes[name];

  const width = dimensions?.[0];
  const height = dimensions?.[1];

  const fallbackSrc =
    `/media/${name}.webp`;

  const webpSrcSet =
    width && width > 360
      ? `/media/${name}-360.webp 360w, ${fallbackSrc} ${width}w`
      : undefined;

  const avifImages =
    responsiveImages[name];

  const avifSrcSet =
    Array.isArray(avifImages)
      ? avifImages
          .map(
            (item) =>
              `${item.src} ${item.width}w`,
          )
          .join(', ')
      : undefined;

  const image = (
    <img
      src={fallbackSrc}
      srcSet={webpSrcSet}
      sizes={
        webpSrcSet
          ? sizes
          : undefined
      }
      alt={alt}
      width={width}
      height={height}
      loading={
        priority
          ? 'eager'
          : 'lazy'
      }
      fetchPriority={
        priority
          ? 'high'
          : 'auto'
      }
      decoding={
        priority
          ? 'sync'
          : 'async'
      }
      className={className}
      {...props}
    />
  );

  if (!avifSrcSet) {
    return image;
  }

  return (
    <picture className="responsive-picture">
      <source
        type="image/avif"
        srcSet={avifSrcSet}
        sizes={sizes}
      />

      {image}
    </picture>
  );
}

export function Breadcrumb({
  items = [],
}) {
  return (
    <nav
      className="breadcrumb"
      aria-label="İçerik yolu"
    >
      <ol>
        <li>
          <Link to="/">
            Ana Sayfa
          </Link>
        </li>

        {items.map(
          (
            {
              label,
              to,
            },
            index,
          ) => {
            const isLast =
              index ===
              items.length - 1;

            return (
              <li
                key={`${label}-${index}`}
              >
                <ChevronRight
                  size={12}
                  aria-hidden="true"
                />

                {to && !isLast ? (
                  <Link to={to}>
                    {label}
                  </Link>
                ) : (
                  <span
                    aria-current={
                      isLast
                        ? 'page'
                        : undefined
                    }
                  >
                    {label}
                  </span>
                )}
              </li>
            );
          },
        )}
      </ol>
    </nav>
  );
}

export function PageHeading({
  eyebrow,
  title,
  text,
  children,
}) {
  return (
    <header className="page-heading">
      <div className="container">
        <Breadcrumb
          items={[
            {
              label: eyebrow,
            },
          ]}
        />

        <div className="page-heading-row">
          <div>
            {eyebrow && (
              <p className="eyebrow">
                {eyebrow}
              </p>
            )}

            <h1>
              {title}
            </h1>
          </div>

          {(text ||
            children) && (
            <div className="heading-aside">
              {text && (
                <p>
                  {text}
                </p>
              )}

              {children}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  children,
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && (
          <p className="eyebrow">
            {eyebrow}
          </p>
        )}

        <h2>
          {title}
        </h2>

        {text && (
          <p className="section-description">
            {text}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}

export function ProductCard({
  product,
  index = 0,
}) {
  if (!product) {
    return null;
  }

  const productNumber =
    String(index + 1)
      .padStart(2, '0');

  const opening =
    product.opening
      ?.toLocaleUpperCase('tr-TR') ||
    '';

  const label =
    product.visualLabel ||
    'Ürün görseli';

  const productUrl =
    `/urunler/${product.slug}`;

  return (
    <article className="product-card">
      <Link
        to={productUrl}
        className="product-image-link"
        aria-label={
          `${product.name} ürün detaylarını incele`
        }
      >
        <span
          className="product-index"
          aria-hidden="true"
        >
          {productNumber}

          {opening &&
            ` / ${opening}`}
        </span>

        <Picture
          name={product.image}
          sizes="
            (max-width: 600px) calc(100vw - 64px),
            (max-width: 1000px) 44vw,
            350px
          "
          alt={
            `${product.name} - ${label}`
          }
        />

        <span
          className="product-visual-note"
          aria-hidden="true"
        >
          {label}
        </span>

        <span
          className="image-arrow"
          aria-hidden="true"
        >
          <ArrowUpRight />
        </span>
      </Link>

      <div className="product-card-body">
        {product.category && (
          <p className="eyebrow">
            {product.category}
          </p>
        )}

        <h3>
          <Link to={productUrl}>
            {product.name}
          </Link>
        </h3>

        {product.description && (
          <p>
            {product.description}
          </p>
        )}

        <Link
          className="text-link"
          to={productUrl}
          aria-label={
            `${product.name} teknik detaylarını incele`
          }
        >
          Teknik detaylar

          <ArrowRight
            size={17}
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}

export function CTASection() {
  return (
    <section
      className="cta-section"
      aria-labelledby="cta-title"
    >
      <div className="container cta-inner">
        <div>
          <p className="eyebrow">
            BİRLİKTE DOĞRU ÇÖZÜMÜ BULALIM
          </p>

          <h2 id="cta-title">
            Projenizin bir sonraki
            <br />
            adımını konuşalım.
          </h2>
        </div>

        <div>
          <p>
            İhtiyacınıza uygun kapı
            sistemini birlikte
            belirleyelim.
          </p>

          <Button
            to="/iletisim"
            variant="gold"
          >
            Teklif Al
          </Button>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const currentYear =
    new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link
            to="/"
            aria-label="Has Door ana sayfa"
          >
            <img
              src="/media/logo.webp"
              width="180"
              height="90"
              alt="Has Door"
              loading="lazy"
              decoding="async"
            />
          </Link>

          <p>
            Şanlıurfa&apos;dan,
            geleceğin yapılarına.
            <br />
            Asansör kapılarında kalite,
            güven ve estetik.
          </p>

          <div
            aria-label="WhatsApp iletişim numaraları"
          >
            <div
              style={{
                marginTop: 18,
              }}
            >
              <a
                className="text-link"
                href={whatsapp(
                  undefined,
                  company.phone,
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp{' '}
                {company.phone}

                <MessageCircle
                  size={17}
                  aria-hidden="true"
                />
              </a>
            </div>

            {company.secondPhone && (
              <div
                style={{
                  marginTop: 12,
                }}
              >
                <a
                  className="text-link"
                  href={whatsapp(
                    undefined,
                    company.secondPhone,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp{' '}
                  {company.secondPhone}

                  <MessageCircle
                    size={17}
                    aria-hidden="true"
                  />
                </a>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2>
            Keşfedin
          </h2>

          <Link to="/hakkimizda">
            Hakkımızda
          </Link>

          <Link to="/hizmetler">
            Hizmetler
          </Link>

          <Link to="/projeler">
            Proje çözümleri
          </Link>

          <Link to="/kabin-tasarla">
            Kabin Tasarla
          </Link>

          <Link to="/katalog">
            Ürün kataloğu
          </Link>
        </div>

        <div>
          <h2>
            Kapı sistemleri
          </h2>

          {products.map(
            (product) => (
              <Link
                key={
                  product.slug
                }
                to={
                  `/urunler/${product.slug}`
                }
              >
                {product.name}
              </Link>
            ),
          )}
        </div>

        <div>
          <h2>
            Bize ulaşın
          </h2>

          <a
            href={
              company.phoneHref
            }
          >
            {company.phone}
          </a>

          {company.secondPhone &&
            company.secondPhoneHref && (
              <a
                href={
                  company.secondPhoneHref
                }
              >
                {
                  company.secondPhone
                }
              </a>
            )}

          <address>
            {company.address}
          </address>

          <a
            href={company.map}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Yol tarifi

            <ArrowUpRight
              size={15}
              aria-hidden="true"
            />
          </a>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          © {currentYear} Has Door.
          Tüm hakları saklıdır.
        </p>

        <div>
          <Link to="/gizlilik-politikasi">
            Gizlilik
          </Link>

          <Link to="/cerez-politikasi">
            Çerezler
          </Link>

          <span>
            TÜRKİYE / TR
          </span>
        </div>
      </div>
    </footer>
  );
}