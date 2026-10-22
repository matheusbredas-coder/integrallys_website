import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ProtocolPage } from './ProtocolPage';
import { emagrecimentoIntegrado } from '../data/protocols';
import { initAnalytics } from '../lib/analytics';
import { captureAttribution } from '../lib/attribution';
import '../index.css';

initAnalytics();
captureAttribution();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProtocolPage protocol={emagrecimentoIntegrado} />
  </StrictMode>,
);
