import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/tokens.css';
import App from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Enregistre le service worker (PWA) : mise à jour automatique en arrière-plan
registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')).render(
 <React.StrictMode>
 <App />
 </React.StrictMode>
);
