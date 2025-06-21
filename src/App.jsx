import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Issuer from './pages/Issuer';
import './App.css';

const flagIcon = 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Flag_of_Cameroon.svg';
const eduIcon = 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Graduation_cap.svg';
const walletIcon = 'https://upload.wikimedia.org/wikipedia/commons/3/39/Wallet_Flat_Icon.svg';
const verifyIcon = 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Checkmark_green.svg';
const githubIcon = 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg';

function handleImgError(e) {
  e.target.style.display = 'none';
}

function Wallet() {
  return <div style={{ padding: '2rem' }}><h2>Wallet Page</h2></div>;
}

function Verifier() {
  return <div style={{ padding: '2rem' }}><h2>Verifier Page</h2></div>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/issuer" element={<Issuer />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/verifier" element={<Verifier />} />
      </Routes>
    </Router>
  );
}
