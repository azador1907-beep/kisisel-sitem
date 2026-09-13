import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const links = [
  ['/', 'Ana Sayfa'], ['/urunler', 'Ürünler'], ['/kabin-tasarla', 'Kabin Tasarla'],
  ['/hakkimizda', 'Hakkımızda'], ['/iletisim', 'İletişim'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return <nav aria-label="Ana menü" className="fixed top-0 left-0 w-full z-50 bg-white shadow-md h-20 flex items-center justify-between px-4 sm:px-8">
    <NavLink to="/" onClick={() => setOpen(false)} aria-label="Has Door ana sayfa" className="shrink-0">
      <img src="/logo.png" alt="Has Door Logo" className="h-14 w-auto max-w-36 object-contain" />
    </NavLink>
    <button type="button" aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'} aria-expanded={open} aria-controls="site-navigation"
      onClick={() => setOpen(!open)} className="md:hidden border border-slate-200 rounded-lg p-2 text-slate-700">
      {open ? <X size={22} /> : <Menu size={22} />}
    </button>
    <div id="site-navigation" className={`${open ? 'flex' : 'hidden'} absolute top-20 left-0 right-0 bg-white border-t border-slate-100 shadow-md p-4 flex-col gap-1 md:static md:flex md:flex-row md:gap-5 lg:gap-8 md:p-0 md:border-0 md:shadow-none font-medium text-slate-700 md:items-center`}>
      {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}
        className={({ isActive }) => `px-3 py-3 md:p-0 text-sm lg:text-base transition-colors ${isActive ? 'text-[#d7623c]' : 'hover:text-[#d7623c]'}`}>{label}</NavLink>)}
    </div>
  </nav>;
}
