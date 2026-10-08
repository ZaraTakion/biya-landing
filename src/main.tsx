import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './react/App';
import './css/tokens.css';
import './css/base.css';
import './css/layout.css';
import './css/components.css';
import './css/motion.css';
import './react/react.css';
import './react/design-v2.css';
import './react/design-v6.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found.');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
