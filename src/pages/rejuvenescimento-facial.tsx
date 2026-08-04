import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ProtocolPage } from './ProtocolPage';
import { rejuvenescimentoFacial } from '../data/protocols';
import '../index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProtocolPage protocol={rejuvenescimentoFacial} />
  </StrictMode>,
);
