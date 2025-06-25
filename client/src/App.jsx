import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Issuer from './pages/Issuer';
import Wallet from './pages/Wallet';
import Verifier from './pages/Verifier';
import AuthPage from './auth/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const flagIcon = 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Flag_of_Cameroon.svg';
const eduIcon = 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Graduation_cap.svg';
const walletIcon = 'https://upload.wikimedia.org/wikipedia/commons/3/39/Wallet_Flat_Icon.svg';
const verifyIcon = 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Checkmark_green.svg';
const githubIcon = 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg';

function handleImgError(e) {
  e.target.style.display = 'none';
}

function AppRoutes() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isIssuerRoute = location.pathname.startsWith('/issuer');
  const showNavbar = !isHomePage && !isIssuerRoute;

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/issuer" element={<ProtectedRoute requiredRole="issuer"><Issuer /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute requiredRole="wallet"><Wallet /></ProtectedRoute>} />
        <Route path="/verifier" element={<ProtectedRoute requiredRole="verifier"><Verifier /></ProtectedRoute>} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
