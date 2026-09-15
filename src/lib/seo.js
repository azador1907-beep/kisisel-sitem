import {
  company,
  products,
} from '../data/site.js';


/* =========================================================
   SABİT SAYFALAR
========================================================= */

const pages = {
  '/': {
    title:
      'Asansör Kapı Sistemleri ve İmalatı | Has Door Şanlıurfa',

    description:
      'Has Door, Şanlıurfa’da merkezi ve teleskopik asansör kapısı üretimi yapar. Kat ve kabin kapılarını inceleyin, projeniz için teklif alın.',

    image:
      'door-enhanced',
  },


  '/urunler': {
    title:
      'Otomatik Asansör Kapıları | Has Door Ürünler',

    description:
      'Teleskopik ve merkezi kat ve kabin kapıları, mekanizma ve eşik sistemleri. Has Door ürünlerini, teknik çizimleri ve ölçü tablolarını inceleyin.',

    image:
      'teleskopik-kat-photo',
  },


  '/hizmetler': {
    title:
      'Asansör Kapısı Üretimi ve Proje Çözümleri | Has Door',

    description:
      'Asansör kapı sistemi imalatı, projeye özel çözümler ve etkileşimli kabin tasarımı. Has Door hizmetlerini ve üretim yaklaşımını keşfedin.',

    image:
      'door-enhanced',
  },


  '/projeler': {
    title:
      'Konut ve Ticari Proje Çözümleri | Has Door',

    description:
      'Konut, ticari yapı ve endüstriyel projeler için asansör kapı çözümleri. Kapı ölçüsü, açılım tipi ve proje ihtiyaçlarını birlikte değerlendirelim.',

    image:
      'door-enhanced',
  },


  '/hakkimizda': {
    title:
      'Hakkımızda | Has Door Asansör Şanlıurfa',

    description:
      'Şanlıurfa merkezli Has Door, asansör kapı sistemlerinde mühendislik, üretim kalitesi ve titiz işçiliği bir araya getirir. Bizi yakından tanıyın.',

    image:
      'door-enhanced',
  },


  '/iletisim': {
    title:
      'İletişim ve Teklif | Has Door Asansör Şanlıurfa',

    description:
      'Has Door ile iletişime geçin. Şanlıurfa Eyyübiye’de asansör kapı sistemleri için telefon, WhatsApp ve online teklif formunu kullanın.',

    image:
      'door-enhanced',
  },


  '/kabin-tasarla': {
    title:
      '3D Asansör Kabini Tasarla | Has Door Tasarım Stüdyosu',

    description:
      'Duvar, ayna, tavan ve zemin seçeneklerini bir araya getirin. Has Door 3D kabin tasarım stüdyosunda asansör kabininizi canlı olarak önizleyin.',

    image:
      'door-enhanced',
  },


  '/katalog': {
    title:
      'Asansör Kapısı Teknik Kataloğu | Has Door',

    description:
      'Has Door ürün kataloğunu inceleyin. Merkezi ve teleskopik kapı ölçüleri, mekanizma bilgileri ve teknik çizimlere ulaşın ve PDF kataloğu indirin.',

    image:
      'katalog',
  },


  '/gizlilik-politikasi': {
    title:
      'Gizlilik Politikası | Has Door',

    description:
      'Has Door web sitesinde iletişim formu, Formspree, WhatsApp ve harita bağlantıları kapsamında kişisel bilgilerin nasıl kullanıldığını inceleyin.',

    image:
      'door-enhanced',
  },


  '/cerez-politikasi': {
    title:
      'Çerez Politikası ve Tercihler | Has Door',

    description:
      'Has Door web sitesindeki çerezler, isteğe bağlı Google Haritalar bağlantısı ve dış hizmetlerin kullanımı hakkında bilgi edinin.',

    image:
      'door-enhanced',
  },
};


/* =========================================================
   GENEL AYARLAR
========================================================= */

const SITE_NAME =
  'Has Door';

const ORGANIZATION_ID =
  `${company.url}/#organization`;

const WEBSITE_ID =
  `${company.url}/#website`;

const DEFAULT_IMAGE =
  `${company.url}/media/door-enhanced.webp`;


/* =========================================================
   YARDIMCI FONKSİYONLAR
========================================================= */

function normalizePath(
  pathname = '/',
) {
  let path =
    String(
      pathname || '/',
    );

  /*
   * Yanlışlıkla query/hash gelirse
   * canonical içine girmesin.
   */
  path =
    path.split('?')[0]
      .split('#')[0];

  if (
    !path.startsWith('/')
  ) {
    path =
      `/${path}`;
  }

  /*
   * Ana sayfa haricinde sondaki
   * slash karakterlerini kaldır.
   */
  if (
    path !== '/'
  ) {
    path =
      path.replace(
        /\/+$/,
        '',
      );
  }

  return path || '/';
}


