import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import {
  getMeta,
  structuredData,
} from '../lib/seo';


function upsertMeta(
  attribute,
  key,
  content,
) {
  if (!content) {
    return;
  }

  let element =
    document.head.querySelector(
      `meta[${attribute}="${key}"]`,
    );

  if (!element) {
    element =
      document.createElement(
        'meta',
      );

    element.setAttribute(
      attribute,
      key,
    );

    document.head.appendChild(
      element,
    );
  }

  element.setAttribute(
    'content',
    content,
  );
}


function upsertCanonical(
  href,
) {
  let canonical =
    document.head.querySelector(
      'link[rel="canonical"]',
    );

  if (!canonical) {
    canonical =
      document.createElement(
        'link',
      );

    canonical.setAttribute(
      'rel',
      'canonical',
    );

    document.head.appendChild(
      canonical,
    );
  }

  canonical.setAttribute(
    'href',
    href,
  );
}


function upsertStructuredData(
  data,
) {
  let script =
    document.getElementById(
      'structured-data',
    );

  if (!script) {
    script =
      document.createElement(
        'script',
      );

    script.id =
      'structured-data';

    script.type =
      'application/ld+json';

    document.head.appendChild(
      script,
    );
  }

  script.textContent =
    JSON.stringify(data);
}


export default function SEO() {
  const {
    pathname,
  } = useLocation();

  useEffect(() => {
    const meta =
      getMeta(pathname);

    /*
     * Sayfanın dili.
     */
    document.documentElement.lang =
      'tr';

    /*
     * Tarayıcı / Google başlığı.
     */
    document.title =
      meta.title;

    /*
     * Temel SEO.
     */
    upsertMeta(
      'name',
      'description',
      meta.description,
    );

    upsertMeta(
      'name',
      'robots',
      meta.noindex
        ? 'noindex, follow'
        : 'index, follow, max-image-preview:large',
    );

    /*
     * Open Graph
     * WhatsApp, Facebook, LinkedIn vb.
     */
    upsertMeta(
      'property',
      'og:title',
      meta.title,
    );

    upsertMeta(
      'property',
      'og:description',
      meta.description,
    );

    upsertMeta(
      'property',
      'og:url',
      meta.canonical,
    );

    upsertMeta(
      'property',
      'og:image',
      meta.image,
    );

    upsertMeta(
      'property',
      'og:image:alt',
      meta.imageAlt,
    );

    upsertMeta(
      'property',
      'og:type',
      meta.type,
    );

    upsertMeta(
      'property',
      'og:locale',
      'tr_TR',
    );

    upsertMeta(
      'property',
      'og:site_name',
      'Has Door',
    );

    /*
     * X / Twitter kartları.
     */
    upsertMeta(
      'name',
      'twitter:card',
      'summary_large_image',
    );

    upsertMeta(
      'name',
      'twitter:title',
      meta.title,
    );

    upsertMeta(
      'name',
      'twitter:description',
      meta.description,
    );

    upsertMeta(
      'name',
      'twitter:image',
      meta.image,
    );

    upsertMeta(
      'name',
      'twitter:image:alt',
      meta.imageAlt,
    );

    /*
     * Google'a sayfanın gerçek
     * adresini bildirir.
     */
    upsertCanonical(
      meta.canonical,
    );

    /*
     * Schema.org / JSON-LD.
     */
    upsertStructuredData(
      structuredData(meta),
    );
  }, [
    pathname,
  ]);

  return null;
}