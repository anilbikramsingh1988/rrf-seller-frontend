// ---------------------------------------------
// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Make sure this path is correct

// This is the entry point of your application.
// It finds the root element and renders the App component inside it.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
