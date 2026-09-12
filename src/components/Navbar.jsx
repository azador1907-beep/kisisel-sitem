function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md h-20 flex items-center justify-between px-8">
      
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/logo.png"
          alt="Has Door Logo"
          className="h-14 w-auto"
        />
      </div>

      {/* Menü Linkleri */}
      <div className="flex gap-8 font-medium text-slate-700 items-center">
        <a
          href="/"
          className="hover:text-blue-600 transition-colors"
        >
          Ana Sayfa
        </a>

        <a
          href="/urunler"
          className="hover:text-blue-600 transition-colors"
        >
          Ürünler
        </a>

        <a
          href="/kabin-tasarla"
          className="hover:text-blue-600 transition-colors"
        >
          Kabin Tasarla
        </a>

        <a
          href="/hakkimizda"
          className="hover:text-blue-600 transition-colors"
        >
          Hakkımızda
        </a>

        <a
          href="/iletisim"
          className="hover:text-blue-600 transition-colors"
        >
          İletişim
        </a>
      </div>
    </nav>
  );
}

export default Navbar;