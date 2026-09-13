import { lazy, Suspense, useEffect, useRef, useSyncExternalStore } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Footer, Button } from './components/ui';
import SEO from './components/SEO';
import Home from './pages/Home';
import { About, Services, Projects, Privacy, NotFound } from './pages/CompanyPages';
import Contact from './pages/Contact';
import { Products, ProductDetail, Catalog } from './pages/Products';
const KabinTasarim = lazy(() => import('./components/KabinTasarim'));
const subscribe = () => () => {};
function CabinRoute() {
  const client = useSyncExternalStore(subscribe, () => true, () => false);
  const fallback = <div className="section container"><h1>Kabin tasarım stüdyosu</h1><p role="status">Üç boyutlu tasarım alanı hazırlanıyor…</p><Button to="/iletisim" variant="outline">İletişime Geç</Button></div>;
  return <div className="cabin-shell">{client ? <Suspense fallback={fallback}><KabinTasarim /></Suspense> : fallback}</div>;
}
export default function Site() {
  const { pathname, hash } = useLocation();
  const initial = useRef(true);
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else { window.scrollTo(0,0); if (!initial.current) document.getElementById('main-content')?.focus({ preventScroll:true }); }
    initial.current = false;
  }, [pathname,hash]);
  return <><SEO /><a className="skip-link" href="#main-content">İçeriğe geç</a><Navbar /><main id="main-content" tabIndex="-1"><Routes>
    <Route path="/" element={<Home />} /><Route path="/urunler" element={<Products />} />
    <Route path="/urunler/:slug" element={<ProductDetail />} /><Route path="/katalog" element={<Catalog />} />
    <Route path="/hakkimizda" element={<About />} /><Route path="/hizmetler" element={<Services />} />
    <Route path="/projeler" element={<Projects />} /><Route path="/iletisim" element={<Contact />} />
    <Route path="/gizlilik-politikasi" element={<Privacy />} /><Route path="/cerez-politikasi" element={<Privacy cookies />} />
    <Route path="/kabin-tasarla" element={<CabinRoute />} /><Route path="*" element={<NotFound />} />
  </Routes></main>{pathname !== '/kabin-tasarla' && <Footer />}</>;
}
