import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Analytics />
    <SpeedInsights />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
