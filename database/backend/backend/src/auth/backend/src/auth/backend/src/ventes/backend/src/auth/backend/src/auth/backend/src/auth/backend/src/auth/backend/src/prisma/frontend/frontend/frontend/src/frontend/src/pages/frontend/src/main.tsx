import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import POS from './pages/POS';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/admin" element={<div className="p-10 text-3xl">Dashboard Admin (à venir)</div>} />
        <Route path="/manager" element={<div className="p-10 text-3xl">Supervision Manager</div>} />
        <Route path="/entrepot" element={<div className="p-10 text-3xl">Gestion Entrepôt</div>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
