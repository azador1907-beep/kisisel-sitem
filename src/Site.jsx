import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useSyncExternalStore,
} from 'react';

import {
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import Navbar from './components/Navbar';

import {
  Button,
  Footer,
} from './components/ui';

import SEO from './components/SEO';

import Home from './pages/Home';

import {
  About,
  NotFound,
  Privacy,
  Projects,
  Services,
} from './pages/CompanyPages';

import Contact from './pages/Contact';

import {
  Catalog,
  ProductDetail,
  Products,
} from './pages/Products';


/* =========================================================
   KABİN TASARIM
========================================================= */

const KabinTasarim = lazy(
  () =>
    import(
      './components/KabinTasarim'
    ),
);


/*
 * SSR / prerender sırasında 3D kabin alanının
 * tarayıcı özelliklerine erişmesini engeller.
 */
const subscribe = () => () => {};


function CabinFallback() {
  return (
    <section
      className="section container"
      aria-labelledby="cabin-loading-title"
    >
      <h1 id="cabin-loading-title">
        Kabin tasarım stüdyosu
      </h1>

      <p role="status">
        Üç boyutlu tasarım alanı hazırlanıyor…
      </p>

      <div className="button-row">
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


function CabinRoute() {
  const client =
    useSyncExternalStore(
      subscribe,
      () => true,
      () => false,
    );

  return (
    <div className="cabin-shell">
      {client ? (
        <Suspense
          fallback={
            <CabinFallback />
          }
        >
          <KabinTasarim />
        </Suspense>
      ) : (
        <CabinFallback />
      )}
    </div>
  );
}


/* =========================================================
   SAYFA DEĞİŞİM DAVRANIŞLARI
========================================================= */

function ScrollManager() {
  const {
    pathname,
    hash,
  } = useLocation();

  const initialRender =
    useRef(true);

  useEffect(() => {
    /*
     * URL'de #bolum varsa doğrudan
     * ilgili bölüme kaydır.
     */
    if (hash) {
      const id =
        decodeURIComponent(
          hash.slice(1),
        );

      requestAnimationFrame(
        () => {
          const element =
            document.getElementById(
              id,
            );

          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        },
      );

      initialRender.current =
        false;

      return;
    }

    /*
     * Normal sayfa değişiminde
     * sayfanın en üstüne dön.
     */
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });

    /*
     * İlk site açılışında focus değiştirmiyoruz.
     * Sonraki route değişimlerinde ekran okuyucu
     * ve klavye kullanıcılarını ana içeriğe taşıyoruz.
     */
    if (
      !initialRender.current
    ) {
      requestAnimationFrame(
        () => {
          document
            .getElementById(
              'main-content',
            )
            ?.focus({
              preventScroll: true,
            });
        },
      );
    }

    initialRender.current =
      false;
  }, [
    pathname,
    hash,
  ]);

  return null;
}


/* =========================================================
   SITE
========================================================= */

export default function Site() {
  const {
    pathname,
  } = useLocation();

  const isCabinPage =
    pathname ===
    '/kabin-tasarla';

  return (
    <>
      <SEO />

      <ScrollManager />

      <a
        className="skip-link"
        href="#main-content"
      >
        İçeriğe geç
      </a>

      <Navbar />

      <main
        id="main-content"
        tabIndex="-1"
      >
        <Routes>

          {/* ANA SAYFA */}

          <Route
            path="/"
            element={
              <Home />
            }
          />


          {/* ÜRÜNLER */}

          <Route
            path="/urunler"
            element={
              <Products />
            }
          />

          <Route
            path="/urunler/:slug"
            element={
              <ProductDetail />
            }
          />


          {/* KATALOG */}

          <Route
            path="/katalog"
            element={
              <Catalog />
            }
          />


          {/* KABİN TASARIM */}

          <Route
            path="/kabin-tasarla"
            element={
              <CabinRoute />
            }
          />


          {/* KURUMSAL */}

          <Route
            path="/hakkimizda"
            element={
              <About />
            }
          />

          <Route
            path="/hizmetler"
            element={
              <Services />
            }
          />

          <Route
            path="/projeler"
            element={
              <Projects />
            }
          />


          {/* İLETİŞİM */}

          <Route
            path="/iletisim"
            element={
              <Contact />
            }
          />


          {/* YASAL */}

          <Route
            path="/gizlilik-politikasi"
            element={
              <Privacy />
            }
          />

          <Route
            path="/cerez-politikasi"
            element={
              <Privacy
                cookies
              />
            }
          />


          {/* 404 */}

          <Route
            path="*"
            element={
              <NotFound />
            }
          />

        </Routes>
      </main>

      {!isCabinPage && (
        <Footer />
      )}
    </>
  );
}