import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Quiz } from '../quiz/Quiz';
import { initAnalytics } from '../lib/analytics';
import { initPixel } from '../lib/pixel';
import '../index.css';

initAnalytics();
initPixel();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Quiz />
  </StrictMode>,
);
