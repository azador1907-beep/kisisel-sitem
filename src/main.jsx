import {
  StrictMode,
} from 'react';

import {
  createRoot,
  hydrateRoot,
} from 'react-dom/client';

import App from './App.jsx';

import './index.css';


const root =
  document.getElementById(
    'root',
  );


if (!root) {
  throw new Error(
    'React başlangıç alanı bulunamadı: #root',
  );
}


const app = (
  <StrictMode>
    <App />
  </StrictMode>
);


/*
 * Build sırasında sayfalar önceden HTML
 * olarak oluşturuluyor.
 *
 * Eğer root içinde önceden oluşturulmuş
 * içerik varsa React bunu hydrate eder.
 *
 * Normal geliştirme modunda root boşsa
 * standart React render işlemi yapılır.
 */
if (
  root.hasChildNodes()
) {
  hydrateRoot(
    root,
    app,
  );
} else {
  createRoot(
    root,
  ).render(
    app,
  );
}