import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error handler for debugging white screen issues
window.onerror = function(message, source, lineno, colno, error) {
  const errorMsg = `Error: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nStack: ${error?.stack}`;
  console.error(errorMsg);
  // Only show alert on live site if it's a white screen
  setTimeout(() => {
    if (document.getElementById('root')?.innerHTML === '') {
      alert("Application failed to load. Please check the console for details.\n\n" + message);
    }
  }, 1000);
  return false;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
