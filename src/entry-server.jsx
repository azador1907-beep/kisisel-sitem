import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import Site from './Site';
export function render(url) { return renderToString(<StaticRouter location={url}><Site /></StaticRouter>); }
