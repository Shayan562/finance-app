import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css'; // Import your styles
import App from './App';
import Axios from 'axios';

Axios.defaults.withCredentials = true;

// ... rest of your code ...


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
