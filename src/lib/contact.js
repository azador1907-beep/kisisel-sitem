/* =========================================================
   İLETİŞİM FORMU YARDIMCILARI
========================================================= */

const MAX_NAME_LENGTH =
  100;

const MAX_EMAIL_LENGTH =
  254;

const MAX_PHONE_LENGTH =
  25;

const MAX_COMPANY_LENGTH =
  150;

const MAX_PRODUCT_LENGTH =
  150;

const MAX_MESSAGE_LENGTH =
  3000;

const MIN_NAME_LENGTH =
  2;

const MIN_MESSAGE_LENGTH =
  10;


/* =========================================================
   METİN TEMİZLEME
========================================================= */

function cleanText(value) {
  return String(
    value ?? '',
  )
    .replaceAll(
      String.fromCharCode(
        0,
      ),
      '',
    )
    .trim();
}


function cleanSingleLine(
  value,
) {
  return cleanText(
    value,
  ).replace(
    /\s+/g,
    ' ',
  );
}


function cleanMessage(
  value,
) {
  return cleanText(
    value,
  ).replace(
    /\r\n?/g,
    '\n',
  );
}


/* =========================================================
   E-POSTA
========================================================= */

function isValidEmail(
  value,
) {
  const email =
    cleanSingleLine(
      value,
    ).toLocaleLowerCase(
      'tr-TR',
    );


  if (!email) {
    return false;
  }


  if (
    email.length >
    MAX_EMAIL_LENGTH
  ) {
    return false;
  }


  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email,
  );
}


/* =========================================================
   TELEFON
========================================================= */

function isValidPhone(
  value,
) {
  const phone =
    cleanSingleLine(
      value,
    );


  /*
   * Telefon zorunlu değil.
   */
  if (!phone) {
    return true;
  }


  if (
    phone.length >
    MAX_PHONE_LENGTH
  ) {
    return false;
  }


  /*
   * İzin verilen örnekler:
   *
   * +90 544 123 45 67
   * 0544 123 45 67
   * (544) 123-45-67
   */
  if (
    !/^[+()\d\s-]+$/.test(
      phone,
    )
  ) {
    return false;
  }


  const digits =
    phone.replace(
      /\D/g,
      '',
    );


  return (
    digits.length >= 7 &&
    digits.length <= 15
  );
}


/* =========================================================
   FORM DOĞRULAMA
========================================================= */

export function validateContact(
  values = {},
) {
  const errors = {};


  const name =
    cleanSingleLine(
      values.name,
    );


  const email =
    cleanSingleLine(
      values.email,
    );


  const phone =
    cleanSingleLine(
      values.phone,
    );


  const company =
    cleanSingleLine(
      values.company,
    );


  const product =
    cleanSingleLine(
      values.product,
    );


  const message =
    cleanMessage(
      values.message,
    );


  /* =========================================================
     AD SOYAD
  ========================================================= */

  if (
    name.length <
    MIN_NAME_LENGTH
  ) {
    errors.name =
      'Lütfen adınızı ve soyadınızı yazın.';
  } else if (
    name.length >
    MAX_NAME_LENGTH
  ) {
    errors.name =
      `Ad alanı en fazla ${MAX_NAME_LENGTH} karakter olabilir.`;
  }


  /* =========================================================
     E-POSTA
  ========================================================= */

  if (
    !isValidEmail(
      email,
    )
  ) {
    errors.email =
      'Geçerli bir e-posta adresi yazın.';
  }


  /* =========================================================
     TELEFON
  ========================================================= */

  if (
    !isValidPhone(
      phone,
    )
  ) {
    errors.phone =
      'Telefon numaranızı kontrol edin.';
  }


  /* =========================================================
     FİRMA
  ========================================================= */

  if (
    company.length >
    MAX_COMPANY_LENGTH
  ) {
    errors.company =
      `Firma adı en fazla ${MAX_COMPANY_LENGTH} karakter olabilir.`;
  }


  /* =========================================================
     ÜRÜN
  ========================================================= */

  if (
    product.length >
    MAX_PRODUCT_LENGTH
  ) {
    errors.product =
      `Ürün alanı en fazla ${MAX_PRODUCT_LENGTH} karakter olabilir.`;
  }


  /* =========================================================
     MESAJ
  ========================================================= */

  if (
    message.length <
    MIN_MESSAGE_LENGTH
  ) {
    errors.message =
      `Projenizi en az ${MIN_MESSAGE_LENGTH} karakterle açıklayın.`;
  } else if (
    message.length >
    MAX_MESSAGE_LENGTH
  ) {
    errors.message =
      `Mesajınız en fazla ${MAX_MESSAGE_LENGTH} karakter olabilir.`;
  }


  return errors;
}


/* =========================================================
   TEMİZLENMİŞ FORM VERİSİ
========================================================= */

export function contactPayload(
  values = {},
) {
  return {
    name:
      cleanSingleLine(
        values.name,
      ),

    email:
      cleanSingleLine(
        values.email,
      ).toLocaleLowerCase(
        'tr-TR',
      ),

    phone:
      cleanSingleLine(
        values.phone,
      ),

    company:
      cleanSingleLine(
        values.company,
      ),

    product:
      cleanSingleLine(
        values.product,
      ),

    message:
      cleanMessage(
        values.message,
      ),

    _gotcha:
      cleanSingleLine(
        values._gotcha,
      ),
  };
}