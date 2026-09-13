import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, MapPin, MessageCircle, Phone } from 'lucide-react';
import { company, products, whatsapp } from '../data/site';
import { PageHeading, Button } from '../components/ui';
import { contactPayload, validateContact } from '../lib/contact';
export default function Contact() {
  const [params] = useSearchParams();
  const requestedProduct = products.find(p => p.slug === params.get('urun'));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [showMap, setShowMap] = useState(false);
  const lastSent = useRef(0);
  const submitting = useRef(false);
  const form = useRef(null);
  useEffect(() => { if (form.current) form.current.elements.namedItem('product').value = requestedProduct?.name || ''; }, [requestedProduct]);
  async function submit(event) {
    event.preventDefault();
    if (submitting.current) return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const nextErrors = validateContact(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { form.current.elements.namedItem(Object.keys(nextErrors)[0])?.focus(); return; }
    if (values._gotcha) { setStatus('error'); return; }
    if (Date.now() - lastSent.current < 60000) { setStatus('cooldown'); return; }
    submitting.current = true;
    setStatus('sending');
    try {
      const response = await fetch(company.formEndpoint, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(contactPayload(values)), signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error('Delivery failed');
      lastSent.current = Date.now();
      form.current.reset();
      setStatus('success');
    } catch { setStatus('error'); }
    finally { submitting.current = false; }
  }
  const field = (name,label,type='text',required=false,autoComplete,placeholder) => <div className="form-field"><label htmlFor={name}>{label}{required && <span aria-hidden="true"> *</span>}</label><input id={name} name={name} type={type} autoComplete={autoComplete} required={required} placeholder={placeholder} maxLength={name === 'name' ? 100 : name === 'email' ? 254 : name === 'phone' ? 25 : 150} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-error` : undefined} />{errors[name] && <p id={`${name}-error`} className="field-error">{errors[name]}</p>}</div>;
  return <><PageHeading eyebrow="İletişim" title={<>Doğru çözüm,<br />bir görüşmeyle başlar.</>} text="Projenizi, ihtiyaç duyduğunuz kapı sistemini veya aklınızdaki soruları paylaşın. Birlikte değerlendirelim." /><section className="section container contact-grid"><div className="contact-info"><p className="eyebrow">HAS DOOR’A ULAŞIN</p><h2>Projenizi konuşalım.</h2><p>Teklif ve ürün bilgisi için bize ulaşabilirsiniz.</p><div className="contact-channel"><Phone size={21} strokeWidth={1.5} aria-hidden="true" /><div><h3>Telefon</h3><a href={company.phoneHref}>{company.phone}</a><a href={company.secondPhoneHref}>{company.secondPhone}</a></div></div><div className="contact-channel"><MessageCircle size={21} strokeWidth={1.5} aria-hidden="true" /><div><h3>WhatsApp</h3><a href={whatsapp(requestedProduct ? `Merhaba, ${requestedProduct.name} için teklif almak istiyorum.` : undefined)} className="text-link">WhatsApp’tan Bilgi Al <ArrowUpRight size={16} aria-hidden="true" /></a></div></div><div className="contact-channel"><MapPin size={21} strokeWidth={1.5} aria-hidden="true" /><div><h3>Adres</h3><address>{company.address}</address><a href={company.map} target="_blank" rel="noreferrer" className="text-link">Yol tarifi al <ArrowUpRight size={16} aria-hidden="true" /></a></div></div><p className="company-registration">Şehitlik V. D. / Sicil No: 32913</p></div><div className="contact-form-panel"><p className="eyebrow">TEKLİF VE BİLGİ TALEBİ</p><h2>Size nasıl yardımcı olabiliriz?</h2><p className="form-intro">* işaretli alanları doldurmanız yeterli.</p><form ref={form} onSubmit={submit} noValidate><div className="form-grid">{field('name','Adınız soyadınız','text',true,'name','Adınız ve soyadınız')}{field('company','Firma adı','text',false,'organization','İsteğe bağlı')}{field('email','E-posta adresiniz','email',true,'email','ornek@firma.com')}{field('phone','Telefon numaranız','tel',false,'tel','İsteğe bağlı')}</div><div className="form-field"><label htmlFor="product">İlgilendiğiniz ürün</label><select key={requestedProduct?.slug || 'all'} id="product" name="product" defaultValue={requestedProduct?.name || ''}><option value="">Genel bilgi / proje görüşmesi</option>{products.map(p => <option key={p.slug} value={p.name}>{p.name}</option>)}</select></div><div className="form-field"><label htmlFor="message">Projeniz veya mesajınız <span aria-hidden="true">*</span></label><textarea id="message" name="message" rows="5" minLength="10" maxLength="3000" required placeholder="Kapı tipi, ölçüler, adet ve proje detaylarını paylaşabilirsiniz." aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} />{errors.message && <p id="message-error" className="field-error">{errors.message}</p>}</div><div className="form-honeypot" aria-hidden="true"><label htmlFor="website">Bu alanı boş bırakın</label><input id="website" name="_gotcha" tabIndex="-1" autoComplete="off" /></div><p className="form-privacy">Gönderdiğiniz bilgiler talebinize yanıt vermek için kullanılacaktır. <Link to="/gizlilik-politikasi">Gizlilik açıklamasını okuyun.</Link></p><button className="button button-dark" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Gönderiliyor…' : 'Talebimi Gönder'}<ArrowUpRight size={18} aria-hidden="true" /></button><div aria-live="polite" aria-atomic="true">{status === 'success' && <p className="form-feedback success"><CheckCircle2 size={18} aria-hidden="true" />Talebiniz başarıyla iletildi. Teşekkür ederiz.</p>}{status === 'error' && <p className="form-feedback error">Mesajınız iletilemedi. Lütfen tekrar deneyin veya <a href={whatsapp()}>WhatsApp üzerinden ulaşın.</a></p>}{status === 'cooldown' && <p className="form-feedback error">Yeni bir mesaj için lütfen bir dakika bekleyin. Acil bilgi için bizi arayabilirsiniz.</p>}</div></form></div></section><section className="container map-section" aria-label="Has Door konumu">{showMap ? <iframe title="Has Door — Şanlıurfa konumu" src="https://maps.google.com/maps?q=37.1585807,38.749009&z=16&output=embed" width="100%" height="360" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /> : <div className="map-placeholder"><div className="map-lines" aria-hidden="true" /><MapPin size={33} strokeWidth={1.5} aria-hidden="true" /><p className="eyebrow">ŞANLIURFA / TÜRKİYE</p><h2>Üretimin merkezinde buluşalım.</h2><p>{company.address}</p><button className="button button-dark" onClick={() => setShowMap(true)}>Haritayı yükle <ArrowUpRight size={17} aria-hidden="true" /></button><span>Google Haritalar’a bağlantı kurar.</span></div>}</section><section className="container contact-bottom"><p>Doğrudan görüşmeyi mi tercih edersiniz?</p><Button href={company.phoneHref} variant="outline">Bizi Arayın</Button></section></>;
}
