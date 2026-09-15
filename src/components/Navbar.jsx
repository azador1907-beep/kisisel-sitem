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
} from 'lucide-react';


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
        </div>
      </div>

      <nav
        className="main-nav container"
        aria-label="Ana menü"
      >
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