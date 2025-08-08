import React from 'react';
import ReactDOM from 'react-dom/client';

// Find the root element in the HTML.
const rootElement = document.getElementById('root');

// Create a React root and render the App component.
// This is the main entry point for the entire application.
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
