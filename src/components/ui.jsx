import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, ChevronRight, MessageCircle } from 'lucide-react';
import { company, products, whatsapp } from '../data/site';
import imageSizes from '../data/imageSizes.json';
export function Button({ to, href, children, variant = 'dark', ...props }) {
  const className = `button button-${variant}`;
  const content = <>{children}<ArrowUpRight size={18} aria-hidden="true" /></>;
  return href ? <a href={href} className={className} {...props}>{content}</a> : <Link to={to} className={className} {...props}>{content}</Link>;
}
export function Picture({ name, alt, className = '', priority = false, ...props }) {
  const [width,height] = imageSizes[name];
  return <img src={`/media/${name}.webp`} srcSet={width > 360 ? `/media/${name}-360.webp 360w, /media/${name}.webp ${width}w` : undefined} sizes="(max-width: 600px) 90vw, (max-width: 1000px) 50vw, 550px" alt={alt} width={width} height={height} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} className={className} {...props} />;
}
export function Breadcrumb({ items }) {
  return <nav className="breadcrumb" aria-label="İçerik yolu"><ol><li><Link to="/">Ana Sayfa</Link></li>{items.map(({ label, to }) => <li key={label}><ChevronRight size={12} aria-hidden="true" />{to ? <Link to={to}>{label}</Link> : <span aria-current="page">{label}</span>}</li>)}</ol></nav>;
}
export function PageHeading({ eyebrow, title, text, children }) {
  return <div className="page-heading"><div className="container"><Breadcrumb items={[{ label: eyebrow }]} /><div className="page-heading-row"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div><div className="heading-aside">{text && <p>{text}</p>}{children}</div></div></div></div>;
}
export function SectionHeading({ eyebrow, title, text, children }) {
  return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{text && <p className="section-description">{text}</p>}</div>{children}</div>;
}
export function ProductCard({ product, index = 0 }) {
  return <article className="product-card"><Link to={`/urunler/${product.slug}`} className="product-image-link" aria-label={`${product.name} detaylarını incele`}><span className="product-index">0{index + 1} / {product.opening.toLocaleUpperCase('tr')}</span><Picture name={product.image} alt={`Katalogdan türetilmiş temsili görsel: ${product.name}`} /><span className="product-visual-note">Temsili ürün görseli</span><span className="image-arrow"><ArrowUpRight aria-hidden="true" /></span></Link><div className="product-card-body"><p className="eyebrow">{product.category}</p><h3><Link to={`/urunler/${product.slug}`}>{product.name}</Link></h3><p>{product.description}</p><Link className="text-link" to={`/urunler/${product.slug}`}>Teknik detaylar <ArrowRight size={17} aria-hidden="true" /></Link></div></article>;
}
export function CTASection() {
  return <section className="cta-section"><div className="container cta-inner"><div><p className="eyebrow">BİRLİKTE DOĞRU ÇÖZÜMÜ BULALIM</p><h2>Projenizin bir sonraki<br />adımını konuşalım.</h2></div><div><p>İhtiyacınıza uygun kapı sistemini birlikte belirleyelim.</p><Button to="/iletisim" variant="gold">Teklif Al</Button><a className="cta-phone" href={company.phoneHref}>{company.phone}</a></div></div></section>;
}
export function Footer() {
  return <footer className="site-footer"><div className="container footer-grid"><div className="footer-brand"><Link to="/" aria-label="Has Door ana sayfa"><img src="/media/logo.webp" width="180" height="90" alt="Has Door" loading="lazy" /></Link><p>Şanlıurfa'dan, geleceğin yapılarına.<br />Asansör kapılarında kalite, güven ve estetik.</p><a className="text-link" href={whatsapp()}>WhatsApp’tan Bilgi Al <MessageCircle size={17} aria-hidden="true" /></a></div><div><h2>Keşfedin</h2><Link to="/hakkimizda">Hakkımızda</Link><Link to="/hizmetler">Hizmetler</Link><Link to="/projeler">Proje çözümleri</Link><Link to="/kabin-tasarla">Kabin Tasarla</Link><Link to="/katalog">Ürün kataloğu</Link></div><div><h2>Kapı sistemleri</h2>{products.map(p => <Link key={p.slug} to={`/urunler/${p.slug}`}>{p.name}</Link>)}</div><div><h2>Bize ulaşın</h2><a href={company.phoneHref}>{company.phone}</a><a href={company.secondPhoneHref}>{company.secondPhone}</a><address>{company.address}</address><a href={company.map} target="_blank" rel="noreferrer" className="text-link">Yol tarifi <ArrowUpRight size={15} aria-hidden="true" /></a></div></div><div className="container footer-bottom"><p>© {new Date().getFullYear()} Has Door. Tüm hakları saklıdır.</p><div><Link to="/gizlilik-politikasi">Gizlilik</Link><Link to="/cerez-politikasi">Çerezler</Link><span>TÜRKİYE / TR</span></div></div></footer>;
}

