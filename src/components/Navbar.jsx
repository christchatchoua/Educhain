import './Navbar.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = async (role) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      if (role === 'issuer') navigate('/issuer');
      else if (role === 'wallet') navigate('/wallet');
      else if (role === 'verifier') navigate('/verifier');
    } else {
      navigate('/auth', { state: { intendedRole: role } });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/">EduChain <span className="navbar-logo-cm">CM</span></a>
      </div>
      <div className="navbar-links">
        <button
          className={location.pathname === '/issuer' ? 'active' : ''}
          onClick={() => handleNavClick('issuer')}
        >
          Issuer
        </button>
        <button
          className={location.pathname === '/wallet' ? 'active' : ''}
          onClick={() => handleNavClick('wallet')}
        >
          Wallet
        </button>
        <button
          className={location.pathname === '/verifier' ? 'active' : ''}
          onClick={() => handleNavClick('verifier')}
        >
          Verifier
        </button>
      </div>
    </nav>
  );
} 