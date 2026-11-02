import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/bitter/400.css';
import '@fontsource/bitter/400-italic.css';
import '@fontsource/bitter/700.css';
import '@fontsource/germania-one/400.css';
import '@fontsource/pirata-one/400.css';
import { App } from './App.tsx';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
