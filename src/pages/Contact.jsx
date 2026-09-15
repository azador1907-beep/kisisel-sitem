import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Link,
  useSearchParams,
} from 'react-router-dom';

import {
  ArrowUpRight,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';

import {
  company,
  products,
  whatsapp,
} from '../data/site';

import {
  PageHeading,
  Button,
} from '../components/ui';

import {
  validateContact,
} from '../lib/contact';


/* =========================================================
   WHATSAPP MESAJI
========================================================= */

function createWhatsAppMessage(values) {
  const lines = [
    'Merhaba, Has Door web sitesi üzerinden bilgi / teklif almak istiyorum.',
    '',
    `👤 Ad Soyad: ${values.name || '-'}`,
    `🏢 Firma: ${values.company || '-'}`,
    `📧 E-posta: ${values.email || '-'}`,
    `📞 Telefon: ${values.phone || '-'}`,
    `🚪 İlgilendiğim Ürün: ${values.product || 'Genel bilgi / proje görüşmesi'}`,
    '',
    '📝 Mesaj:',
    values.message || '-',
  ];

  return lines.join('\n');
}


/* =========================================================
   CONTACT
========================================================= */

export default function Contact() {
  const [params] =
    useSearchParams();

  const requestedProduct =
    products.find(
      (product) =>
        product.slug ===
        params.get('urun'),
    );

  const [errors, setErrors] =
    useState({});

  const form =
    useRef(null);


  /* =========================================================
     ÜRÜN SAYFASINDAN GELİNDİYSE ÜRÜNÜ SEÇ
  ========================================================= */

  useEffect(() => {
    if (!form.current) {
      return;
    }

    const productField =
      form.current.elements.namedItem(
        'product',
      );

    if (productField) {
      productField.value =
        requestedProduct?.name ||
        '';
    }
  }, [
    requestedProduct,
  ]);


  /* =========================================================
     WHATSAPP'A GÖNDER
  ========================================================= */

  function sendToWhatsApp(phone) {
    if (!form.current) {
      return;
    }

    const values =
      Object.fromEntries(
        new FormData(
          form.current,
        ),
      );

    const nextErrors =
      validateContact(
        values,
      );

    setErrors(
      nextErrors,
    );

    /*
     * Form hatalıysa WhatsApp açılmaz.
     */
    if (
      Object.keys(
        nextErrors,
      ).length
    ) {
      const firstError =
        Object.keys(
          nextErrors,
        )[0];

      form.current.elements
        .namedItem(
          firstError,
        )
        ?.focus();

      return;
    }

    /*
     * Honeypot doluysa bot olarak kabul et.
     */
    if (
      values._gotcha
    ) {
      return;
    }

    const message =
      createWhatsAppMessage(
        values,
      );

    const url =
      whatsapp(
        message,
        phone,
      );

    /*
     * WhatsApp uygulaması veya WhatsApp Web açılır.
     * Mesaj hazır gelir.
     * Kullanıcı sadece Gönder'e basar.
     */
    window.open(
      url,
      '_blank',
      'noopener,noreferrer',
    );
  }


  /* =========================================================
     FORM FIELD
  ========================================================= */

  const field = (
    name,
    label,
    type = 'text',
    required = false,
    autoComplete,
    placeholder,
  ) => (
    <div className="form-field">
      <label htmlFor={name}>
        {label}

        {required && (
          <span
            aria-hidden="true"
          >
            {' '}*
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        autoComplete={
          autoComplete
        }
        required={required}
        placeholder={
          placeholder
        }
        maxLength={
          name === 'name'
            ? 100
            : name === 'email'
              ? 254
              : name === 'phone'
                ? 25
                : 150
        }
        aria-invalid={
          !!errors[name]
        }
        aria-describedby={
          errors[name]
            ? `${name}-error`
            : undefined
        }
        onChange={() => {
          if (
            errors[name]
          ) {
            setErrors(
              (
                current,
              ) => ({
                ...current,
                [name]:
                  undefined,
              }),
            );
          }
        }}
      />

      {errors[name] && (
        <p
          id={`${name}-error`}
          className="field-error"
        >
          {errors[name]}
        </p>
      )}
    </div>
  );


  return (
    <>
      {/* =====================================================
          SAYFA BAŞLIĞI
      ===================================================== */}

      <PageHeading
        eyebrow="İletişim"
        title={
          <>
            Doğru çözüm,
            <br />
            bir görüşmeyle
            başlar.
          </>
        }
        text="Projenizi, ihtiyaç duyduğunuz kapı sistemini veya aklınızdaki soruları paylaşın. WhatsApp üzerinden doğrudan bize ulaşın."
      />


      {/* =====================================================
          İLETİŞİM
      ===================================================== */}

      <section className="section container contact-grid">

        {/* SOL TARAF */}

        <div className="contact-info">
          <p className="eyebrow">
            HAS DOOR’A ULAŞIN
          </p>

          <h2>
            Projenizi konuşalım.
          </h2>

          <p>
            Teklif ve ürün bilgisi
            için telefon veya
            WhatsApp üzerinden
            bize doğrudan
            ulaşabilirsiniz.
          </p>


          {/* TELEFON */}

          <div className="contact-channel">
            <Phone
              size={21}
              strokeWidth={1.5}
              aria-hidden="true"
            />

            <div>
              <h3>
                Telefon
              </h3>

              <a
                href={
                  company.phoneHref
                }
              >
                {company.phone}
              </a>

              {company.secondPhone &&
                company.secondPhoneHref && (
                  <a
                    href={
                      company.secondPhoneHref
                    }
                  >
                    {
                      company.secondPhone
                    }
                  </a>
                )}
            </div>
          </div>


          {/* WHATSAPP */}

          <div className="contact-channel">
            <MessageCircle
              size={21}
              strokeWidth={1.5}
              aria-hidden="true"
            />

            <div>
              <h3>
                WhatsApp
              </h3>

              <div>
                <div>
                  <a
                    href={whatsapp(
                      undefined,
                      company.phone,
                    )}
                    className="text-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {company.phone}

                    <ArrowUpRight
                      size={16}
                      aria-hidden="true"
                    />
                  </a>
                </div>

                {company.secondPhone && (
                  <div
                    style={{
                      marginTop: 12,
                    }}
                  >
                    <a
                      href={whatsapp(
                        undefined,
                        company.secondPhone,
                      )}
                      className="text-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {
                        company.secondPhone
                      }

                      <ArrowUpRight
                        size={16}
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>


          {/* ADRES */}

          <div className="contact-channel">
            <MapPin
              size={21}
              strokeWidth={1.5}
              aria-hidden="true"
            />

            <div>
              <h3>
                Adres
              </h3>

              <address>
                {company.address}
              </address>

              <a
                href={
                  company.map
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                Yol tarifi al

                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>

          <p className="company-registration">
            Şehitlik V. D. /
            Sicil No: 32913
          </p>
        </div>


        {/* ===================================================
            WHATSAPP FORMU
        =================================================== */}

        <div className="contact-form-panel">
          <p className="eyebrow">
            WHATSAPP TEKLİF FORMU
          </p>

          <h2>
            Size nasıl yardımcı
            olabiliriz?
          </h2>

          <p className="form-intro">
            Formu doldurun ve
            aşağıdaki WhatsApp
            numaralarından birini
            seçin. Bilgileriniz
            hazır mesaj olarak
            WhatsApp’a aktarılacaktır.
          </p>

          <form
            ref={form}
            noValidate
            onSubmit={(
              event,
            ) => {
              event.preventDefault();
            }}
          >

            {/* KİŞİ BİLGİLERİ */}

            <div className="form-grid">
              {field(
                'name',
                'Adınız soyadınız',
                'text',
                true,
                'name',
                'Adınız ve soyadınız',
              )}

              {field(
                'company',
                'Firma adı',
                'text',
                false,
                'organization',
                'İsteğe bağlı',
              )}

              {field(
                'email',
                'E-posta adresiniz',
                'email',
                true,
                'email',
                'ornek@firma.com',
              )}

              {field(
                'phone',
                'Telefon numaranız',
                'tel',
                false,
                'tel',
                '05xx xxx xx xx',
              )}
            </div>


            {/* ÜRÜN */}

            <div className="form-field">
              <label htmlFor="product">
                İlgilendiğiniz ürün
              </label>

              <select
                key={
                  requestedProduct
                    ?.slug ||
                  'all'
                }
                id="product"
                name="product"
                defaultValue={
                  requestedProduct
                    ?.name ||
                  ''
                }
              >
                <option value="">
                  Genel bilgi /
                  proje görüşmesi
                </option>

                {products.map(
                  (product) => (
                    <option
                      key={
                        product.slug
                      }
                      value={
                        product.name
                      }
                    >
                      {
                        product.name
                      }
                    </option>
                  ),
                )}
              </select>
            </div>


            {/* MESAJ */}

            <div className="form-field">
              <label htmlFor="message">
                Projeniz veya
                mesajınız

                <span
                  aria-hidden="true"
                >
                  {' '}*
                </span>
              </label>

              <textarea
                id="message"
                name="message"
                rows="6"
                minLength="10"
                maxLength="3000"
                required
                placeholder="Kapı tipi, ölçüler, adet ve proje detaylarını paylaşabilirsiniz."
                aria-invalid={
                  !!errors.message
                }
                aria-describedby={
                  errors.message
                    ? 'message-error'
                    : undefined
                }
                onChange={() => {
                  if (
                    errors.message
                  ) {
                    setErrors(
                      (
                        current,
                      ) => ({
                        ...current,
                        message:
                          undefined,
                      }),
                    );
                  }
                }}
              />

              {errors.message && (
                <p
                  id="message-error"
                  className="field-error"
                >
                  {
                    errors.message
                  }
                </p>
              )}
            </div>


            {/* BOT KORUMASI */}

            <div
              className="form-honeypot"
              aria-hidden="true"
            >
              <label htmlFor="website">
                Bu alanı boş bırakın
              </label>

              <input
                id="website"
                name="_gotcha"
                tabIndex="-1"
                autoComplete="off"
              />
            </div>


            {/* AÇIKLAMA */}

            <p className="form-privacy">
              Bu formdaki bilgiler
              sunucuya veya e-posta
              adresine gönderilmez.
              Seçtiğiniz WhatsApp
              numarasına hazır mesaj
              olarak aktarılır.{' '}

              <Link to="/gizlilik-politikasi">
                Gizlilik açıklamasını
                okuyun.
              </Link>
            </p>


            {/* ===============================================
                WHATSAPP BUTONLARI
            =============================================== */}

            <div className="button-row">

              <button
                type="button"
                className="button button-dark"
                onClick={() =>
                  sendToWhatsApp(
                    company.phone,
                  )
                }
              >
                <MessageCircle
                  size={18}
                  aria-hidden="true"
                />

                WhatsApp

                <span>
                  {company.phone}
                </span>
              </button>


              {company.secondPhone && (
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() =>
                    sendToWhatsApp(
                      company.secondPhone,
                    )
                  }
                >
                  <MessageCircle
                    size={18}
                    aria-hidden="true"
                  />

                  WhatsApp

                  <span>
                    {
                      company.secondPhone
                    }
                  </span>
                </button>
              )}

            </div>

            <p
              className="technical-note"
              style={{
                marginTop: 16,
              }}
            >
              WhatsApp açıldığında
              mesaj otomatik olarak
              hazırlanır. Mesajın
              gönderilmesi için
              WhatsApp&apos;ta
              “Gönder” düğmesine
              basmanız gerekir.
            </p>

          </form>
        </div>
      </section>


      {/* =====================================================
          HARİTA
      ===================================================== */}

      <MapSection />


      {/* =====================================================
          ALT İLETİŞİM
      ===================================================== */}

      <section className="container contact-bottom">
        <p>
          Doğrudan görüşmeyi mi
          tercih edersiniz?
        </p>

        <Button
          href={
            company.phoneHref
          }
          variant="outline"
        >
          Bizi Arayın
        </Button>
      </section>
    </>
  );
}


/* =========================================================
   HARİTA
========================================================= */

function MapSection() {
  const [
    showMap,
    setShowMap,
  ] = useState(false);

  return (
    <section
      className="container map-section"
      aria-label="Has Door konumu"
    >
      {showMap ? (
        <iframe
          title="Has Door — Şanlıurfa konumu"
          src="https://maps.google.com/maps?q=37.1585807,38.749009&z=16&output=embed"
          width="100%"
          height="360"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="map-placeholder">
          <div
            className="map-lines"
            aria-hidden="true"
          />

          <MapPin
            size={33}
            strokeWidth={1.5}
            aria-hidden="true"
          />

          <p className="eyebrow">
            ŞANLIURFA / TÜRKİYE
          </p>

          <h2>
            Üretimin merkezinde
            buluşalım.
          </h2>

          <p>
            {company.address}
          </p>

          <button
            className="button button-dark"
            type="button"
            onClick={() =>
              setShowMap(
                true,
              )
            }
          >
            Haritayı yükle

            <ArrowUpRight
              size={17}
              aria-hidden="true"
            />
          </button>

          <span>
            Google Haritalar’a
            bağlantı kurar.
          </span>
        </div>
      )}
    </section>
  );
}