import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

declare global {
  interface Window {
    __APP_BOOT_LOGGER__?: {
      log: (level: string, message: string, extra?: unknown) => void;
      markMounted: () => void;
    };
  }
}

if (window.__APP_BOOT_LOGGER__) {
  window.__APP_BOOT_LOGGER__.log('INFO', 'Main module imported. Mounting React Root...');
}

const rootElement = document.getElementById('root') as HTMLElement;

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );

  if (window.__APP_BOOT_LOGGER__) {
    window.__APP_BOOT_LOGGER__.markMounted();
  }
} else {
  if (window.__APP_BOOT_LOGGER__) {
    window.__APP_BOOT_LOGGER__.log('ERROR', 'Root element #root not found in document!');
  }
}