function absoluteUrl(
  path,
) {
  if (
    /^https?:\/\//i.test(
      path,
    )
  ) {
    return path;
  }

  return `${company.url}${path}`;
}


function productImage(
  product,
) {
  if (
    !product?.image
  ) {
    return DEFAULT_IMAGE;
  }

  return absoluteUrl(
    `/media/${product.image}.webp`,
  );
}


function pageImage(
  page,
) {
  if (
    !page?.image
  ) {
    return DEFAULT_IMAGE;
  }

  return absoluteUrl(
    `/media/${page.image}.webp`,
  );
}


function productDescription(
  product,
) {
  const base =
    product.description ||
    `${product.name} hakkında teknik bilgiler.`;

  const category =
    product.category
      ? ` ${product.category} kategorisindeki`
      : '';

  const opening =
    product.opening
      ? ` ${product.opening.toLocaleLowerCase(
          'tr-TR',
        )} açılımlı`
      : '';

  return (
    `${base}` +
    `${category}${opening} sistem için teknik detayları inceleyin ve Has Door’dan teklif alın.`
  );
}


/* =========================================================
   ROUTE LİSTESİ
========================================================= */

export const routes = [
  ...Object.keys(
    pages,
  ),

  ...products.map(
    (product) =>
      `/urunler/${product.slug}`,
  ),
];


/* =========================================================
   META BİLGİLERİ
========================================================= */

export function getMeta(
  pathname,
) {
  const path =
    normalizePath(
      pathname,
    );

  const product =
    products.find(
      (item) =>
        `/urunler/${item.slug}` ===
        path,
    );

  /*
   * Ürün sayfası
   */
  if (product) {
    const canonical =
      absoluteUrl(path);

    return {
      path,

      title:
        `${product.name} | Has Door Asansör Kapıları`,

      description:
        productDescription(
          product,
        ),

      canonical,

      image:
        productImage(
          product,
        ),

      imageAlt:
        `${product.name} - Has Door asansör kapı sistemi`,

      type:
        'product',

      noindex:
        false,

      product,
    };
  }

  /*
   * Normal sayfa
   */
  const page =
    pages[path];

  if (page) {
    return {
      path,

      title:
        page.title,

      description:
        page.description,

      canonical:
        absoluteUrl(
          path === '/'
            ? '/'
            : path,
        ),

      image:
        pageImage(
          page,
        ),

      imageAlt:
        'Has Door Asansör Kapı Sistemleri',

      type:
        'website',

      noindex:
        false,

      product:
        null,
    };
  }

  /*
   * 404
   */
  return {
    path,

    title:
      'Sayfa Bulunamadı | Has Door',

    description:
      'Aradığınız sayfa bulunamadı. Has Door asansör kapı sistemlerini inceleyebilir veya bizimle iletişime geçebilirsiniz.',

    canonical:
      absoluteUrl(path),

    image:
      DEFAULT_IMAGE,

    imageAlt:
      'Has Door Asansör Kapı Sistemleri',

    type:
      'website',

    noindex:
      true,

    product:
      null,
  };
}


/* =========================================================
   SCHEMA.ORG / JSON-LD
========================================================= */

