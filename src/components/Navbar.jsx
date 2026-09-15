import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Link,
  NavLink,
  useLocation,
} from 'react-router-dom';

import {
  ArrowUpRight,
  Menu,
  X,
  Phone,
} from 'lucide-react';

import {
  company,
} from '../data/site';


const links = [
  ['/', 'Ana Sayfa'],
  ['/urunler', 'Ürünler'],
  ['/kabin-tasarla', 'Kabin Tasarla'],
  ['/hizmetler', 'Hizmetler'],
  ['/projeler', 'Projeler'],
  ['/hakkimizda', 'Hakkımızda'],
  ['/iletisim', 'İletişim'],
];


export default function Navbar() {
  const [
    open,
    setOpen,
  ] = useState(false);

  const toggle =
    useRef(null);

  const location =
    useLocation();


  /* =========================================================
     SAYFA DEĞİŞİNCE MOBİL MENÜYÜ KAPAT
  ========================================================= */

  useEffect(() => {
    const frame =
      requestAnimationFrame(
        () => {
          setOpen(false);
        },
      );

    return () => {
      cancelAnimationFrame(
        frame,
      );
    };
  }, [
    location.pathname,
  ]);


  /* =========================================================
     MOBİL MENÜ AÇIKKEN
     ARKA SAYFAYI KİLİTLE + ESC DESTEĞİ
  ========================================================= */

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style
      .overflow =
      'hidden';


    const handleEscape = (
      event,
    ) => {
      if (
        event.key ===
        'Escape'
      ) {
        setOpen(false);

        requestAnimationFrame(
          () => {
            toggle.current
              ?.focus();
          },
        );
      }
    };


    document.addEventListener(
      'keydown',
      handleEscape,
    );


    return () => {
      document.body.style
        .overflow =
        previousOverflow;

      document.removeEventListener(
        'keydown',
        handleEscape,
      );
    };
  }, [
    open,
  ]);


  /* =========================================================
     MASAÜSTÜNE GEÇİNCE
     MOBİL MENÜYÜ KAPAT
  ========================================================= */

  useEffect(() => {
    const handleResize = () => {
      if (
        window.innerWidth >
        900
      ) {
        setOpen(false);
      }
    };


    window.addEventListener(
      'resize',
      handleResize,
    );


    return () => {
      window.removeEventListener(
        'resize',
        handleResize,
      );
    };
  }, []);


  function closeMenu() {
    setOpen(false);
  }


  return (
    <header className="site-header">

      {/* =====================================================
          ÜST BİLGİ ÇUBUĞU
      ===================================================== */}

      <div className="utility">
        <div className="container">

          <span>
            ASANSÖR KAPI
            SİSTEMLERİ

            <span className="utility-location">
              {' '}
              / ŞANLIURFA,
              TÜRKİYE
            </span>
          </span>


          <a
            href={
              company.phoneHref
            }
            aria-label={
              `Telefon: ${company.phone}`
            }
          >
            <Phone
              size={12}
              aria-hidden="true"
            />

            {company.phone}
          </a>

        </div>
      </div>


      {/* =====================================================
          ANA NAVBAR
      ===================================================== */}

      <nav
        className="main-nav container"
        aria-label="Ana menü"
      >

        {/* LOGO */}

        <Link
          className="brand"
          to="/"
          aria-label="Has Door ana sayfa"
          onClick={
            closeMenu
          }
        >
          <img
            src="/media/logo.webp"
            width="160"
            height="72"
            alt="Has Door Asansör Kapıları"
          />
        </Link>


        {/* MOBİL MENÜ BUTONU */}

        <button
          ref={toggle}
          className="menu-toggle"
          type="button"
          aria-label={
            open
              ? 'Menüyü kapat'
              : 'Menüyü aç'
          }
          aria-expanded={
            open
          }
          aria-controls="navigation"
          onClick={() =>
            setOpen(
              (current) =>
                !current,
            )
          }
        >
          {open ? (
            <X
              size={22}
              aria-hidden="true"
            />
          ) : (
            <Menu
              size={22}
              aria-hidden="true"
            />
          )}
        </button>


        {/* ===================================================
            NAVİGASYON
        =================================================== */}

        <div
          id="navigation"
          className={
            `navigation ${
              open
                ? 'is-open'
                : ''
            }`
          }
        >
          {links.map(
            ([
              to,
              label,
            ]) => (
              <NavLink
                key={to}
                to={to}
                end={
                  to === '/'
                }
                onClick={
                  closeMenu
                }
              >
                {label}
              </NavLink>
            ),
          )}


          <Link
            to="/iletisim"
            className="button button-gold nav-cta"
            onClick={
              closeMenu
            }
          >
            Teklif Al

            <ArrowUpRight
              size={17}
              aria-hidden="true"
            />
          </Link>

        </div>

      </nav>
    </header>
  );
}