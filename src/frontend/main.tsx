// frontend/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Reconstruimos el Proxy en el mundo del Renderer (donde es legal)
const createProxy = (namespace?: string): any => {
  return new Proxy({}, {
    get: (_target, prop: string) => {
      if (namespace) {
        // Usamos el invocador genérico expuesto en el preload
        return (...args: any[]) => (window as any).electronIpc.invoke(`${namespace}:${prop}`, ...args);
      } else {
        return createProxy(prop);
      }
    }
  });
};

// Inyectamos la API tipada en window ANTES de montar React
window.apis = createProxy();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)