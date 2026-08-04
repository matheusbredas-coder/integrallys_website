import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ProtocolPage } from './ProtocolPage';
import { emagrecimentoIntegrado } from '../data/protocols';
import '../index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProtocolPage protocol={emagrecimentoIntegrado} />
  </StrictMode>,
);
