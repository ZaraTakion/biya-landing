import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PolicyApp from './react/PolicyApp';
import './react/policy.css';

const root = document.getElementById('policy-root');
if (!root) throw new Error('Policy root not found.');

createRoot(root).render(
  <StrictMode>
    <PolicyApp />
  </StrictMode>,
);
