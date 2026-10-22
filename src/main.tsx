import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { initAnalytics } from './lib/analytics';
import { captureAttribution } from './lib/attribution';
import './index.css';

initAnalytics();
captureAttribution();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
