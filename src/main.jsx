import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Web3Provider } from '@/context/Web3Context';
import { ProductProvider } from '@/context/ProductContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Web3Provider>
      <ProductProvider>
        <App />
      </ProductProvider>
    </Web3Provider>
  </React.StrictMode>
);
