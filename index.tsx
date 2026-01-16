import React from 'react';
import { createRoot } from 'react-dom/client'; // Cambiamos esto para que sea más compatible
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
