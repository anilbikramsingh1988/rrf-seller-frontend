// src/main.jsx
// This file is the entry point for your entire application.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Correctly import your main App component.
import './index.css'; // This imports your global styles, including Tailwind CSS.

// This line renders your App component into the HTML element with the id 'root'.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
