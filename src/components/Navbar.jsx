import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">EduChain <span className="navbar-logo-cm">CM</span></Link>
      </div>
      <div className="navbar-links">
        <Link to="/issuer" className={location.pathname === '/issuer' ? 'active' : ''}>Issuer</Link>
        <Link to="/wallet" className={location.pathname === '/wallet' ? 'active' : ''}>Wallet</Link>
        <Link to="/verifier" className={location.pathname === '/verifier' ? 'active' : ''}>Verifier</Link>
      </div>
    </nav>
  );
} 