export function validateContact(values) {
  const errors = {};
  if (!values.name || values.name.trim().length < 2) errors.name = 'Lütfen adınızı ve soyadınızı yazın.';
  if (values.name?.length > 100) errors.name = 'Ad alanı en fazla 100 karakter olabilir.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email || '') || values.email?.length > 254) errors.email = 'Geçerli bir e-posta adresi yazın.';
  if (values.phone && !/^[+()\d\s-]{7,25}$/.test(values.phone)) errors.phone = 'Telefon numaranızı kontrol edin.';
  if (!values.message || values.message.trim().length < 10) errors.message = 'Projenizi en az 10 karakterle açıklayın.';
  if (values.message?.length > 3000) errors.message = 'Mesajınız en fazla 3000 karakter olabilir.';
  if (values.company?.length > 150) errors.company = 'Firma adı en fazla 150 karakter olabilir.';
  return errors;
}
export function contactPayload(values) {
  return Object.fromEntries(['name','email','phone','company','product','message','_gotcha'].map(key => [key, String(values[key] || '').trim()]));
}
