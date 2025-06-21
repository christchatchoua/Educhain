import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import './App.css';

const flagIcon = 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Flag_of_Cameroon.svg';
const eduIcon = 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Graduation_cap.svg';
const walletIcon = 'https://upload.wikimedia.org/wikipedia/commons/3/39/Wallet_Flat_Icon.svg';
const verifyIcon = 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Checkmark_green.svg';
const githubIcon = 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg';

function handleImgError(e) {
  e.target.style.display = 'none';
}

function Issuer() {
  return (
    <div className="page-container"><h2>Issuer Page</h2></div>
  );
}
function Wallet() {
  return (
    <div className="page-container"><h2>Wallet Page</h2></div>
  );
}
function Verifier() {
  return <div className="page-container"><h2>Verifier Page</h2></div>;
}

function AppRoutes() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';
  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/issuer" element={<Issuer />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/verifier" element={<Verifier />} />
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
