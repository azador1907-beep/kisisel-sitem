import { BrowserRouter } from 'react-router-dom';

import Site from './Site';

export default function App() {
  return (
    <BrowserRouter>
      <Site />
    </BrowserRouter>
  );
}