export function structuredData(
  meta,
) {
  const phoneNumbers = [
    company.phone,
    company.secondPhone,
  ].filter(Boolean);


  const contactPoints =
    phoneNumbers.map(
      (
        telephone,
        index,
      ) => ({
        '@type':
          'ContactPoint',

        telephone,

        contactType:
          index === 0
            ? 'customer service'
            : 'sales',

        areaServed:
          'TR',

        availableLanguage:
          [
            'Turkish',
          ],
      }),
    );


  const organization = {
    '@type':
      'Organization',

    '@id':
      ORGANIZATION_ID,

    name:
      company.name,

    alternateName:
      SITE_NAME,

    url:
      company.url,

    logo: {
      '@type':
        'ImageObject',

      url:
        `${company.url}/media/logo.webp`,
    },

    image:
      DEFAULT_IMAGE,

    telephone:
      phoneNumbers,

    contactPoint:
      contactPoints,

    address: {
      '@type':
        'PostalAddress',

      streetAddress:
        'Kadıkendi Mah. 8515 Cad. No: 2 B',

      addressLocality:
        'Eyyübiye',

      addressRegion:
        'Şanlıurfa',

      addressCountry:
        'TR',
    },
  };


  const website = {
    '@type':
      'WebSite',

    '@id':
      WEBSITE_ID,

    url:
      `${company.url}/`,

    name:
      SITE_NAME,

    publisher: {
      '@id':
        ORGANIZATION_ID,
    },

    inLanguage:
      'tr-TR',
  };


  const graph = [
    organization,
    website,
  ];


  let productId =
    null;


  if (
    meta.product
  ) {
    productId =
      `${meta.canonical}#product`;

    graph.push({
      '@type':
        'Product',

      '@id':
        productId,

      name:
        meta.product.name,

      description:
        meta.product.description,

      image: [
        meta.image,
      ],

      url:
        meta.canonical,

      category:
        meta.product.category,

      brand: {
        '@type':
          'Brand',

        name:
          SITE_NAME,
      },

      manufacturer: {
        '@id':
          ORGANIZATION_ID,
      },
    });
  }


  let breadcrumbId =
    null;


  if (
    meta.path !== '/' &&
    !meta.noindex
  ) {
    breadcrumbId =
      `${meta.canonical}#breadcrumb`;

    const items = [
      {
        '@type':
          'ListItem',

        position:
          1,

        name:
          'Ana Sayfa',

        item:
          `${company.url}/`,
      },
    ];


    if (
      meta.product
    ) {
      items.push({
        '@type':
          'ListItem',

        position:
          2,

        name:
          'Ürünler',

        item:
          `${company.url}/urunler`,
      });
    }


    items.push({
      '@type':
        'ListItem',

      position:
        items.length + 1,

      name:
        meta.product
          ? meta.product.name
          : meta.title
              .split('|')[0]
              .trim(),

      item:
        meta.canonical,
    });


    graph.push({
      '@type':
        'BreadcrumbList',

      '@id':
        breadcrumbId,

      itemListElement:
        items,
    });
  }


  /*
   * 404 sayfasını Google'a
   * normal içerik gibi anlatmıyoruz.
   */
  if (
    !meta.noindex
  ) {
    const webPage = {
      '@type':
        'WebPage',

      '@id':
        `${meta.canonical}#webpage`,

      url:
        meta.canonical,

      name:
        meta.title,

      description:
        meta.description,

      isPartOf: {
        '@id':
          WEBSITE_ID,
      },

      publisher: {
        '@id':
          ORGANIZATION_ID,
      },

      inLanguage:
        'tr-TR',

      primaryImageOfPage: {
        '@type':
          'ImageObject',

        url:
          meta.image,
      },
    };


    if (
      breadcrumbId
    ) {
      webPage.breadcrumb = {
        '@id':
          breadcrumbId,
      };
    }


    if (
      productId
    ) {
      webPage.mainEntity = {
        '@id':
          productId,
      };
    }


    graph.push(
      webPage,
    );
  }


  return {
    '@context':
      'https://schema.org',

    '@graph':
      graph,
  };
}


/* =========================================================
   HTML ESCAPE
========================================================= */

export function escapeHtml(
  value,
) {
  return String(
    value,
  ).replace(
    /[&<>"']/g,
    (character) => ({
      '&':
        '&amp;',

      '<':
        '&lt;',

      '>':
        '&gt;',

      '"':
        '&quot;',

      "'":
        '&#39;',
    })[character],
  );
}


/* =========================================================
   PRERENDER HEAD
========================================================= */

export function headHtml(
  meta,
) {
  const robots =
    meta.noindex
      ? 'noindex, follow'
      : 'index, follow, max-image-preview:large';


  const schema =
    JSON.stringify(
      structuredData(
        meta,
      ),
    ).replace(
      /</g,
      '\\u003c',
    );


  return `
<title>${escapeHtml(
    meta.title,
  )}</title>

<meta
  name="description"
  content="${escapeHtml(
    meta.description,
  )}"
>

<link
  rel="canonical"
  href="${escapeHtml(
    meta.canonical,
  )}"
>

<meta
  name="robots"
  content="${robots}"
>

<meta
  property="og:locale"
  content="tr_TR"
>

<meta
  property="og:type"
  content="${escapeHtml(
    meta.type,
  )}"
>

<meta
  property="og:site_name"
  content="Has Door"
>

<meta
  property="og:title"
  content="${escapeHtml(
    meta.title,
  )}"
>

<meta
  property="og:description"
  content="${escapeHtml(
    meta.description,
  )}"
>

<meta
  property="og:url"
  content="${escapeHtml(
    meta.canonical,
  )}"
>

<meta
  property="og:image"
  content="${escapeHtml(
    meta.image,
  )}"
>

<meta
  property="og:image:alt"
  content="${escapeHtml(
    meta.imageAlt,
  )}"
>

<meta
  name="twitter:card"
  content="summary_large_image"
>

<meta
  name="twitter:title"
  content="${escapeHtml(
    meta.title,
  )}"
>

<meta
  name="twitter:description"
  content="${escapeHtml(
    meta.description,
  )}"
>

<meta
  name="twitter:image"
  content="${escapeHtml(
    meta.image,
  )}"
>

<meta
  name="twitter:image:alt"
  content="${escapeHtml(
    meta.imageAlt,
  )}"
>

<script
  id="structured-data"
  type="application/ld+json"
>${schema}</script>
`.trim();
}