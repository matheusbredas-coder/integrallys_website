import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RostoQuiz } from '../quiz/RostoQuiz';
import { initAnalytics } from '../lib/analytics';
import { captureAttribution } from '../lib/attribution';
import { initPixel } from '../lib/pixel';
import '../index.css';

initAnalytics();
captureAttribution();
initPixel();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RostoQuiz />
  </StrictMode>,
);
