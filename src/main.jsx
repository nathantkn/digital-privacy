import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Reflection from './components/Reflection.jsx';
import LandingPage from './components/LandingPage.jsx';
import BackgroundManager from './components/BackgroundManager.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <BackgroundManager />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<App />} />
        <Route path="/quiz" element={<Reflection />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
