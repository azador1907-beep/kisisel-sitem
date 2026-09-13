import { useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowUpRight, Menu, X, Phone } from 'lucide-react';
import { company } from '../data/site';
const links = [['/', 'Ana Sayfa'], ['/urunler','Ürünler'], ['/kabin-tasarla','Kabin Tasarla'], ['/hizmetler','Hizmetler'], ['/projeler','Projeler'], ['/hakkimizda','Hakkımızda'], ['/iletisim','İletişim']];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  return <header className="site-header" onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } }}>
    <div className="utility"><div className="container"><span>ASANSÖR KAPI SİSTEMLERİ <span className="utility-location">/ ŞANLIURFA, TÜRKİYE</span></span><a href={company.phoneHref}><Phone size={12} aria-hidden="true" />{company.phone}</a></div></div>
    <nav className="main-nav container" aria-label="Ana menü">
      <Link className="brand" to="/" aria-label="Has Door ana sayfa" onClick={() => setOpen(false)}><img src="/media/logo.webp" width="160" height="72" alt="Has Door Asansör Kapıları" /></Link>
      <button ref={toggle} className="menu-toggle" type="button" aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'} aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <div id="navigation" className={`navigation ${open ? 'is-open' : ''}`}>
        {links.map(([to,label]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>{label}</NavLink>)}
        <Link to="/iletisim" className="button button-gold nav-cta" onClick={() => setOpen(false)}>Teklif Al <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </div>
    </nav>
  </header>;
}
